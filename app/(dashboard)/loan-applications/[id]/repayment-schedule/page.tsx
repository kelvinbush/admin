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

  const generatePDF = () => {
    if (!loanApplication) {
      toast.error('Loan application data not available');
      return;
    }

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download the PDF');
      return;
    }

    // Generate PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Loan Repayment Schedule - ${loanApplication.businessName}</title>
        <style>
          @page {
            margin: 20mm;
            size: A4;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #00CC99;
            padding-bottom: 20px;
          }
          
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #00CC99;
            margin-bottom: 10px;
          }
          
          .title {
            font-size: 18px;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 5px;
          }
          
          .subtitle {
            font-size: 14px;
            color: #666;
          }
          
          .loan-summary {
            background: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          
          .summary-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1a365d;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .summary-label {
            font-weight: 500;
            color: #4a5568;
          }
          
          .summary-value {
            font-weight: bold;
            color: #1a365d;
          }
          
          .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
          }
          
          .schedule-table th {
            background: #1a365d;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
          }
          
          .schedule-table th:nth-child(n+3) {
            text-align: right;
          }
          
          .schedule-table td {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .schedule-table td:nth-child(n+3) {
            text-align: right;
          }
          
          .schedule-table tbody tr:nth-child(even) {
            background: #f8f9fa;
          }
          
          .total-row {
            background: #1a365d !important;
            color: white;
            font-weight: bold;
          }
          
          .disclaimer {
            margin-top: 30px;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            font-size: 10px;
            line-height: 1.5;
          }
          
          .disclaimer-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #856404;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          
          @media print {
            body { print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">LOAN MANAGEMENT SYSTEM</div>
          <div class="title">LOAN REPAYMENT SCHEDULE</div>
          <div class="subtitle">${loanApplication.businessName}</div>
        </div>
        
        <div class="loan-summary">
          <div class="summary-title">LOAN SUMMARY</div>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Loan Amount</span>
              <span class="summary-value">${currency} ${formatCurrency(loanAmount)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Loan Term</span>
              <span class="summary-value">${repaymentPeriod} months</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">${returnType === "revenue_sharing" ? "Revenue Share Rate" : "Annual Interest Rate"}</span>
              <span class="summary-value">${interestRate}%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Payment Frequency</span>
              <span class="summary-value">${cycleDisplayMap[repaymentCycle] || "Monthly"}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Grace Period</span>
              <span class="summary-value">${gracePeriodMonths > 0 ? `${gracePeriodMonths} months` : "-"}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">First Payment Date</span>
              <span class="summary-value">${format(new Date(firstPaymentDate), "do MMMM yyyy")}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Monthly Payment</span>
              <span class="summary-value">${currency} ${formatCurrency(monthlyPayment)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">${returnType === "revenue_sharing" ? "Total Revenue Share" : "Total Payable Interest"}</span>
              <span class="summary-value">${currency} ${formatCurrency(totalInterest)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Facility Fee</span>
              <span class="summary-value">${currency} ${formatCurrency(facilityFee)} ${customFees.length > 0 ? 'incl. VAT' : ''}</span>
            </div>
          </div>
        </div>
        
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Payment No.</th>
              <th>Due Date</th>
              <th>Payment Due</th>
              ${returnType === "revenue_sharing" ? 
                '<th>Rev. Share Distribution</th><th>Capital Redemption</th>' : 
                '<th>Interest</th><th>Principal</th><th>Outstanding Balance</th>'
              }
            </tr>
          </thead>
          <tbody>
            ${schedule.map(row => `
              <tr>
                <td>${row.paymentNo}</td>
                <td>${format(row.dueDate, "do-MMM-yyyy")}</td>
                <td>${currency} ${formatCurrency(row.paymentDue)}</td>
                <td>${currency} ${formatCurrency(row.interest)}</td>
                <td>${currency} ${formatCurrency(row.principal)}</td>
                ${returnType !== "revenue_sharing" ? `<td>${currency} ${formatCurrency(row.outstandingBalance)}</td>` : ''}
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="2">TOTAL</td>
              <td>${currency} ${formatCurrency(totalPaymentDue)}</td>
              <td>${currency} ${formatCurrency(totalInterest)}</td>
              <td>${currency} ${formatCurrency(totalPrincipal)}</td>
              ${returnType !== "revenue_sharing" ? '<td></td>' : ''}
            </tr>
          </tbody>
        </table>
        
        <div class="disclaimer">
          <div class="disclaimer-title">IMPORTANT DISCLAIMER</div>
          <p>This repayment schedule is provided for informational purposes only and represents the current terms of the loan agreement. Actual payment amounts and dates may vary based on the final loan agreement terms and conditions. This document does not constitute a binding agreement or guarantee of loan approval.</p>
          <br>
          <p>Interest calculations are based on the specified rate and repayment structure. Early repayment, late payments, or changes to the loan terms may affect the actual repayment schedule. Please refer to your signed loan agreement for the definitive terms and conditions.</p>
          <br>
          <p>For questions regarding this repayment schedule or your loan terms, please contact your loan officer or our customer service team.</p>
        </div>
        
        <div class="footer">
          <p>Generated on ${format(new Date(), "PPPP 'at' p")}</p>
          <p>Loan Application ID: ${loanApplication.loanId}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContent);
    printWindow.document.close();
  };

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

  // Only show repayment schedule at document_generation stage
  if (loanApplication.status !== "document_generation") {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="text-lg font-medium text-midnight-blue">
            Repayment Schedule Not Available
          </div>
          <div className="text-primaryGrey-500 max-w-md">
            The repayment schedule will be available once the loan reaches the document generation stage.
          </div>
          <div className="text-sm text-primaryGrey-400">
            Current stage: <span className="font-medium capitalize">{loanApplication.status.replace(/_/g, ' ')}</span>
          </div>
        </div>
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
            onClick={generatePDF}
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
