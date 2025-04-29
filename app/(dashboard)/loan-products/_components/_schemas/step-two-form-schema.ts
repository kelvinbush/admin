import * as z from "zod";

// Define form schema with Zod
export const formSchema = z.object({
  repaymentCycle: z.string({
    required_error: "Please select a repayment cycle.",
  }),
  specificRepaymentDay: z.string({
    required_error: "Please enter a specific repayment day.",
  }),
  minDaysBeforeFirstPayment: z.string({
    required_error: "Please enter minimum days before first payment.",
  }),
  gracePeriod: z.string().optional(),
  gracePeriodUnit: z.string().default("days"),
  interestRate: z.string({
    required_error: "Please enter an interest rate.",
  }),
  interestRatePeriod: z.string({
    required_error: "Please select a period.",
  }).default("per_month"),
  interestCalculationMethod: z.string({
    required_error: "Please select an interest calculation method.",
  }),
  interestCollectionMethod: z.string({
    required_error: "Please select an interest collection method.",
  }),
  interestRecognitionCriteria: z.string({
    required_error: "Please select interest recognition criteria.",
  }),
});

// Export type
export type FormData = z.infer<typeof formSchema>;

// Define default values
export const defaultValues: FormData = {
  repaymentCycle: "",
  specificRepaymentDay: "",
  minDaysBeforeFirstPayment: "",
  gracePeriod: "",
  gracePeriodUnit: "days",
  interestRate: "",
  interestRatePeriod: "per_month",
  interestCalculationMethod: "",
  interestCollectionMethod: "",
  interestRecognitionCriteria: "",
};

export const getFormDefaults = (initialData?: Partial<FormData>): FormData => ({
  ...defaultValues,
  ...initialData,
});
