"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useClientApiQuery, useClientApiPost, useClientApiMutation } from "../hooks";
import { queryKeys } from "../query-keys";
import type { AxiosRequestConfig } from "axios";
import { useMemo } from "react";

// ===== TYPES =====

export type LoanApplicationStatus =
  | "kyc_kyb_verification"
  | "eligibility_check"
  | "credit_analysis"
  | "head_of_credit_review"
  | "internal_approval_ceo"
  | "committee_decision"
  | "sme_offer_approval"
  | "document_generation"
  | "signing_execution"
  | "awaiting_disbursement"
  | "approved"
  | "rejected"
  | "disbursed"
  | "cancelled";

export interface LoanApplication {
  id: string;
  loanId: string;
  loanSource: string;
  businessName: string;
  entrepreneurId: string;
  businessId: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  loanProduct: string;
  loanProductId: string;
  loanRequested: number;
  loanCurrency: string;
  loanTenure: number;
  status: LoanApplicationStatus;
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
}

export interface LoanApplicationFilters {
  search?: string;
  status?: LoanApplicationStatus;
  loanProduct?: string;
  loanSource?: string;
  applicationDate?: "today" | "this_week" | "this_month" | "last_month" | "this_year";
  createdAtFrom?: string;
  createdAtTo?: string;
  sortBy?: "createdAt" | "applicationNumber" | "applicantName" | "amount";
  sortOrder?: "asc" | "desc";
}

export interface ListLoanApplicationsResponse {
  data: LoanApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateLoanApplicationRequest {
  businessId: string;
  entrepreneurId: string;
  loanProductId: string;
  fundingAmount: number;
  fundingCurrency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate?: number;
  repaymentPeriod: number;
  intendedUseOfFunds: string;
  interestRate: number;
  loanSource?: string;
}

export interface CreateLoanApplicationResponse {
  id: string;
  loanId: string;
  businessId: string;
  entrepreneurId: string;
  loanProductId: string;
  fundingAmount: number;
  fundingCurrency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate?: number;
  repaymentPeriod: number;
  intendedUseOfFunds: string;
  interestRate: number;
  loanSource: string;
  status: LoanApplicationStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface LoanApplicationStatsResponse {
  totalApplications: number;
  totalAmount: number;
  averageAmount: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  disbursed: number;
  cancelled: number;
  totalApplicationsChange?: number;
  totalAmountChange?: number;
  pendingApprovalChange?: number;
  approvedChange?: number;
  rejectedChange?: number;
  disbursedChange?: number;
  cancelledChange?: number;
}

export interface LoanApplicationStatsFilters {
  status?: LoanApplicationStatus;
  loanProduct?: string;
  loanSource?: string;
  applicationDate?: "today" | "this_week" | "this_month" | "last_month" | "this_year";
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface LoanProductSearchItem {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  termUnit: "days" | "weeks" | "months" | "quarters" | "years";
  isActive: boolean;
}

export interface LoanProductSearchResponse {
  data: LoanProductSearchItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BusinessSearchItem {
  id: string;
  name: string;
  description?: string | null;
  sector?: string | null;
  country?: string | null;
  city?: string | null;
  owner: {
    id: string; // This is the entrepreneurId
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
}

export interface BusinessSearchResponse {
  success: boolean;
  message: string;
  data: BusinessSearchItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== HOOKS =====

/**
 * List loan applications with filters, search, and pagination
 * GET /loan-applications
 */
export function useLoanApplications(
  filters?: LoanApplicationFilters,
  pagination?: { page?: number; limit?: number }
) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;

  // Build query params - all values must be strings per API docs
  const config = useMemo<AxiosRequestConfig>(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (filters?.search) params.search = filters.search;
    if (filters?.status) params.status = filters.status;
    if (filters?.loanProduct) params.loanProduct = filters.loanProduct;
    if (filters?.loanSource) params.loanSource = filters.loanSource;
    if (filters?.applicationDate) params.applicationDate = filters.applicationDate;
    if (filters?.createdAtFrom) params.createdAtFrom = filters.createdAtFrom;
    if (filters?.createdAtTo) params.createdAtTo = filters.createdAtTo;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    return { params };
  }, [page, limit, filters]);

  return useClientApiQuery<ListLoanApplicationsResponse>(
    queryKeys.loanApplications.list(filters),
    "/loan-applications",
    config
  );
}

/**
 * Get loan application statistics
 * GET /loan-applications/stats
 */
export function useLoanApplicationStats(filters?: LoanApplicationStatsFilters) {
  const config = useMemo<AxiosRequestConfig>(() => {
    const params: Record<string, string> = {};

    if (filters?.status) params.status = filters.status;
    if (filters?.loanProduct) params.loanProduct = filters.loanProduct;
    if (filters?.loanSource) params.loanSource = filters.loanSource;
    if (filters?.applicationDate) params.applicationDate = filters.applicationDate;
    if (filters?.createdAtFrom) params.createdAtFrom = filters.createdAtFrom;
    if (filters?.createdAtTo) params.createdAtTo = filters.createdAtTo;

    return { params };
  }, [filters]);

  return useClientApiQuery<LoanApplicationStatsResponse>(
    queryKeys.loanApplications.stats(filters),
    "/loan-applications/stats",
    config
  );
}

/**
 * Create a new loan application
 * POST /loan-applications
 */
export function useCreateLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiPost<CreateLoanApplicationResponse, CreateLoanApplicationRequest>(
    "/loan-applications",
    {
      onSuccess: () => {
        // Invalidate loan applications list and stats
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.all });
      },
    }
  );
}

/**
 * Get a single loan application by ID
 * GET /loan-applications/:id
 */
export function useLoanApplication(applicationId: string) {
  return useClientApiQuery<LoanApplication>(
    queryKeys.loanApplications.detail(applicationId),
    `/loan-applications/${applicationId}`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

/**
 * Search loan products (for loan application creation modal)
 * GET /loan-products/search
 */
export function useSearchLoanProducts(
  search?: string,
  pagination?: { page?: number; limit?: number },
  isActive: boolean = true
) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;

  const config = useMemo<AxiosRequestConfig>(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
      isActive: isActive.toString(),
    };

    if (search) params.search = search;

    return { params };
  }, [page, limit, search, isActive]);

  return useClientApiQuery<LoanProductSearchResponse>(
    [...queryKeys.loanProducts.all, "search", search || "", page, limit, isActive],
    "/loan-products/search",
    config
  );
}

/**
 * Search businesses (for loan application creation modal)
 * GET /business/search
 */
export function useSearchBusinesses(
  search?: string,
  pagination?: { page?: number; limit?: number }
) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;

  const config = useMemo<AxiosRequestConfig>(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (search) params.search = search;

    return { params };
  }, [page, limit, search]);

  return useClientApiQuery<BusinessSearchResponse>(
    [...queryKeys.loanApplications.all, "business-search", search || "", page, limit],
    "/business/search",
    config
  );
}
