import { useQueryClient } from "@tanstack/react-query";
import { useClientApiPost, useClientApiQuery, useClientApiPatch, useClientApiMutation } from "../hooks";
import { queryKeys } from "../query-keys";
import type { AxiosRequestConfig } from "axios";
import { useMemo } from "react";

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
  imageUrl?: string;
  summary?: string;
  description?: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  termUnit: "months" | "years";
  interestRate: number;
  interestType: "fixed" | "variable";
  ratePeriod: "per_day" | "per_month" | "per_quarter" | "per_year";
  amortizationMethod: "flat" | "reducing_balance";
  repaymentFrequency: "monthly" | "quarterly" | "semi_annual" | "annual";
  gracePeriodDays: number;
  version: number;
  status: "draft" | "active" | "archived";
  isActive: boolean;
  processingFeeFlat?: number;
  lateFeeRate?: number;
  lateFeeFlat?: number;
  prepaymentPenaltyRate?: number;
  changeReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  // Additional fields from our form
  availabilityStartDate?: string;
  availabilityEndDate?: string;
  organizationId: string;
  userGroupIds: string[];
  maxGracePeriod?: number;
  maxGraceUnit?: string;
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
  loansCount?: number;
}

export interface LoanProductFilters {
  status?: "draft" | "active" | "archived";
  includeArchived?: boolean;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  minTerm?: number;
  maxTerm?: number;
  termUnit?: "months" | "years";
  interestType?: "fixed" | "variable";
  ratePeriod?: "per_day" | "per_month" | "per_quarter" | "per_year";
  amortizationMethod?: "flat" | "reducing_balance";
  repaymentFrequency?: "monthly" | "quarterly" | "semi_annual" | "annual";
  isActive?: boolean;
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt" | "interestRate" | "minAmount" | "maxAmount";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedLoanProductsResponse {
  success: boolean;
  message: string;
  data: LoanProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateLoanProductRequest {
  name?: string;
  slug?: string;
  imageUrl?: string;
  summary?: string;
  description?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  minTerm?: number;
  maxTerm?: number;
  termUnit?: "months" | "years";
  interestRate?: number;
  interestType?: "fixed" | "variable";
  ratePeriod?: "per_year" | "per_month";
  amortizationMethod?: "flat" | "reducing_balance";
  repaymentFrequency?: "monthly" | "quarterly" | "semi_annual" | "annual";
  gracePeriodDays?: number;
  processingFeeFlat?: number;
  lateFeeRate?: number;
  lateFeeFlat?: number;
  prepaymentPenaltyRate?: number;
  changeReason?: string;
}

export interface UpdateLoanProductStatusRequest {
  status: "draft" | "active" | "archived";
  changeReason: string;
  approvedBy: string;
}

export function useLoanProducts(filters?: LoanProductFilters, pagination?: { page?: number; limit?: number }) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  
  // Build query params - all values must be strings per API docs
  // Memoize to prevent React Query from treating it as a new query on every render
  const config = useMemo<AxiosRequestConfig>(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (filters?.status) params.status = filters.status;
    if (filters?.includeArchived) params.includeArchived = 'true';
    if (filters?.currency) params.currency = filters.currency;
    if (filters?.minAmount !== undefined) params.minAmount = filters.minAmount.toString();
    if (filters?.maxAmount !== undefined) params.maxAmount = filters.maxAmount.toString();
    if (filters?.minTerm !== undefined) params.minTerm = filters.minTerm.toString();
    if (filters?.maxTerm !== undefined) params.maxTerm = filters.maxTerm.toString();
    if (filters?.termUnit) params.termUnit = filters.termUnit;
    if (filters?.interestType) params.interestType = filters.interestType;
    if (filters?.ratePeriod) params.ratePeriod = filters.ratePeriod;
    if (filters?.amortizationMethod) params.amortizationMethod = filters.amortizationMethod;
    if (filters?.repaymentFrequency) params.repaymentFrequency = filters.repaymentFrequency;
    if (filters?.isActive !== undefined) params.isActive = filters.isActive.toString();
    if (filters?.search) params.search = filters.search;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    return { params };
  }, [page, limit, filters]);

  return useClientApiQuery<PaginatedLoanProductsResponse>(
    queryKeys.loanProducts.list(filters),
    '/loan-products',
    config
  );
}

export function useLoanProduct(loanProductId: string) {
  return useClientApiQuery<LoanProduct>(
    queryKeys.loanProducts.detail(loanProductId),
    `/loan-products/${loanProductId}`,
    undefined,
    {
      enabled: !!loanProductId,
    }
  );
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

export function useUpdateLoanProduct(loanProductId: string) {
  const queryClient = useQueryClient();

  return useClientApiPatch<LoanProduct, UpdateLoanProductRequest>(
    `/loan-products/${loanProductId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.detail(loanProductId) });
      },
    }
  );
}

export function useUpdateLoanProductStatus(loanProductId: string) {
  const queryClient = useQueryClient();

  return useClientApiPatch<LoanProduct, UpdateLoanProductStatusRequest>(
    `/loan-products/${loanProductId}/status`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.detail(loanProductId) });
      },
    }
  );
}

// Hook for updating status that accepts ID in variables (for use in tables)
export function useUpdateLoanProductStatusMutation() {
  const queryClient = useQueryClient();

  return useClientApiMutation<LoanProduct, { id: string; data: UpdateLoanProductStatusRequest }>(
    async (api, { id, data }) => {
      return api.patch<LoanProduct>(`/loan-products/${id}/status`, data);
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.detail(variables.id) });
      },
    }
  );
}

export function useDeleteLoanProduct() {
  const queryClient = useQueryClient();

  return useClientApiMutation<{ success: boolean }, { id: string }>(
    async (api, { id }) => api.delete<{ success: boolean }>(`/loan-products/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
      },
    }
  );
}

