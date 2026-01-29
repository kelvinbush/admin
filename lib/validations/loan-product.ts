import { z } from 'zod';

// Enums for validation - matching backend enum values
// Quarters removed from UI per latest designs
export const LoanTermUnitEnum = ['days', 'weeks', 'months', 'years'] as const;
export const InterestTypeEnum = ['fixed', 'variable'] as const;
export const InterestRatePeriodEnum = ['per_day', 'per_month', 'per_quarter', 'per_year'] as const;
export const AmortizationMethodEnum = ['flat', 'reducing_balance'] as const;
export const RepaymentFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly'] as const;

// Schema for individual loan fees (Step 3)
export const loanFeeSchema = z.object({
  loanFeeId: z.string().optional(),
  feeName: z.string().optional(),
  calculationMethod: z.enum(['flat', 'percentage']),
  rate: z.string().min(1, 'Rate is required'), // String in form, converted to number in API
  collectionRule: z.enum(['upfront', 'end_of_term']),
  allocationMethod: z.string().min(1, 'Allocation method is required'),
  calculationBasis: z.enum(['principal', 'total_disbursed']),
}).refine((data) => {
  // If loanFeeId is not provided, feeName is required
  if (!data.loanFeeId && !data.feeName) {
    return false;
  }
  return true;
}, {
  message: 'Loan fee name is required if not selecting an existing fee',
  path: ['feeName'],
});

// Create loan product validation schema
// NOTE: This schema matches the UI exactly - UI is the single source of truth
export const createLoanProductSchema = z.object({
  // Step 1: Basic Loan Details
  name: z.string().min(1, 'Name is required').max(150, 'Name must be less than 150 characters'),
  slug: z.string().max(180, 'Slug must be less than 180 characters').optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().min(1, 'Currency is required').max(10, 'Currency must be less than 10 characters'),
  minAmount: z.number().min(1, 'Minimum amount must be greater than zero'),
  maxAmount: z.number().min(1, 'Maximum amount must be greater than zero'),
  minTerm: z.number().int().min(1, 'Minimum term must be greater than zero'),
  maxTerm: z.number().int().min(1, 'Maximum term must be greater than zero'),
  termUnit: z.enum(LoanTermUnitEnum),
  // Loan availability window
  availabilityStartDate: z.date().optional(),
  availabilityEndDate: z.date().optional(),
  // UI-only fields (will be transformed before API submission)
  loanProvider: z.string().optional(),
  loanVisibility: z.array(z.string()).optional(),
  // Step 2: Loan Repayment Terms & Interest Details
  // Note: Step 2 uses separate form, these fields are included here for completeness
  // but Step 2 form values will be merged when submitting
  repaymentFrequency: z.enum(RepaymentFrequencyEnum),
  maxGracePeriod: z.string().optional(), // String in Step 2 form, will be converted to number
  maxGraceUnit: z.string().optional(),
  interestRate: z.string().optional(), // String in Step 2 form, will be converted to number
  ratePeriod: z.enum(InterestRatePeriodEnum),
  amortizationMethod: z.enum(AmortizationMethodEnum),
  interestCollectionMethod: z.string().optional(),
  interestRecognitionCriteria: z.string().optional(),
  // Additional options
  isRevolvingCreditLine: z.boolean().optional(),
  // Step 3: Loan Fees (optional)
  fees: z.array(loanFeeSchema).optional(),
}).refine((data) => {
  // Convert strings to numbers for validation
  const minAmount = typeof data.minAmount === 'number' ? data.minAmount : 0;
  const maxAmount = typeof data.maxAmount === 'number' ? data.maxAmount : 0;
  return maxAmount >= minAmount;
}, {
  message: 'Maximum amount must be greater than or equal to minimum amount',
  path: ['maxAmount'],
}).refine((data) => {
  const minTerm = typeof data.minTerm === 'number' ? data.minTerm : 0;
  const maxTerm = typeof data.maxTerm === 'number' ? data.maxTerm : 0;
  return maxTerm >= minTerm;
}, {
  message: 'Maximum term must be greater than or equal to minimum term',
  path: ['maxTerm'],
}).refine((data) => {
  // When using months as the unit, maxTerm must not exceed 12
  if (data.termUnit === 'months') {
    const maxTerm = typeof data.maxTerm === 'number' ? data.maxTerm : 0;
    return maxTerm <= 12;
  }
  return true;
}, {
  message: 'Maximum loan duration in months cannot exceed 12',
  path: ['maxTerm'],
}).refine((data) => {
  // If both dates are provided, end date must be >= start date
  if (data.availabilityStartDate && data.availabilityEndDate) {
    return data.availabilityEndDate >= data.availabilityStartDate;
  }
  return true;
}, {
  message: 'End date must be greater than or equal to start date',
  path: ['availabilityEndDate'],
});

export type CreateLoanProductFormData = z.infer<typeof createLoanProductSchema>;
