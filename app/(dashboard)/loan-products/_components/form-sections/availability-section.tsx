import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "../../_schemas/loan-product-schemas";
import { DateRangeField } from "../form-fields/date-range-field";
import { SelectFormField, SelectOption } from "../form-fields/select-form-field";

// Define processing method options
const processingMethodOptions: SelectOption[] = [
  {
    value: "presta",
    label: "Process via Presta System (integrated)",
    description: "Use the integrated Presta loan management system",
  },
  {
    value: "internal",
    label: "Process Internally (non-integrated)",
    description: "Use internal processes without system integration",
  },
];

interface AvailabilitySectionProps {
  form: UseFormReturn<StepOneFormValues>;
}

export function AvailabilitySection({ form }: AvailabilitySectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Availability Window */}
      <DateRangeField
        startFieldName="availabilityWindowStart"
        endFieldName="availabilityWindowEnd"
        label="Loan availability window (optional)"
        control={form.control}
      />

      {/* Processing Method */}
      <SelectFormField
        name="processingMethod"
        label="Loan processing method"
        options={processingMethodOptions}
        control={form.control}
        placeholder="Select loan processing method"
        required={true}
      />
    </div>
  );
}
