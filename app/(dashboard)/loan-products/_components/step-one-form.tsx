import * as React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLoanProductForm } from "./hooks/use-loan-product-form";
import { BasicDetailsSection } from "./form-sections/basic-details-section";
import { LoanTermsSection } from "./form-sections/loan-terms-section";
import { AvailabilitySection } from "./form-sections/availability-section";
import { ProcessingSection } from "./form-sections/processing-section";
import { StepOneFormValues } from "../_schemas/loan-product-schemas";

interface StepOneFormProps {
  initialData?: Partial<StepOneFormValues>;
}

const StepOneForm = ({ initialData }: StepOneFormProps) => {
  const { form, onSubmit } = useLoanProductForm({ initialData });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          {/* Basic Details Section */}
          <BasicDetailsSection form={form} />

          {/* Availability Section */}
          <div className="mt-8">
            <AvailabilitySection form={form} />
          </div>

          {/* Processing Section */}
          <div className="mt-8">
            <ProcessingSection form={form} />
          </div>

          {/* Loan Terms Section */}
          <div className="mt-8">
            <LoanTermsSection form={form} />
          </div>

          {/* Form Navigation */}
          <div className="mt-8 space-y-4">
            <Button
              type="submit"
              size={"lg"}
              className="w-full bg-[#B6BABC] hover:bg-gray-500"
            >
              Continue
            </Button>
            <div className="flex justify-center">
              <Button type="button" variant="link" className="px-0 text-black">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default StepOneForm;
