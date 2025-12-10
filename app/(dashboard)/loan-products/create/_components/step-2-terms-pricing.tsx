"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  SelectWithDescription,
  type SelectOption,
} from "@/components/ui/select-with-description";
import {
  InterestRatePeriodEnum,
  AmortizationMethodEnum,
  RepaymentFrequencyEnum,
} from "@/lib/validations/loan-product";
import { useLoanProductForm } from "../_context/loan-product-form-context";

type Step2TermsPricingValues = {
  repaymentFrequency: string;
  maxGracePeriod: string;
  maxGraceUnit: string;
  interestRate: string;
  ratePeriod: string;
  amortizationMethod: string;
  interestCollectionMethod: string;
  interestRecognitionCriteria: string;
};

type Step2TermsPricingProps = {
  onBack?: () => void;
  onContinue?: () => void;
};

const repaymentCycleOptions = RepaymentFrequencyEnum.map((value) => {
  switch (value) {
    case "weekly":
      return { value, label: "Every 7 days" };
    case "biweekly":
      return { value, label: "Every 14 days" };
    case "monthly":
      return { value, label: "Every 30 days" };
    case "quarterly":
      return { value, label: "Every 90 days" };
    default:
      return { value, label: value };
  }
});

const ratePeriodOptions = InterestRatePeriodEnum.map((value) => {
  const label = value
    .replace("per_", "per ")
    .replace("quarter", "quarter")
    .replace("year", "year");
  return { value, label };
});

const amortizationOptions = AmortizationMethodEnum.map((value) => {
  const label =
    value === "flat"
      ? "Flat rate"
      : value === "reducing_balance"
        ? "Reducing balance"
        : value;
  return { value, label };
});

const graceUnits = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
  { value: "years", label: "years" },
];

const interestCollectionOptions: SelectOption[] = [
  {
    value: "installments",
    label: "Loan installments (conventional)",
    description:
      "Interest is paid in equal installments along with the principal amount over the loan term.",
  },
  {
    value: "deducted",
    label: "Deducted (from disbursement)",
    description:
      "Interest is deducted upfront from the total loan amount at the time of disbursement.",
  },
  {
    value: "capitalized",
    label: "Capitalized (sharia-compliant)",
    description:
      "Interest is added to the loan principal and repaid as part of the total loan amount.",
  },
];

const interestRecognitionOptions: SelectOption[] = [
  {
    value: "on_disbursement",
    label: "Post interest on disbursement",
    description:
      "The full interest amount is recognized and recorded as soon as the loan is disbursed.",
  },
  {
    value: "when_accrued",
    label: "Post interest when accrued",
    description:
      "Interest is recognized and recorded at the end of each month.",
  },
];

export function Step2TermsPricing({
  onBack,
  onContinue,
}: Step2TermsPricingProps) {
  const { formState, updateStep2Data } = useLoanProductForm();
  
  const form = useForm<Step2TermsPricingValues>({
    defaultValues: {
      repaymentFrequency: "",
      maxGracePeriod: "",
      maxGraceUnit: "days",
      interestRate: "",
      ratePeriod: "per_month",
      amortizationMethod: "",
      interestCollectionMethod: "",
      interestRecognitionCriteria: "",
    },
    mode: "onChange",
  });

  // Load saved Step 2 data from context if available
  useEffect(() => {
    if (formState.step2Data) {
      Object.keys(formState.step2Data).forEach((key) => {
        const value = formState.step2Data?.[key as keyof typeof formState.step2Data];
        if (value !== undefined) {
          form.setValue(key as any, value);
        }
      });
    }
  }, []); // Only run on mount

  const onSubmit = (values: Step2TermsPricingValues) => {
    // Save Step 2 data to context
    updateStep2Data(values);
    // Continue to next step
    onContinue?.();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {/* Step label */}
        <div>
          <p className="text-xs font-medium text-primary-green">STEP 2/3</p>
          <h2 className="mt-1 text-2xl font-semibold text-midnight-blue">
            Add loan product
          </h2>
          <p className="mt-1 text-sm text-primaryGrey-500 max-w-xl">
            Fill in the details below to create a new loan product.
          </p>
        </div>

        {/* Loan repayment terms */}
        <section className="space-y-4">
          <h3 className="font-medium text-midnight-blue">
            Loan repayment terms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              name="repaymentFrequency"
              label="Loan repayment cycle"
              notFound="No repayment cycles found"
              options={repaymentCycleOptions}
              placeholder="Select repayment cycle"
              control={form.control}
              required
            />

            <FormField
              control={form.control}
              name="maxGracePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
                    Maximum grace period
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        type="number"
                        min={0}
                        className="rounded-r-none border-r-0"
                        placeholder="Enter value"
                        {...field}
                      />
                      <FormField
                        control={form.control}
                        name="maxGraceUnit"
                        render={({ field: unitField }) => (
                          <FormControl>
                            <select
                              className="w-32 rounded-l-none border-l-0 border border-input bg-primaryGrey-50 text-sm px-3 rounded-r-md"
                              value={unitField.value}
                              onChange={(e) =>
                                unitField.onChange(e.target.value)
                              }
                            >
                              {graceUnits.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Loan interest details */}
        <section className="space-y-4">
          <h3 className="font-medium text-midnight-blue">
            Loan interest details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interest rate + period */}
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
                    Interest rate (%)
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        type="number"
                        min={0}
                        className="rounded-r-none border-r-0"
                        placeholder="Enter percentage"
                        {...field}
                      />
                      <FormField
                        control={form.control}
                        name="ratePeriod"
                        render={({ field: unitField }) => (
                          <FormControl>
                            <select
                              className="w-40 rounded-l-none border-l-0 border border-input bg-primaryGrey-50 text-sm px-3 rounded-r-md"
                              value={unitField.value}
                              onChange={(e) =>
                                unitField.onChange(e.target.value)
                              }
                            >
                              {ratePeriodOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interest calculation method */}
            <SearchableSelect
              name="amortizationMethod"
              label="Interest calculation method"
              notFound="No methods found"
              options={amortizationOptions}
              placeholder="Select interest calculation method"
              control={form.control}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interest collection method */}
            <FormField
              control={form.control}
              name="interestCollectionMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
                    Interest collection method
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={interestCollectionOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select interest collection method"
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interest recognition criteria */}
            <FormField
              control={form.control}
              name="interestRecognitionCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
                    Interest recognition criteria
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={interestRecognitionOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select interest recognition criteria"
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex justify-between border-t border-primaryGrey-100 pt-6 mt-4">
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-primaryGrey-500"
            onClick={onBack}
          >
            ← Back
          </Button>
          <Button type="submit" className="px-8">
            Continue →
          </Button>
        </div>
      </form>
    </Form>
  );
}


