import * as z from "zod";

/*
* {
  "loanName": "string",
  "description": "string",
  "partnerReference": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "integrationType": 0,
  "loanProductType": 0,
  "currency": "string",
  "loanPriceMax": 0,
  "loanInterest": 0,
  "status": 0,
  "loanPriceMin": 0,
  "disbursementAccount": "string",
  "interestCalculationMethod": "string",
  "minimumTerm": "string",
  "maximumTerm": "string",
  "termPeriod": "string",
  "interestPeriod": "string"
}
* */

export const formSchema = z.object({
  loanName: z.string().min(1, "Loan name is required"),
  description: z.string().optional(),
  partnerReference: z.string().uuid().optional(),
  integrationType: z.number().int().nonnegative(),
  loanProductType: z.number().int().nonnegative(),
  currency: z.string().min(1, "Currency is required"),
  loanPriceMax: z.number().nonnegative("Maximum loan amount must be a positive number"),
  loanInterest: z.number().nonnegative("Interest rate must be a positive number"),
  status: z.number().int().nonnegative(),
  loanPriceMin: z.number().nonnegative("Minimum loan amount must be a positive number"),
  disbursementAccount: z.string().min(1, "Disbursement account is required"),
  interestCalculationMethod: z.string().min(1, "Interest calculation method is required"),
  minimumTerm: z.string().min(1, "Minimum term is required"),
  maximumTerm: z.string().min(1, "Maximum term is required"),
  termPeriod: z.string().min(1, "Term period is required"),
  interestPeriod: z.string().min(1, "Interest period is required")
});

export type FormData = z.infer<typeof formSchema>;

export const defaultValues: Partial<FormData> = {
  description: "",
  integrationType: 0,
  loanProductType: 0,
  status: 0,
  currency: "KES",
  loanPriceMin: 0,
  loanPriceMax: 0,
  loanInterest: 0,
  interestPeriod: "per_month",
  termPeriod: "months",
  interestCalculationMethod: "simple"
};
