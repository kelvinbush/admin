import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "../../_schemas/loan-product-schemas";

/**
 * Custom hook to synchronize currency values across amount fields
 */
export function useCurrencySync(form: UseFormReturn<StepOneFormValues>) {
  const { watch, setValue } = form;
  const isUpdatingRef = useRef(false);

  // Watch for changes to the currency field
  const currency = watch("currency");

  // Set up an effect to handle currency changes
  useEffect(() => {
    if (isUpdatingRef.current) return;

    try {
      isUpdatingRef.current = true;
      // When currency changes, we don't need to do anything special
      // since all amount fields reference the same currency field
    } finally {
      // Reset the flag after a short delay to ensure all updates are processed
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [currency, setValue]);

  return { currency };
}
