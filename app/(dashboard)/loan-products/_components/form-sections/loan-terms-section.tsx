import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "../../_schemas/loan-product-schemas";
import { DurationField } from "../form-fields/duration-field";
import { AmountField } from "../form-fields/amount-field";
import { usePeriodFields } from "../hooks/use-period-fields";

interface LoanTermsSectionProps {
  form: UseFormReturn<StepOneFormValues>;
}

export function LoanTermsSection({ form }: LoanTermsSectionProps) {
  const { updatePeriodFields } = usePeriodFields(form);
  const { setValue, watch } = form;

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Loan terms</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Credit Limit Duration */}
        <div className={"col-span-2"}>
          <DurationField
            durationName="creditLimitDuration"
            periodName="creditLimitPeriod"
            label="Credit limit duration (optional)"
            control={form.control}
            setValue={setValue}
            watch={watch}
            placeholder="Enter value"
          />
        </div>

        <DurationField
          durationName="minimumLoanDuration"
          periodName="minimumLoanPeriod"
          label="Minimum loan duration"
          control={form.control}
          setValue={setValue}
          watch={watch}
          onPeriodChange={updatePeriodFields}
          required={true}
          placeholder="Enter value"
        />

        <DurationField
          durationName="maximumLoanDuration"
          periodName="maximumLoanPeriod"
          label="Maximum loan duration"
          control={form.control}
          setValue={setValue}
          watch={watch}
          onPeriodChange={updatePeriodFields}
          required={true}
          placeholder="Enter value"
        />

        <AmountField
          name="minimumLoanAmount"
          label="Minimum loan amount"
          control={form.control}
          setValue={setValue}
          watch={watch}
          currencyFieldName="currency"
          required={true}
          placeholder="Enter loan amount"
        />

        <AmountField
          name="maximumLoanAmount"
          label="Maximum loan amount"
          control={form.control}
          setValue={setValue}
          watch={watch}
          currencyFieldName="currency"
          required={true}
          placeholder="Enter loan amount"
        />
      </div>
    </div>
  );
}
