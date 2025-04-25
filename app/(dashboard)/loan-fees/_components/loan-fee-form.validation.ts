import { z } from "zod";

// Define the calculation method type for better type safety
const calculationMethodEnum = [
  "Fixed Amount",
  "Rate",
  "Fixed Amount Per Installment",
] as const;
// Define the application rule type
const applicationRuleEnum = [
  "Fixed value",
  "Graduated by value",
  "Graduated by period (months)",
] as const;

// Define the value band schema
const valueBandSchema = z.object({
  id: z.string().optional(), // Optional ID for existing bands
  minAmount: z.number({
    required_error: "Minimum amount is required",
    invalid_type_error: "Minimum amount must be a number",
  }),
  maxAmount: z.number({
    required_error: "Maximum amount is required",
    invalid_type_error: "Maximum amount must be a number",
  }),
  fee: z.number({
    required_error: "Fee value is required",
    invalid_type_error: "Fee value must be a number",
  }),
}).refine(data => data.maxAmount > data.minAmount, {
  message: "Maximum amount must be greater than minimum amount",
  path: ["maxAmount"],
});

// Define the period band schema
const periodBandSchema = z.object({
  id: z.string().optional(), // Optional ID for existing bands
  minPeriod: z.number({
    required_error: "Minimum period is required",
    invalid_type_error: "Minimum period must be a number",
  }),
  maxPeriod: z.number({
    required_error: "Maximum period is required",
    invalid_type_error: "Maximum period must be a number",
  }),
  fee: z.number({
    required_error: "Fee value is required",
    invalid_type_error: "Fee value must be a number",
  }),
}).refine(data => data.maxPeriod > data.minPeriod, {
  message: "Maximum period must be greater than minimum period",
  path: ["maxPeriod"],
});

// First define the base schema without conditional validations
const baseSchema = z.object({
  name: z
    .string({
      required_error: "Loan fee name is required",
    })
    .min(1, "Loan fee name is required"),

  calculationMethod: z.enum(calculationMethodEnum, {
    required_error: "Fee calculation method is required",
  }),

  applicationRule: z.enum(applicationRuleEnum, {
    required_error: "Fee application rule is required",
  }),

  valueBands: z.array(valueBandSchema).optional(),
  periodBands: z.array(periodBandSchema).optional(),
  collectionRule: z.string().optional(),
  allocationMethod: z.string().optional(),
  calculationBasis: z.string().optional(),

  receivableAccount: z
    .string({
      required_error: "Receivable account is required",
    })
    .min(1, "Receivable account is required"),

  incomeAccount: z
    .string({
      required_error: "Income account is required",
    })
    .min(1, "Income account is required"),

  amount: z.preprocess(
    // Convert empty string to undefined for proper number handling
    (val) => (val === "" ? undefined : val),
    z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .optional(),
  ),
});

// Type for the form values based on the base schema
// Now add the conditional validations
export const loanFeeFormValidation = baseSchema
  .refine(
    (data) => {
      // Collection rule validation
      if (
        data.calculationMethod !== "Fixed Amount Per Installment" &&
        !data.collectionRule
      ) {
        return false;
      }

      // Allocation method validation
      if (
        data.collectionRule === "Paid with loan" &&
        data.calculationMethod !== "Fixed Amount Per Installment" &&
        !data.allocationMethod
      ) {
        return false;
      }

      // Calculation basis validation
      if (data.calculationMethod === "Rate" && !data.calculationBasis) {
        return false;
      }

      // Amount validation
      if (
        (data.calculationMethod === "Rate" ||
          data.calculationMethod === "Fixed Amount") &&
        (data.amount === undefined || data.amount === null)
      ) {
        return false;
      }

      return true;
    },
    {
      message: "Please fill in all required fields",
      path: [], // This will be overridden by the error map
    },
  )
  .superRefine((data, ctx) => {
    // Value bands validation for Graduated by value
    if (data.applicationRule === "Graduated by value") {
      if (!data.valueBands || data.valueBands.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one value band is required",
          path: ["valueBands"],
        });
      }
    }
    
    // Period bands validation for Graduated by period
    if (data.applicationRule === "Graduated by period (months)") {
      if (!data.periodBands || data.periodBands.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one period band is required",
          path: ["periodBands"],
        });
      }
    }
    
    // Collection rule validation with specific error message
    if (
      data.calculationMethod !== "Fixed Amount Per Installment" &&
      !data.collectionRule
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee collection rule is required",
        path: ["collectionRule"],
      });
    }

    // Allocation method validation with specific error message
    if (
      data.collectionRule === "Paid with loan" &&
      data.calculationMethod !== "Fixed Amount Per Installment" &&
      !data.allocationMethod
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee allocation method is required",
        path: ["allocationMethod"],
      });
    }

    // Calculation basis validation with specific error message
    if (data.calculationMethod === "Rate" && !data.calculationBasis) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Calculate fee on is required",
        path: ["calculationBasis"],
      });
    }

    // Amount validation with specific error message
    if (
      (data.calculationMethod === "Rate" ||
        data.calculationMethod === "Fixed Amount") &&
      (data.amount === undefined || data.amount === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.calculationMethod === "Rate"
            ? "Rate is required"
            : "Amount is required",
        path: ["amount"],
      });
    }
  });
