import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { 
  nextStep, 
  updateFormData 
} from "@/lib/redux/features/loan-product-form.slice";
import { 
  stepOneSchema, 
  type StepOneFormValues 
} from "../../_schemas/loan-product-schemas";
import { SupportedCurrency } from "@/lib/types/loan-product";

interface UseLoanProductFormProps {
  initialData?: Partial<StepOneFormValues>;
}

export function useLoanProductForm({ initialData }: UseLoanProductFormProps = {}) {
  const dispatch = useDispatch();

  // Initialize the form with default values
  const form = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      // Basic loan details
      loanName: initialData?.loanName || "",
      loanCode: initialData?.loanCode || "",
      loanProvider: initialData?.loanProvider || "MK Foundation",
      loanType: initialData?.loanType || "",
      disbursementMethod: initialData?.disbursementMethod || "",
      loanVisibility: initialData?.loanVisibility || "",
      availabilityWindowStart: initialData?.availabilityWindowStart,
      availabilityWindowEnd: initialData?.availabilityWindowEnd,
      processingMethod: initialData?.processingMethod || "",
      loanDescription: initialData?.loanDescription || "",

      // Loan terms
      creditLimitDuration: initialData?.creditLimitDuration || "",
      creditLimitPeriod: initialData?.creditLimitPeriod || "days",
      minimumLoanDuration: initialData?.minimumLoanDuration || "",
      minimumLoanPeriod: initialData?.minimumLoanPeriod || "days",
      maximumLoanDuration: initialData?.maximumLoanDuration || "",
      maximumLoanPeriod: initialData?.maximumLoanPeriod || "days",
      minimumLoanAmount: initialData?.minimumLoanAmount || "",
      maximumLoanAmount: initialData?.maximumLoanAmount || "",
      currency: initialData?.currency || "USD",
    },
  });

  // Form submission handler
  const onSubmit = (data: StepOneFormValues) => {
    dispatch(
      updateFormData({
        // Basic loan details
        loanName: data.loanName,
        loanCode: data.loanCode,
        loanProvider: data.loanProvider,
        loanType: data.loanType,
        disbursementMethod: data.disbursementMethod,
        loanVisibility: data.loanVisibility,
        // Store both start and end dates separately
        availabilityWindowStart: data.availabilityWindowStart,
        availabilityWindowEnd: data.availabilityWindowEnd,
        // Keep the original field for backward compatibility
        availabilityWindow: data.availabilityWindowStart,
        processingMethod: data.processingMethod,
        loanDescription: data.loanDescription,

        // Loan terms
        creditLimitDuration: data.creditLimitDuration,
        creditLimitPeriod: data.creditLimitPeriod,
        minimumLoanDuration: data.minimumLoanDuration,
        minimumLoanPeriod: data.minimumLoanPeriod,
        maximumLoanDuration: data.maximumLoanDuration,
        maximumLoanPeriod: data.maximumLoanPeriod,
        minimumLoanAmount: data.minimumLoanAmount,
        maximumLoanAmount: data.maximumLoanAmount,
        currency: data.currency as SupportedCurrency,
      }),
    );
    dispatch(nextStep());
  };

  return {
    form,
    onSubmit,
  };
}
