import { useQueryClient } from "@tanstack/react-query";
import { useClientApiPost } from "../hooks";
import { queryKeys } from "../query-keys";

export interface CreateLoanProductRequest {
  // Step 1: Basic Loan Details
  name: string;
  slug?: string;
  summary?: string;
  description?: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  termUnit: string;
  availabilityStartDate?: string; // ISO 8601 date string (YYYY-MM-DD)
  availabilityEndDate?: string; // ISO 8601 date string (YYYY-MM-DD)
  organizationId: string;
  userGroupIds: string[];

  // Step 2: Loan Repayment Terms & Interest Details
  repaymentFrequency: string;
  maxGracePeriod?: number;
  maxGraceUnit?: string;
  interestRate: number;
  ratePeriod: string;
  amortizationMethod: string;
  interestCollectionMethod: string;
  interestRecognitionCriteria: string;

  // Step 3: Loan Fees
  fees?: Array<{
    loanFeeId?: string;
    feeName?: string;
    calculationMethod: string;
    rate: number;
    collectionRule: string;
    allocationMethod: string;
    calculationBasis: string;
  }>;
}

export interface LoanProduct {
  id: string;
  name: string;
  slug?: string;
  summary?: string;
  description?: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  termUnit: string;
  availabilityStartDate?: string;
  availabilityEndDate?: string;
  organizationId: string;
  userGroupIds: string[];
  repaymentFrequency: string;
  maxGracePeriod?: number;
  maxGraceUnit?: string;
  interestRate: number;
  ratePeriod: string;
  amortizationMethod: string;
  interestCollectionMethod: string;
  interestRecognitionCriteria: string;
  fees: Array<{
    loanFeeId?: string;
    feeName?: string;
    calculationMethod: string;
    rate: number;
    collectionRule: string;
    allocationMethod: string;
    calculationBasis: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export function useCreateLoanProduct() {
  const queryClient = useQueryClient();

  return useClientApiPost<LoanProduct, CreateLoanProductRequest>(
    "/loan-products",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
      },
    }
  );
}

