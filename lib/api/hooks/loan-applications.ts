"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useClientApiMutation, useClientApiQuery } from "../hooks";
import { queryKeys } from "../query-keys";
import type {
  ApproveApplicationData,
  AuditTrailFilters,
  CreateOfferLetterData,
  DocumentRequestFilters,
  ListLoanApplicationsResponse,
  LoanApplicationItem,
  LoanApplicationsFilters,
  OfferLetterFilters,
  OfferLetterItem,
  RejectApplicationData,
  SendOfferLetterData,
  SendOfferLetterResponse,
  StatusUpdateData,
  UpdateLoanApplicationData,
  UpdateOfferLetterData,
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
    },
  );
}

export function useLoanApplication(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.detail(applicationId),
    `/loan-applications/${applicationId}`,
    undefined,
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data as LoanApplicationItem;
        }
        return data as LoanApplicationItem;
      },
    },
  );
}

export function useUpdateLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    {
      id: string;
      data: UpdateLoanApplicationData;
    }
  >(
    (
      api: any,
      variables: {
        id: string;
        data: UpdateLoanApplicationData;
      },
    ) => api.patch(`/loan-applications/${variables.id}`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: UpdateLoanApplicationData },
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(variables.id),
        });
      },
    },
  );
}

// ===== STATUS MANAGEMENT HOOKS =====

export function useLoanApplicationStatus(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.status(applicationId),
    `/loan-applications/${applicationId}/status`,
    undefined,
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

export function useUpdateLoanApplicationStatus() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: StatusUpdateData }
  >(
    (
      api: any,
      variables: {
        id: string;
        data: StatusUpdateData;
      },
    ) => api.put(`/loan-applications/${variables.id}/status`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: StatusUpdateData },
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
    },
  );
}

export function useApproveLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: ApproveApplicationData }
  >(
    (
      api: any,
      variables: {
        id: string;
        data: ApproveApplicationData;
      },
    ) => api.post(`/loan-applications/${variables.id}/approve`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: ApproveApplicationData },
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
    },
  );
}

export function useRejectLoanApplication() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    LoanApplicationItem,
    { id: string; data: RejectApplicationData }
  >(
    (
      api: any,
      variables: {
        id: string;
        data: RejectApplicationData;
      },
    ) => api.post(`/loan-applications/${variables.id}/reject`, variables.data),
    {
      onSuccess: (
        data: LoanApplicationItem,
        variables: { id: string; data: RejectApplicationData },
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
    },
  );
}

export function useLoanApplicationStatusHistory(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.statusHistory(applicationId),
    `/loan-applications/${applicationId}/status/history`,
    undefined,
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

// ===== AUDIT TRAIL HOOKS =====

export function useLoanApplicationAuditTrail(
  applicationId: string,
  filters?: AuditTrailFilters,
) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.auditTrail(applicationId, filters),
    `/loan-applications/${applicationId}/audit-trail`,
    {
      params: filters,
    },
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

export function useLoanApplicationAuditSummary(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.auditSummary(applicationId),
    `/loan-applications/${applicationId}/audit-trail/summary`,
    undefined,
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

// ===== DOCUMENT REQUEST HOOKS =====

export function useLoanApplicationDocumentRequests(
  applicationId: string,
  filters?: DocumentRequestFilters,
) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.documentRequests(applicationId, filters),
    `/loan-applications/${applicationId}/document-requests`,
    {
      params: filters,
    },
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

export function useLoanApplicationDocumentStats(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.documentStats(applicationId),
    `/loan-applications/${applicationId}/document-requests/statistics`,
    undefined,
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

// ===== OFFER LETTER HOOKS =====

export function useCreateOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<OfferLetterItem, CreateOfferLetterData>(
    (api: any, variables: CreateOfferLetterData) =>
      api.post(`/offer-letters`, variables),
    {
      onSuccess: (data, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(
            variables.loanApplicationId,
          ),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.list(),
        });
      },
    },
  );
}

export function useSendOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SendOfferLetterResponse,
    {
      id: string;
      data: SendOfferLetterData;
    }
  >(
    (
      api: any,
      variables: {
        id: string;
        data: SendOfferLetterData;
      },
    ) => api.post(`/offer-letters/${variables.id}/send`, variables.data),
    {
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: ["offer-letters"],
        });
      },
    },
  );
}

export function useOfferLetters(filters?: OfferLetterFilters) {
  return useClientApiQuery<any>(
    ["offer-letters", filters],
    `/offer-letters`,
    {
      params: filters,
    },
    {
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

export function useUpdateOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    OfferLetterItem,
    { id: string; data: UpdateOfferLetterData }
  >(
    (
      api: any,
      variables: {
        id: string;
        data: UpdateOfferLetterData;
      },
    ) => api.patch(`/offer-letters/${variables.id}`, variables.data),
    {
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: ["offer-letters"],
        });
      },
    },
  );
}

export function useVoidOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<OfferLetterItem, { id: string }>(
    (
      api: any,
      variables: {
        id: string;
      },
    ) => api.patch(`/offer-letters/${variables.id}/void`),
    {
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: ["offer-letters"],
        });
      },
    },
  );
}

// ===== SNAPSHOT HOOKS =====

export function useLoanApplicationSnapshots(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.snapshots(applicationId),
    `/loan-applications/${applicationId}/snapshots`,
    undefined,
    {
      enabled: !!applicationId,
      select: (data) => {
        // Extract data from API response wrapper if it exists
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          "data" in data &&
          data.success === true
        ) {
          return data.data;
        }
        return data;
      },
    },
  );
}

export function useLoanApplicationLatestSnapshot(applicationId: string) {
  return useClientApiQuery<any>(
    queryKeys.loanApplications.latestSnapshot(applicationId),
    `/loan-applications/${applicationId}/snapshots/latest`,
    undefined,
    {
      enabled: !!applicationId,
    },
  );
}
