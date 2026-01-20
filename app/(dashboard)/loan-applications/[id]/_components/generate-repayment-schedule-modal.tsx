"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalSelect } from "@/components/ui/modal-select";
import { Pencil, Trash2 } from "lucide-react";
import { useLoanProduct } from "@/lib/api/hooks/loan-products";

// Local loan fee type (not connected to backend)
export interface LocalLoanFee {
  id: string;
  name: string;
  calculationMethod: string;
  rate: string;
  collectionRule: string;
  allocationMethod: string;
  calculationBasis: string;
}

const formSchema = z.object({
  approvedLoanAmount: z.string().min(1, "Approved loan amount is required"),
  currency: z.string().min(1, "Currency is required"),
  approvedLoanTenure: z.string().min(1, "Approved loan tenure is required"),
  returnType: z.enum(["interest_based", "revenue_share"]).refine((val) => !!val, {
    message: "Return type is required",
  }),
  interestRate: z.string().min(1, "Interest rate is required"),
  interestRatePeriod: z.string().min(1, "Interest rate period is required"),
  repaymentStructure: z.string().min(1, "Repayment structure is required"),
  repaymentCycle: z.string().min(1, "Repayment cycle is required"),
  gracePeriod: z.string().optional(),
  gracePeriodUnit: z.string().optional(),
  firstPaymentDate: z.string().min(1, "First payment date is required"),
});

export type GenerateRepaymentScheduleFormValues = z.infer<typeof formSchema>;

interface GenerateRepaymentScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GenerateRepaymentScheduleFormValues, fees: LocalLoanFee[]) => void;
  isLoading: boolean;
  loanApplicationData?: {
    fundingAmount?: number;
    fundingCurrency?: string;
    repaymentPeriod?: number;
    interestRate?: number;
  };
  loanProductId?: string;
}

const returnTypeOptions = [
  { label: "Interest-based", value: "interest_based" },
  { label: "Revenue Share Based", value: "revenue_share" },
];

const interestRatePeriodOptions = [
  { label: "per month", value: "per_month" },
  { label: "per annum", value: "per_annum" },
];

const repaymentStructureOptions = [
  {
    label: "Principal & Interest (Amortized)",
    value: "principal_interest_amortized",
    description: "Repayments include both principal and interest, with the loan balance reducing gradually over time.",
  },
  {
    label: "Bullet Repayment",
    value: "bullet_repayment",
    description: "Interest or returns paid during the loan term, with the full principal repaid in a lump sum at the end.",
  },
];

const repaymentCycleOptions = [
  { label: "Every 30 days", value: "every_30_days" },
  { label: "Every 45 days", value: "every_45_days" },
  { label: "Every 60 days", value: "every_60_days" },
  { label: "Every 90 days", value: "every_90_days" },
];

const gracePeriodUnitOptions = [
  { label: "days", value: "days" },
  { label: "months", value: "months" },
];

const calculationMethodOptions = [
  { label: "Flat", value: "flat" },
  { label: "Percentage", value: "percentage" },
];

const collectionRuleOptions = [
  { label: "Upfront", value: "upfront" },
  { label: "End-of-Term", value: "end_of_term" },
];

const allocationMethodOptions = [
  { label: "Cleared in the 1st installment", value: "first_installment" },
  { label: "Spread over installments", value: "spread_installments" },
];

const calculationBasisOptions = [
  { label: "Principal", value: "principal" },
  { label: "Total Disbursed Amount", value: "total_disbursed" },
];

export function GenerateRepaymentScheduleModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  loanApplicationData,
  loanProductId,
}: GenerateRepaymentScheduleModalProps) {
  const [loanFees, setLoanFees] = useState<LocalLoanFee[]>([]);
  const [addFeeModalOpen, setAddFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<LocalLoanFee | null>(null);

  // Fetch loan product details including fees
  const { data: loanProduct } = useLoanProduct(loanProductId || "");

  const form = useForm<GenerateRepaymentScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approvedLoanAmount: loanApplicationData?.fundingAmount?.toString() || "",
      currency: loanApplicationData?.fundingCurrency || "KES",
      approvedLoanTenure: loanApplicationData?.repaymentPeriod?.toString() || "",
      returnType: "interest_based",
      interestRate: loanApplicationData?.interestRate?.toString() || "",
      interestRatePeriod: "per_month",
      repaymentStructure: "",
      repaymentCycle: "",
      gracePeriod: "",
      gracePeriodUnit: "days",
      firstPaymentDate: "",
    },
  });

  useEffect(() => {
    if (open && loanApplicationData) {
      // Map loan product repayment frequency to repayment cycle
      let repaymentCycle = "";
      if (loanProduct?.repaymentFrequency) {
        const frequencyMap: Record<string, string> = {
          monthly: "every_30_days",
          quarterly: "every_90_days",
        };
        repaymentCycle = frequencyMap[loanProduct.repaymentFrequency] || "";
      }

      // Map loan product rate period to interest rate period
      let interestRatePeriod = "per_month";
      if (loanProduct?.ratePeriod) {
        const periodMap: Record<string, string> = {
          per_year: "per_annum",
          per_month: "per_month",
        };
        interestRatePeriod = periodMap[loanProduct.ratePeriod] || "per_month";
      }

      // Calculate grace period from loan product
      let gracePeriod = "";
      let gracePeriodUnit = "days";
      if (loanProduct?.maxGracePeriod) {
        gracePeriod = loanProduct.maxGracePeriod.toString();
        gracePeriodUnit = loanProduct.maxGraceUnit || "days";
      } else if (loanProduct?.gracePeriodDays) {
        gracePeriod = loanProduct.gracePeriodDays.toString();
        gracePeriodUnit = "days";
      }

      // Repopulate form when modal opens with latest data
      form.reset({
        approvedLoanAmount: loanApplicationData.fundingAmount?.toString() || "",
        currency: loanApplicationData.fundingCurrency || "KES",
        approvedLoanTenure: loanApplicationData.repaymentPeriod?.toString() || "",
        returnType: "interest_based",
        interestRate: loanApplicationData.interestRate?.toString() || "",
        interestRatePeriod,
        repaymentStructure: "", // Leave empty - no direct mapping from loan product
        repaymentCycle,
        gracePeriod,
        gracePeriodUnit,
        firstPaymentDate: "",
      });

      // Populate loan fees from loan product if available
      if (loanProduct?.fees && loanProduct.fees.length > 0) {
        const productFees: LocalLoanFee[] = loanProduct.fees.map((fee, index) => ({
          id: `product-fee-${index}`,
          name: fee.feeName || `Fee ${index + 1}`,
          calculationMethod: fee.calculationMethod,
          rate: fee.rate.toString(),
          collectionRule: fee.collectionRule,
          allocationMethod: fee.allocationMethod,
          calculationBasis: fee.calculationBasis,
        }));
        setLoanFees(productFees);
      }
    } else if (!open) {
      setLoanFees([]);
      setEditingFee(null);
    }
  }, [open, loanApplicationData, loanProduct, form]);

  const handleSubmit = (values: GenerateRepaymentScheduleFormValues) => {
    onSubmit(values, loanFees);
  };

  const handleAddFee = (fee: Omit<LocalLoanFee, "id">) => {
    const newFee: LocalLoanFee = {
      ...fee,
      id: Date.now().toString(),
    };
    setLoanFees([...loanFees, newFee]);
    setAddFeeModalOpen(false);
  };

  const handleEditFee = (fee: LocalLoanFee) => {
    setLoanFees(loanFees.map((f) => (f.id === fee.id ? fee : f)));
    setEditingFee(null);
  };

  const handleRemoveFee = (id: string) => {
    setLoanFees(loanFees.filter((f) => f.id !== id));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium">
              Additional details
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Fill in the required information below to proceed to the next step
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic loan details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary-green">
                  Basic loan details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="approvedLoanAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved loan amount *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5,000.00"
                              {...field}
                              className="flex-1"
                            />
                          </FormControl>
                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field: currencyField }) => (
                              <Select
                                onValueChange={currencyField.onChange}
                                defaultValue={currencyField.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="KES">KES</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="approvedLoanTenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved loan tenure *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input type="number" placeholder="6" {...field} className="flex-1" />
                          </FormControl>
                          <div className="flex items-center px-3 border rounded-md bg-gray-50 text-sm text-gray-600">
                            months
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Loan pricing & return structure */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary-green">
                  Loan pricing & return structure
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="returnType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return type *</FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={returnTypeOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select return type"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest rate (%) *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter percentage"
                              {...field}
                              className="flex-1"
                            />
                          </FormControl>
                          <FormField
                            control={form.control}
                            name="interestRatePeriod"
                            render={({ field: periodField }) => (
                              <Select
                                onValueChange={periodField.onChange}
                                defaultValue={periodField.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {interestRatePeriodOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Loan repayment terms */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary-green">
                  Loan repayment terms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="repaymentStructure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repayment structure *</FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={repaymentStructureOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select repayment structure"
                          />
                        </FormControl>
                        {field.value && (
                          <p className="text-xs text-gray-500 mt-1">
                            {repaymentStructureOptions.find((opt) => opt.value === field.value)?.description}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repaymentCycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repayment cycle *</FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={repaymentCycleOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select repayment cycle"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gracePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace period (optional)</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter value"
                              {...field}
                              className="flex-1"
                            />
                          </FormControl>
                          <FormField
                            control={form.control}
                            name="gracePeriodUnit"
                            render={({ field: unitField }) => (
                              <Select
                                onValueChange={unitField.onChange}
                                defaultValue={unitField.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {gracePeriodUnitOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstPaymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First payment date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Loan fees */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-primary-green">Loan fees</h3>
                  <Button
                    type="button"
                    onClick={() => setAddFeeModalOpen(true)}
                    className="h-9 px-4 text-white border-0"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                    }}
                  >
                    + Add Loan Fee
                  </Button>
                </div>

                {loanFees.length > 0 ? (
                  <div className="rounded-md border border-primaryGrey-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#E8E9EA] border-b border-[#B6BABC]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            NAME
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            CALCULATION METHOD
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            RATE
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            COLLECTION RULE
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            ALLOCATION METHOD
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            CALCULATED BASED ON
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-primaryGrey-100">
                        {loanFees.map((fee) => (
                          <tr key={fee.id} className="hover:bg-primaryGrey-50">
                            <td className="px-4 py-3 text-midnight-blue">{fee.name}</td>
                            <td className="px-4 py-3 text-midnight-blue capitalize">
                              {fee.calculationMethod}
                            </td>
                            <td className="px-4 py-3 text-midnight-blue">
                              {fee.calculationMethod === "percentage" ? `${fee.rate}%` : fee.rate}
                            </td>
                            <td className="px-4 py-3 text-midnight-blue capitalize">
                              {fee.collectionRule.replace(/_/g, " ")}
                            </td>
                            <td className="px-4 py-3 text-midnight-blue capitalize">
                              {fee.allocationMethod.replace(/_/g, " ")}
                            </td>
                            <td className="px-4 py-3 text-midnight-blue capitalize">
                              {fee.calculationBasis.replace(/_/g, " ")}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingFee(fee)}
                                  className="text-primary-green hover:text-primary-green/80"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFee(fee.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-primaryGrey-400 text-center py-8 border border-dashed border-primaryGrey-200 rounded-md">
                    No loan fees added yet
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="text-white border-0"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                  }}
                >
                  {isLoading ? "Generating..." : "Generate Schedule"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Loan Fee Modal */}
      <LoanFeeModal
        open={addFeeModalOpen || !!editingFee}
        onOpenChange={(open) => {
          if (!open) {
            setAddFeeModalOpen(false);
            setEditingFee(null);
          }
        }}
        onSubmit={(fee) => {
          if (editingFee) {
            handleEditFee({ ...fee, id: editingFee.id });
          } else {
            handleAddFee(fee);
          }
        }}
        initialValues={editingFee || undefined}
        mode={editingFee ? "edit" : "add"}
      />
    </>
  );
}

// Loan Fee Modal Component
interface LoanFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (fee: Omit<LocalLoanFee, "id">) => void;
  initialValues?: LocalLoanFee;
  mode: "add" | "edit";
}

const loanFeeSchema = z.object({
  name: z.string().min(1, "Fee name is required"),
  calculationMethod: z.string().min(1, "Calculation method is required"),
  rate: z.string().min(1, "Rate is required"),
  collectionRule: z.string().min(1, "Collection rule is required"),
  allocationMethod: z.string().min(1, "Allocation method is required"),
  calculationBasis: z.string().min(1, "Calculation basis is required"),
});

type LoanFeeFormValues = z.infer<typeof loanFeeSchema>;

function LoanFeeModal({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  mode,
}: LoanFeeModalProps) {
  const form = useForm<LoanFeeFormValues>({
    resolver: zodResolver(loanFeeSchema),
    defaultValues: initialValues || {
      name: "",
      calculationMethod: "",
      rate: "",
      collectionRule: "",
      allocationMethod: "",
      calculationBasis: "",
    },
  });

  useEffect(() => {
    if (open && initialValues) {
      form.reset(initialValues);
    } else if (!open) {
      form.reset({
        name: "",
        calculationMethod: "",
        rate: "",
        collectionRule: "",
        allocationMethod: "",
        calculationBasis: "",
      });
    }
  }, [open, initialValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            {mode === "edit" ? "Edit" : "Add"} Loan Fee
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., One-time fee" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calculationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calculation method *</FormLabel>
                    <FormControl>
                      <ModalSelect
                        options={calculationMethodOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select calculation method"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="collectionRule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection rule *</FormLabel>
                  <FormControl>
                    <ModalSelect
                      options={collectionRuleOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select collection rule"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allocationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocation method *</FormLabel>
                  <FormControl>
                    <ModalSelect
                      options={allocationMethodOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select allocation method"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calculationBasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calculated based on *</FormLabel>
                  <FormControl>
                    <ModalSelect
                      options={calculationBasisOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select calculation basis"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white border-0"
                style={{
                  background:
                    "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                }}
              >
                {mode === "edit" ? "Save" : "Add Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
