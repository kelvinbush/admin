import { z } from "zod";

// Define the base schema objects first without refinements
const stepOneBaseSchema = z.object({
  // Basic loan details
  loanName: z.string().min(2, {
    message: "Loan product name must be at least 2 characters.",
  }),
  loanCode: z.string().optional(),
  loanProvider: z.string(),
  loanType: z.string({
    required_error: "Please select a loan type.",
  }),
  disbursementMethod: z.string({
    required_error: "Please select a disbursement method.",
  }),
  loanVisibility: z.string({
    required_error: "Please select loan visibility.",
  }),
  availabilityWindowStart: z.date().optional(),
  availabilityWindowEnd: z.date().optional(),
  processingMethod: z.string({
    required_error: "Please select a processing method.",
  }),
  loanDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),

  // Loan amount details
  minimumLoanAmount: z.string().min(1, {
    message: "Minimum loan amount is required.",
  }),
  maximumLoanAmount: z.string().min(1, {
    message: "Maximum loan amount is required.",
  }),
  currency: z.string({
    required_error: "Currency is required.",
  }),

  // Loan duration details
  minimumLoanDuration: z.string().min(1, {
    message: "Minimum loan duration is required.",
  }),
  minimumLoanPeriod: z.string({
    required_error: "Minimum loan period unit is required.",
  }),
  maximumLoanDuration: z.string().min(1, {
    message: "Maximum loan duration is required.",
  }),
  maximumLoanPeriod: z.string({
    required_error: "Maximum loan period unit is required.",
  }),

  // Credit limit duration details
  creditLimitDuration: z.string().optional(),
  creditLimitPeriod: z.string({
    required_error: "Credit limit period unit is required.",
  }),
});

// Helper function to convert duration to days for comparison
function convertToDays(value: number, period: string): number {
  switch (period) {
    case "days":
      return value;
    case "weeks":
      return value * 7;
    case "months":
      return value * 30; // Approximation
    case "years":
      return value * 365; // Approximation
    default:
      return value;
  }
}

// Add refinements to the base schema
export const stepOneSchema = stepOneBaseSchema.refine(
  (data) => {
    if (data.availabilityWindowStart && data.availabilityWindowEnd) {
      return data.availabilityWindowStart <= data.availabilityWindowEnd;
    }
    return true;
  },
  {
    message: "Start date must be before or equal to end date",
    path: ["availabilityWindowStart"],
  }
).refine(
  (data) => {
    const minAmount = parseFloat(data.minimumLoanAmount);
    const maxAmount = parseFloat(data.maximumLoanAmount);
    if (isNaN(minAmount) || isNaN(maxAmount)) return true;
    return minAmount <= maxAmount;
  },
  {
    message: "Minimum loan amount must be less than or equal to maximum loan amount",
    path: ["minimumLoanAmount"],
  }
).refine(
  (data) => {
    // Convert both durations to days for comparison
    const minDuration = parseFloat(data.minimumLoanDuration);
    const maxDuration = parseFloat(data.maximumLoanDuration);
    if (isNaN(minDuration) || isNaN(maxDuration)) return true;
    
    const minDays = convertToDays(minDuration, data.minimumLoanPeriod);
    const maxDays = convertToDays(maxDuration, data.maximumLoanPeriod);
    return minDays <= maxDays;
  },
  {
    message: "Minimum loan duration must be less than or equal to maximum loan duration",
    path: ["minimumLoanDuration"],
  }
);

// Step Two Schema - Loan fees and interest
export const stepTwoSchema = z.object({
  // Add step two validation here when needed
});

// Step Three Schema - Loan repayment
export const stepThreeSchema = z.object({
  // Add step three validation here when needed
});

// Full Loan Product Schema - Combines all steps
// We use the base schema objects to create a combined schema
export const loanProductSchema = z.object({
  ...stepOneBaseSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape
});

// Types
export type StepOneFormValues = z.infer<typeof stepOneSchema>;
export type StepTwoFormValues = z.infer<typeof stepTwoSchema>;
export type StepThreeFormValues = z.infer<typeof stepThreeSchema>;
export type LoanProductFormValues = z.infer<typeof loanProductSchema>;
