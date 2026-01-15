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

export interface UpdateLoanApplicationStatusRequest {
  status: LoanApplicationStatus;
  reason?: string;
  rejectionReason?: string;
}

/**
 * Get the next stage based on current status
 */
export function getNextStage(currentStatus: LoanApplicationStatus): LoanApplicationStatus | null {
  const stageFlow: Record<LoanApplicationStatus, LoanApplicationStatus | null> = {
    kyc_kyb_verification: "eligibility_check",
    eligibility_check: "credit_analysis",
    credit_analysis: "head_of_credit_review",
    head_of_credit_review: "internal_approval_ceo",
    internal_approval_ceo: "committee_decision",
    committee_decision: "sme_offer_approval",
    sme_offer_approval: "document_generation",
    document_generation: "signing_execution",
    signing_execution: "awaiting_disbursement",
    awaiting_disbursement: "disbursed",
    approved: null,
    rejected: null,
    disbursed: null,
    cancelled: null,
  };
  return stageFlow[currentStatus] || null;
}

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
 * Detailed loan application response (for detail page)
 * GET /loan-applications/:id
 */
export interface LoanApplicationDetail {
  // Core application data
  id: string;
  loanId: string;
  businessId: string;
  entrepreneurId: string;
  loanProductId: string;
  
  // Funding details
  fundingAmount: number;
  fundingCurrency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate?: number;
  
  // Terms
  repaymentPeriod: number; // in months
  interestRate: number; // percentage (e.g., 10 for 10%)
  intendedUseOfFunds: string;
  
  // Metadata
  loanSource: string;
  status: LoanApplicationStatus;
  
  // Timeline (optional - only set when status changes)
  submittedAt?: string; // ISO 8601 timestamp
  approvedAt?: string; // ISO 8601 timestamp
  rejectedAt?: string; // ISO 8601 timestamp
  disbursedAt?: string; // ISO 8601 timestamp
  cancelledAt?: string; // ISO 8601 timestamp
  rejectionReason?: string; // Only present if rejected
  
  // Audit fields
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  lastUpdatedAt?: string; // ISO 8601 timestamp
  createdBy: string; // User ID
  lastUpdatedBy?: string; // User ID
  
  // Convenience fields (for easy frontend access)
  businessName: string; // Business name
  sector?: string | null; // Business sector
  applicantName: string; // Full name of entrepreneur/applicant
  organizationName: string; // Name of organization providing the loan
  creatorName: string; // Full name of creator
  
  // Related data - Business
  business: {
    id: string;
    name: string;
    description?: string | null;
    sector?: string | null;
    country?: string | null;
    city?: string | null;
    entityType?: string | null;
  };
  
  // Related data - Entrepreneur
  entrepreneur: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phoneNumber?: string | null;
    imageUrl?: string | null;
  };
  
  // Related data - Loan Product
  loanProduct: {
    id: string;
    name: string;
    currency: string;
    minAmount: number;
    maxAmount: number;
  };
  
  // Related data - Creator
  creator: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  
  // Related data - Last Updated By (optional)
  lastUpdatedByUser?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
}

/**
 * Get a single loan application by ID
 * GET /loan-applications/:id
 */
export function useLoanApplication(applicationId: string) {
  return useClientApiQuery<LoanApplicationDetail>(
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

// ===== TIMELINE TYPES =====

export type TimelineEventType =
  | "submitted"
  | "cancelled"
  | "review_in_progress"
  | "rejected"
  | "approved"
  | "awaiting_disbursement"
  | "disbursed";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  date: string;
  time?: string;
  updatedDate?: string;
  updatedTime?: string;
  performedBy?: string;
  performedById?: string;
  lineColor?: "green" | "orange" | "grey";
}

export interface LoanApplicationTimelineResponse {
  data: TimelineEvent[];
}

// ===== LOAN DOCUMENTS TYPES =====

export interface LoanApplicationDocumentItem {
  id: string;
  documentType: string;
  docUrl: string;
  docName: string | null;
  notes: string | null;
  uploadedBy: string;
  createdAt: string;
}

export interface GetLoanDocumentsResponse {
  termSheetUrl: string | null;
  documents: LoanApplicationDocumentItem[];
}

/**
 * Get loan application timeline events
 * GET /loan-applications/:id/timeline
 */
export function useLoanApplicationTimeline(applicationId: string) {
  const query = useClientApiQuery<LoanApplicationTimelineResponse>(
    queryKeys.loanApplications.timeline(applicationId),
    `/loan-applications/${applicationId}/timeline`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );

  // Transform the response to extract the data array
  return {
    ...query,
    data: query.data?.data,
  };
}

/**
 * Get loan application documents
 * GET /loan-applications/:id/documents
 */
export function useLoanDocuments(applicationId: string) {
  return useClientApiQuery<GetLoanDocumentsResponse>(
    queryKeys.loanApplications.documents(applicationId),
    `/loan-applications/${applicationId}/documents`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

/**
 * Update loan application status
 * PUT /loan-applications/:id/status
 */
// ===== ELIGIBILITY ASSESSMENT TYPES =====

export interface CompleteEligibilityAssessmentBody {
  comment: string;
  supportingDocuments?: Array<{
    docUrl: string;
    docName?: string;
    notes?: string;
  }>;
  nextApprover?: {
    nextApproverEmail: string;
    nextApproverName?: string;
  };
}

export interface CompleteEligibilityAssessmentResponse {
  loanApplicationId: string;
  status: "credit_analysis";
  completedAt: string;
  completedBy: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  eligibilityAssessmentComment: string;
  supportingDocuments: Array<{
    id: string;
    docUrl: string;
    docName?: string;
    notes?: string;
  }>;
}

/**
 * Complete Eligibility Assessment
 * POST /loan-applications/:id/eligibility-assessment/complete
 */
export function useCompleteEligibilityAssessment() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    CompleteEligibilityAssessmentResponse,
    { id: string; data: CompleteEligibilityAssessmentBody }
  >(
    async (api, { id, data }) => {
      return api.post<CompleteEligibilityAssessmentResponse>(
        `/loan-applications/${id}/eligibility-assessment/complete`,
        data
      );
    },
    {
      onSuccess: (_data, variables) => {
        // Invalidate the specific loan application detail
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        // Invalidate timeline to show the new status change
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.timeline(variables.id),
        });
        // Invalidate lists to update status in tables
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        // Invalidate stats
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    }
  );
}

// ===== CREDIT ASSESSMENT TYPES =====

export interface CompleteCreditAssessmentBody {
  comment: string;
  supportingDocuments?: Array<{
    docUrl: string;
    docName?: string;
    notes?: string;
  }>;
  nextApprover?: {
    nextApproverEmail: string;
    nextApproverName?: string;
  };
}

// The response for credit assessment completion would likely be the updated LoanApplicationDetail
// or a specific response object. Assuming LoanApplicationDetail for now.

/**
 * Complete Credit Assessment
 * POST /loan-applications/:id/credit-assessment/complete
 */
export function useCompleteCreditAssessment() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationDetail,
    { id: string; data: CompleteCreditAssessmentBody }
  >(
    async (api, { id, data }) => {
      return api.post<LoanApplicationDetail>(
        `/loan-applications/${id}/credit-assessment/complete`,
        data
      );
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.timeline(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    }
  );
}

// ===== HEAD OF CREDIT REVIEW TYPES =====

export interface CompleteHeadOfCreditReviewBody {
  comment?: string;
  supportingDocuments: {
    docUrl: string;
    docName?: string;
  }[];
  nextApprover: {
    nextApproverEmail: string;
    nextApproverName?: string;
  };
}

/**
 * Complete Head of Credit Review
 * POST /loan-applications/:id/head-of-credit-review/complete
 */
export function useCompleteHeadOfCreditReview() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationDetail,
    { id: string; data: CompleteHeadOfCreditReviewBody }
  >(
    async (api, { id, data }) => {
      return api.post<LoanApplicationDetail>(
        `/loan-applications/${id}/head-of-credit-review/complete`,
        data
      );
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.timeline(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    }
  );
}

// ===== INTERNAL APPROVAL CEO TYPES =====

export interface CompleteInternalApprovalCEOBody {
  comment?: string;
  supportingDocuments: {
    docUrl: string;
    docName?: string;
  }[];
  nextApprover: {
    nextApproverEmail: string;
    nextApproverName?: string;
  };
}

/**
 * Complete Internal Approval (CEO)
 * POST /loan-applications/:id/internal-approval-ceo/complete
 */
export function useCompleteInternalApprovalCEO() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationDetail,
    { id: string; data: CompleteInternalApprovalCEOBody }
  >(
    async (api, { id, data }) => {
      return api.post<LoanApplicationDetail>(
        `/loan-applications/${id}/internal-approval-ceo/complete`,
        data
      );
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.timeline(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    }
  );
}

// ===== COMMITTEE DECISION TYPES =====

export interface CompleteCommitteeDecisionBody {
  termSheetUrl: string;
}

/**
 * Complete Committee Decision
 * POST /loan-applications/:id/committee-decision/complete
 */
export function useCompleteCommitteeDecision() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationDetail,
    { id: string; data: CompleteCommitteeDecisionBody }
  >(
    async (api, { id, data }) => {
      return api.post<LoanApplicationDetail>(
        `/loan-applications/${id}/committee-decision/complete`,
        data
      );
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.timeline(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    }
  );
}

export function useUpdateLoanApplicationStatus() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationDetail,
    { id: string; data: UpdateLoanApplicationStatusRequest }
  >(
    async (api, { id, data }) => {
      return api.put<LoanApplicationDetail>(`/loan-applications/${id}/status`, data);
    },
    {
      onSuccess: (_data, variables) => {
        // Invalidate the specific loan application detail
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        // Invalidate timeline to show the new status change
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.timeline(variables.id),
        });
        // Invalidate lists to update status in tables
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        // Invalidate stats
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    }
  );
}
