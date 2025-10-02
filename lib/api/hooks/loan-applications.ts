"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useClientApiQuery,
  useClientApiPost,
  useClientApiPut,
  useClientApiPatch,
  useClientApiDelete,
  useClientApiMutation,
} from "../hooks";
import { queryKeys } from "../query-keys";
import type {
  LoanApplicationItem,
  ListLoanApplicationsResponse,
  LoanApplicationsFilters,
  UpdateLoanApplicationData,
  StatusResponse,
  StatusUpdateData,
  ApproveApplicationData,
  RejectApplicationData,
  StatusHistoryResponse,
  AuditTrailResponse,
  AuditTrailFilters,
  AuditSummaryResponse,
  DocumentStatsResponse,
  DocumentRequestFilters,
  SnapshotsResponse,
} from "../types";

// ===== LOAN APPLICATION HOOKS =====

export function useLoanApplications(filters?: LoanApplicationsFilters) {
  return useClientApiQuery<ListLoanApplicationsResponse>(
    queryKeys.loanApplications.list(filters || {}),
    "/loan-applications",
    {
      params: filters,
    },
    {
      enabled: true,
    }
  );
}

export function useLoanApplication(applicationId: string) {
  return useClientApiQuery<LoanApplicationItem>(
    queryKeys.loanApplications.detail(applicationId),
    `/loan-applications/${applicationId}`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

export function useUpdateLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: UpdateLoanApplicationData }
  >(
    (api: any, variables: { id: string; data: UpdateLoanApplicationData }) =>
      api.patch(`/loan-applications/${variables.id}`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: UpdateLoanApplicationData }
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
      },
    }
  );
}

// ===== STATUS MANAGEMENT HOOKS =====

export function useLoanApplicationStatus(applicationId: string) {
  return useClientApiQuery<StatusResponse>(
    queryKeys.loanApplications.status(applicationId),
    `/loan-applications/${applicationId}/status`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

export function useUpdateLoanApplicationStatus() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: StatusUpdateData }
  >(
    (api: any, variables: { id: string; data: StatusUpdateData }) =>
      api.put(`/loan-applications/${variables.id}/status`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: StatusUpdateData }
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.status(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.statusHistory(variables.id),
        });
      },
    }
  );
}

export function useApproveLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: ApproveApplicationData }
  >(
    (api: any, variables: { id: string; data: ApproveApplicationData }) =>
      api.post(`/loan-applications/${variables.id}/approve`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: ApproveApplicationData }
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.status(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.statusHistory(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.auditTrail(variables.id),
        });
      },
    }
  );
}

export function useRejectLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: RejectApplicationData }
  >(
    (api: any, variables: { id: string; data: RejectApplicationData }) =>
      api.post(`/loan-applications/${variables.id}/reject`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: RejectApplicationData }
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.status(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.statusHistory(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.auditTrail(variables.id),
        });
      },
    }
  );
}

export function useLoanApplicationStatusHistory(applicationId: string) {
  return useClientApiQuery<StatusHistoryResponse>(
    queryKeys.loanApplications.statusHistory(applicationId),
    `/loan-applications/${applicationId}/status/history`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

// ===== AUDIT TRAIL HOOKS =====

export function useLoanApplicationAuditTrail(
  applicationId: string,
  filters?: AuditTrailFilters
) {
  return useClientApiQuery<AuditTrailResponse>(
    queryKeys.loanApplications.auditTrail(applicationId, filters),
    `/loan-applications/${applicationId}/audit-trail`,
    {
      params: filters,
    },
    {
      enabled: !!applicationId,
    }
  );
}

export function useLoanApplicationAuditSummary(applicationId: string) {
  return useClientApiQuery<AuditSummaryResponse>(
    queryKeys.loanApplications.auditSummary(applicationId),
    `/loan-applications/${applicationId}/audit-trail/summary`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

// ===== DOCUMENT REQUEST HOOKS =====

export function useLoanApplicationDocumentRequests(
  applicationId: string,
  filters?: DocumentRequestFilters
) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.documentRequests(applicationId, filters),
    `/loan-applications/${applicationId}/document-requests`,
    {
      params: filters,
    },
    {
      enabled: !!applicationId,
    }
  );
}

export function useLoanApplicationDocumentStats(applicationId: string) {
  return useClientApiQuery<DocumentStatsResponse>(
    queryKeys.loanApplications.documentStats(applicationId),
    `/loan-applications/${applicationId}/document-requests/statistics`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

// ===== SNAPSHOT HOOKS =====

export function useLoanApplicationSnapshots(applicationId: string) {
  return useClientApiQuery<SnapshotsResponse>(
    queryKeys.loanApplications.snapshots(applicationId),
    `/loan-applications/${applicationId}/snapshots`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}

export function useLoanApplicationLatestSnapshot(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.latestSnapshot(applicationId),
    `/loan-applications/${applicationId}/snapshots/latest`,
    undefined,
    {
      enabled: !!applicationId,
    }
  );
}
