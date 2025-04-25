import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "../../_schemas/loan-product-schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ProcessingSectionProps {
  form: UseFormReturn<StepOneFormValues>;
}

export function ProcessingSection({ form }: ProcessingSectionProps) {
  return (
    <div>
      <FormField
        control={form.control as any}
        name="loanDescription"
        render={({ field }) => (
          <FormItem className="mt-6">
            <FormLabel>
              Loan description <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe the loan product"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
