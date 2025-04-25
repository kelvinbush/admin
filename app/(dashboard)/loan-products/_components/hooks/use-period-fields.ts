import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "../../_schemas/loan-product-schemas";

/**
 * Custom hook to handle period field synchronization and prevent infinite loops
 * when updating related fields
 */
export function usePeriodFields(form: UseFormReturn<StepOneFormValues>) {
  // We'll use a ref to prevent infinite loops when updating related fields
  const isUpdatingRef = useRef(false);
  const { watch, setValue } = form;

  // Watch both period fields to keep them in sync
  const minimumPeriod = watch("minimumLoanPeriod");
  const maximumPeriod = watch("maximumLoanPeriod");

  // Set up an effect to synchronize the period fields
  useEffect(() => {
    if (isUpdatingRef.current) return;

    // If the periods don't match and both have values, synchronize them
    if (minimumPeriod && maximumPeriod && minimumPeriod !== maximumPeriod) {
      try {
        isUpdatingRef.current = true;
        // Use the minimum period as the source of truth
        setValue("maximumLoanPeriod", minimumPeriod);
      } finally {
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);
      }
    }
  }, [minimumPeriod, maximumPeriod, setValue]);

  /**
   * Function to safely update related period fields
   * @param value The period value to set (days, weeks, months, years)
   */
  const updatePeriodFields = (value: string) => {
    if (isUpdatingRef.current) return;

    try {
      isUpdatingRef.current = true;
      setValue("minimumLoanPeriod", value);
      setValue("maximumLoanPeriod", value);
    } finally {
      // Reset the flag after a short delay to ensure all updates are processed
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  return { updatePeriodFields };
}
