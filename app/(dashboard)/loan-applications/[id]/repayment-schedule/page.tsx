"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLoanApplication, useSubmitCounterOffer } from "@/lib/api/hooks/loan-applications";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  GenerateRepaymentScheduleModal,
  type GenerateRepaymentScheduleFormValues,
  type LocalLoanFee,
} from "../_components/generate-repayment-schedule-modal";

interface PaymentScheduleRow {
  paymentNo: number;
  dueDate: Date;
  paymentDue: number;
  interest: number;
  principal: number;
  outstandingBalance: number;
}

function calculateRepaymentSchedule(
  loanAmount: number,
  interestRate: number,
  repaymentPeriod: number,
  repaymentStructure: string,
  repaymentCycle: string,
  firstPaymentDate: string,
  gracePeriod: number = 0,
  returnType: string = "interest_based"
): PaymentScheduleRow[] {
  const schedule: PaymentScheduleRow[] = [];
  
  // Calculate months between payments based on cycle
  const monthsPerCycle: Record<string, number> = {
    daily: 1/30,
    weekly: 7/30,
    bi_weekly: 14/30,
    monthly: 1,
    quarterly: 3,
  };
  const cycleMonths = monthsPerCycle[repaymentCycle] || 1;
  
  let outstandingBalance = loanAmount;
  const startDate = new Date(firstPaymentDate);
  
  if (returnType === "revenue_sharing") {
    // Revenue Sharing Model:
    // - Revenue Share Rate is a FLAT total percentage (not annual)
    // - Capital is repaid in FULL at the END (bullet style)
    // - Monthly revenue share = Total share / Term
    
    const totalRevenueShare = loanAmount * (interestRate / 100);
    const monthlyRevenueShare = Math.round(totalRevenueShare / repaymentPeriod);
    
    for (let i = 1; i <= repaymentPeriod; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1) * cycleMonths);
      
      const isLastPayment = i === repaymentPeriod;
      
      // Capital redemption only on last payment (bullet style)
      const capitalRedemption = isLastPayment ? loanAmount : 0;
      
      // Total payment = revenue share + capital (if last payment)
      const paymentDue = monthlyRevenueShare + capitalRedemption;
      
      schedule.push({
        paymentNo: i,
        dueDate,
        paymentDue,
        interest: monthlyRevenueShare, // Revenue share distribution
        principal: capitalRedemption,  // Capital redemption
        outstandingBalance: isLastPayment ? 0 : loanAmount, // Balance only changes at end
      });
    }
  } else {
    // Interest-Based Model with Grace Period Support
    const monthlyInterestRate = interestRate / 100 / 12;
    
    // Determine number of grace period payments and amortization payments
    const gracePeriodPayments = gracePeriod;
    const amortizationPayments = repaymentPeriod - gracePeriodPayments;
    
    // Calculate amortized monthly payment (for after grace period)
    let amortizedPayment = 0;
    if (amortizationPayments > 0 && repaymentStructure === "principal_and_interest") {
      amortizedPayment = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, amortizationPayments)) / 
        (Math.pow(1 + monthlyInterestRate, amortizationPayments) - 1);
    }
    
    for (let i = 1; i <= repaymentPeriod; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1) * cycleMonths);
      
      const isGracePeriodPayment = i <= gracePeriodPayments;
      const isLastPayment = i === repaymentPeriod;
      
      let interestPayment: number;
      let principalPayment: number;
      let paymentDue: number;
      
      if (isGracePeriodPayment) {
        // Grace period: Interest-only payments, no principal reduction
        interestPayment = outstandingBalance * monthlyInterestRate;
        principalPayment = 0;
        paymentDue = interestPayment;
        // Balance stays the same during grace period
      } else if (repaymentStructure === "principal_and_interest") {
        // Amortized repayment after grace period
        interestPayment = outstandingBalance * monthlyInterestRate;
        principalPayment = amortizedPayment - interestPayment;
        paymentDue = amortizedPayment;
        outstandingBalance -= principalPayment;
        
        // Handle rounding on last payment
        if (isLastPayment) {
          outstandingBalance = 0;
        }
      } else {
        // Bullet repayment: Interest only until last payment
        interestPayment = outstandingBalance * monthlyInterestRate;
        principalPayment = isLastPayment ? loanAmount : 0;
        paymentDue = isLastPayment ? loanAmount + interestPayment : interestPayment;
        
        if (isLastPayment) {
          outstandingBalance = 0;
        }
      }
      
      schedule.push({
        paymentNo: i,
        dueDate,
        paymentDue,
        interest: interestPayment,
        principal: principalPayment,
        outstandingBalance: Math.max(0, outstandingBalance),
      });
    }
  }
  
  return schedule;
}

export default function RepaymentSchedulePage() {
  const params = useParams();
  const applicationId = params.id as string;
  const { data: loanApplication, isLoading } = useLoanApplication(applicationId);
  const submitCounterOfferMutation = useSubmitCounterOffer();
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);

  const handleRegenerateSubmit = async (
    data: GenerateRepaymentScheduleFormValues,
    fees: LocalLoanFee[]
  ) => {
    try {
      // Transform form data to API payload
      const repaymentCycleMap: Record<string, "daily" | "weekly" | "bi_weekly" | "monthly" | "quarterly"> = {
        every_30_days: "monthly",
        every_45_days: "monthly",
        every_60_days: "bi_weekly",
        every_90_days: "quarterly",
      };

      const repaymentStructureMap: Record<string, "principal_and_interest" | "bullet_repayment"> = {
        principal_interest_amortized: "principal_and_interest",
        bullet_repayment: "bullet_repayment",
      };

      const returnTypeMap: Record<string, "interest_based" | "revenue_sharing"> = {
        interest_based: "interest_based",
        revenue_share: "revenue_sharing",
      };

      // Transform custom fees
      const customFees = fees.map((fee) => ({
        name: fee.name,
        amount: parseFloat(fee.rate),
        type: fee.calculationMethod as "flat" | "percentage",
      }));

      // Calculate grace period in days
      let gracePeriodInDays: number | undefined;
      if (data.gracePeriod) {
        const gracePeriodValue = parseInt(data.gracePeriod);
        if (data.gracePeriodUnit === "months") {
          gracePeriodInDays = gracePeriodValue * 30;
        } else {
          gracePeriodInDays = gracePeriodValue;
        }
      }

      await submitCounterOfferMutation.mutateAsync({
        id: applicationId,
        data: {
          fundingAmount: parseFloat(data.approvedLoanAmount),
          repaymentPeriod: parseInt(data.approvedLoanTenure),
          returnType: returnTypeMap[data.returnType] || "interest_based",
          interestRate: parseFloat(data.interestRate),
          repaymentStructure: repaymentStructureMap[data.repaymentStructure] || "principal_and_interest",
          repaymentCycle: repaymentCycleMap[data.repaymentCycle] || "monthly",
          gracePeriod: gracePeriodInDays,
          firstPaymentDate: data.firstPaymentDate,
          customFees: customFees.length > 0 ? customFees : undefined,
        },
      });

      toast.success("Repayment schedule regenerated successfully.");
      setRegenerateModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to regenerate schedule.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primaryGrey-500">Loading repayment schedule...</div>
      </div>
    );
  }

  if (!loanApplication) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primaryGrey-500">Loan application not found</div>
      </div>
    );
  }

  // Use activeVersion if available, otherwise fall back to base loan data
  const activeVersion = loanApplication.activeVersion;
  const loanAmount = activeVersion?.fundingAmount ?? loanApplication.fundingAmount;
  const currency = loanApplication.fundingCurrency;
  const repaymentPeriod = activeVersion?.repaymentPeriod ?? loanApplication.repaymentPeriod;
  const interestRate = activeVersion?.interestRate ?? loanApplication.interestRate;
  const repaymentStructure = activeVersion?.repaymentStructure ?? "principal_and_interest";
  const repaymentCycle = activeVersion?.repaymentCycle ?? "monthly";
  const gracePeriodDays = activeVersion?.gracePeriod ?? 0;
  // Convert grace period from days to months (approximate: 30 days = 1 month)
  const gracePeriodMonths = Math.round(gracePeriodDays / 30);
  const firstPaymentDate = activeVersion?.firstPaymentDate ?? new Date().toISOString();
  const customFees = activeVersion?.customFees ?? [];
  const returnType = activeVersion?.returnType ?? "interest_based";

  // Calculate total facility fee
  const facilityFee = customFees.reduce((total, fee) => {
    if (fee.type === "flat") {
      return total + fee.amount;
    } else {
      return total + (loanAmount * fee.amount / 100);
    }
  }, 0);

  // Generate repayment schedule
  const schedule = calculateRepaymentSchedule(
    loanAmount,
    interestRate,
    repaymentPeriod,
    repaymentStructure,
    repaymentCycle,
    firstPaymentDate,
    gracePeriodMonths,
    returnType
  );

  // Calculate totals
  const totalPaymentDue = schedule.reduce((sum, row) => sum + row.paymentDue, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
  const totalPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Map repayment cycle to display text
  const cycleDisplayMap: Record<string, string> = {
    daily: "Daily",
    weekly: "Weekly",
    bi_weekly: "Bi-weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
  };

  // For interest-based with grace period, show the amortized payment (not grace period interest-only)
  // For revenue sharing, show the regular monthly share (excluding final capital redemption)
  const getMonthlyPayment = () => {
    if (schedule.length === 0) return 0;
    
    if (returnType === "revenue_sharing") {
      // Revenue sharing: monthly payment is the revenue share (same each month)
      return schedule[0].interest; // Revenue share distribution
    } else {
      // Interest-based: find the first non-grace period payment
      const firstAmortizedPayment = schedule.find((row, index) => index >= gracePeriodMonths);
      return firstAmortizedPayment ? firstAmortizedPayment.paymentDue : schedule[0].paymentDue;
    }
  };
  const monthlyPayment = getMonthlyPayment();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-midnight-blue">Loan repayment schedule</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setRegenerateModalOpen(true)}
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Schedule
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-midnight-blue hover:bg-midnight-blue/90"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            Download Schedule
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border">
        {/* Title Bar */}
        <div className="bg-primary-green text-white text-center py-3 font-semibold text-lg">
          LOAN REPAYMENT SCHEDULE
        </div>

        {/* Business Name */}
        <div className="bg-gray-50 text-center py-2 border-b">
          <p className="text-sm font-medium text-gray-700">{loanApplication.businessName}</p>
        </div>

        {/* Loan Summary */}
        <div className="p-6 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">LOAN SUMMARY</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Loan Amount</span>
              <span className="text-sm font-medium">{currency} {formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Loan Term</span>
              <span className="text-sm font-medium">{repaymentPeriod} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {returnType === "revenue_sharing" ? "Revenue Share Rate" : "Annual Interest Rate"}
              </span>
              <span className="text-sm font-medium">{interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Frequency</span>
              <span className="text-sm font-medium">{cycleDisplayMap[repaymentCycle] || "Monthly"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Grace Period</span>
              <span className="text-sm font-medium">{gracePeriodMonths > 0 ? `${gracePeriodMonths} months` : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">First Payment Date</span>
              <span className="text-sm font-medium">{format(new Date(firstPaymentDate), "do MMMM yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monthly Payment</span>
              <span className="text-sm font-medium">{currency} {formatCurrency(monthlyPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {returnType === "revenue_sharing" ? "Total Revenue Share" : "Total Payable Interest"}
              </span>
              <span className="text-sm font-medium">{currency} {formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Facility Fee</span>
              <span className="text-sm font-medium">{currency} {formatCurrency(facilityFee)} {customFees.length > 0 ? 'incl. VAT' : ''}</span>
            </div>
          </div>
        </div>

        {/* Payment Schedule Table */}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-midnight-blue text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase sticky left-0 bg-midnight-blue">Payment No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Due Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Payment Due</th>
                {returnType === "revenue_sharing" ? (
                  <>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Rev. Share Distribution</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Capital Redemption</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Interest</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Principal</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Outstanding Balance</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Initial Balance Row - only for interest-based loans */}
              {returnType !== "revenue_sharing" && (
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-3 text-sm sticky left-0 bg-gray-50" colSpan={6}>
                    <span className="font-medium">Starting Balance:</span> {currency} {formatCurrency(loanAmount)}
                  </td>
                </tr>
              )}
              
              {/* Payment Rows */}
              {schedule.map((row, index) => (
                <tr key={row.paymentNo} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className={`px-4 py-3 text-sm sticky left-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>{row.paymentNo}</td>
                  <td className="px-4 py-3 text-sm">{format(row.dueDate, "do-MMM-yyyy")}</td>
                  <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(row.paymentDue)}</td>
                  <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(row.interest)}</td>
                  <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(row.principal)}</td>
                  {returnType !== "revenue_sharing" && (
                    <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(row.outstandingBalance)}</td>
                  )}
                </tr>
              ))}
              
              {/* Total Row */}
              <tr className="bg-midnight-blue text-white font-semibold sticky bottom-0">
                <td className="px-4 py-3 text-sm sticky left-0 bg-midnight-blue" colSpan={2}>TOTAL</td>
                <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(totalPaymentDue)}</td>
                <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(totalInterest)}</td>
                <td className="px-4 py-3 text-sm text-right">{currency} {formatCurrency(totalPrincipal)}</td>
                {returnType !== "revenue_sharing" && (
                  <td className="px-4 py-3 text-sm text-right"></td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regenerate Schedule Modal */}
      <GenerateRepaymentScheduleModal
        open={regenerateModalOpen}
        onOpenChange={setRegenerateModalOpen}
        onSubmit={handleRegenerateSubmit}
        isLoading={submitCounterOfferMutation.isPending}
        loanApplicationData={{
          fundingAmount: loanApplication.activeVersion?.fundingAmount ?? loanApplication.fundingAmount,
          fundingCurrency: loanApplication.fundingCurrency,
          repaymentPeriod: loanApplication.activeVersion?.repaymentPeriod ?? loanApplication.repaymentPeriod,
          interestRate: loanApplication.activeVersion?.interestRate ?? loanApplication.interestRate,
          returnType: loanApplication.activeVersion?.returnType,
          repaymentStructure: loanApplication.activeVersion?.repaymentStructure,
          repaymentCycle: loanApplication.activeVersion?.repaymentCycle,
          gracePeriod: loanApplication.activeVersion?.gracePeriod,
          firstPaymentDate: loanApplication.activeVersion?.firstPaymentDate,
          customFees: loanApplication.activeVersion?.customFees,
        }}
        loanProductId={loanApplication.loanProductId}
      />
    </div>
  );
}
