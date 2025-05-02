import * as z from "zod";

export const formSchema = z.object({
  productName: z.string().min(1, "Loan product name is required"),
  code: z.string().min(1, "Loan code/identifier is required"),
  provider: z.string().min(1, "Loan provider is required"),
  type: z.string().min(1, "Loan type is required"),
  visibility: z.string().min(1, "Loan visibility is required"),
  processingMethod: z.string().min(1, "Loan processing method is required"),
  description: z.string().optional(),
  minAmount: z.string().min(1, "Minimum loan amount is required"),
  maxAmount: z.string().min(1, "Maximum loan amount is required"),
  minTerm: z.string().min(1, "Minimum loan term is required"),
  minTermUnit: z.string().min(1, "Minimum term unit is required"),
  maxTerm: z.string().min(1, "Maximum loan term is required"),
  maxTermUnit: z.string().min(1, "Maximum term unit is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  interestRatePeriod: z.string().min(1, "Interest rate period is required"),
});

export type FormData = z.infer<typeof formSchema>;

export const defaultValues: Partial<FormData> = {
  description: "",
  interestRatePeriod: "per_month",
  minTermUnit: "",
  maxTermUnit: "",
};
