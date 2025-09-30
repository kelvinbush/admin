import { z } from 'zod';

// Enums for validation - matching backend enum values
export const LoanTermUnitEnum = ['days', 'weeks', 'months', 'quarters', 'years'] as const;
export const InterestTypeEnum = ['fixed', 'variable'] as const;
export const InterestRatePeriodEnum = ['per_day', 'per_month', 'per_quarter', 'per_year'] as const;
export const AmortizationMethodEnum = ['flat', 'reducing_balance'] as const;
export const RepaymentFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly'] as const;

// Create loan product validation schema
export const createLoanProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Name must be less than 150 characters'),
  slug: z.string().max(180, 'Slug must be less than 180 characters').optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  summary: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().min(1, 'Currency is required').max(10, 'Currency must be less than 10 characters'),
  minAmount: z.number().min(0, 'Minimum amount must be positive'),
  maxAmount: z.number().min(0, 'Maximum amount must be positive'),
  minTerm: z.number().int().min(0, 'Minimum term must be positive'),
  maxTerm: z.number().int().min(0, 'Maximum term must be positive'),
  termUnit: z.enum(LoanTermUnitEnum),
  interestRate: z.number().min(0, 'Interest rate must be positive'),
  interestType: z.enum(InterestTypeEnum),
  ratePeriod: z.enum(InterestRatePeriodEnum),
  amortizationMethod: z.enum(AmortizationMethodEnum),
  repaymentFrequency: z.enum(RepaymentFrequencyEnum),
  processingFeeRate: z.number().min(0, 'Processing fee rate must be positive').optional(),
  processingFeeFlat: z.number().min(0, 'Processing fee flat must be positive').optional(),
  lateFeeRate: z.number().min(0, 'Late fee rate must be positive').optional(),
  lateFeeFlat: z.number().min(0, 'Late fee flat must be positive').optional(),
  prepaymentPenaltyRate: z.number().min(0, 'Prepayment penalty rate must be positive').optional(),
  gracePeriodDays: z.number().int().min(0, 'Grace period must be positive').optional(),
  isActive: z.boolean().optional().default(true),
}).refine((data) => data.maxAmount >= data.minAmount, {
  message: 'Maximum amount must be greater than or equal to minimum amount',
  path: ['maxAmount'],
}).refine((data) => data.maxTerm >= data.minTerm, {
  message: 'Maximum term must be greater than or equal to minimum term',
  path: ['maxTerm'],
});

export type CreateLoanProductFormData = z.infer<typeof createLoanProductSchema>;
