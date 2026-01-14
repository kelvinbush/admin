"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useClientApiQuery, useClientApiMutation } from "../hooks";
import { queryKeys } from "../query-keys";
import {
  GetKycKybDocumentsResponse,
  VerifyKycKybDocumentResponse,
  VerifyKycKybDocumentVariables,
  BulkVerifyKycKybDocumentsBody,
  BulkVerifyKycKybDocumentsResponse,
  CompleteKycKybRequestBody,
  CompleteKycKybResponse,
} from "../types";
import type { AxiosError } from "axios";

// ===== KYC/KYB HOOKS =====

export function useKycKybDocuments(loanApplicationId: string) {
  return useClientApiQuery<GetKycKybDocumentsResponse, AxiosError>(
    queryKeys.loanApplications.kycKybDocuments(loanApplicationId),
    `/loan-applications/${loanApplicationId}/kyc-kyb-documents`,
    undefined,
    {
      enabled: !!loanApplicationId,
    },
  );
}

export function useVerifyKycKybDocument(loanApplicationId: string) {
  const queryClient = useQueryClient();

  return useClientApiMutation<VerifyKycKybDocumentResponse, VerifyKycKybDocumentVariables, AxiosError>(
    async (api, variables) => {
      const { documentId, documentType, ...payload } = variables;

      return api.post<VerifyKycKybDocumentResponse>(
        `/loan-applications/${loanApplicationId}/documents/${documentId}/verify`,
        payload,
        {
          params: { documentType },
        },
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.kycKybDocuments(loanApplicationId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(loanApplicationId),
        });
      },
    },
  );
}

export function useBulkVerifyKycKybDocuments(loanApplicationId: string) {
  const queryClient = useQueryClient();

  return useClientApiMutation<BulkVerifyKycKybDocumentsResponse, BulkVerifyKycKybDocumentsBody, AxiosError>(
    (api, payload) =>
      api.post<BulkVerifyKycKybDocumentsResponse>(
        `/loan-applications/${loanApplicationId}/kyc-kyb/bulk-verify`,
        payload,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.kycKybDocuments(loanApplicationId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(loanApplicationId),
        });
      },
    },
  );
}

export function useCompleteKycKyb(loanApplicationId: string) {
  const queryClient = useQueryClient();

  return useClientApiMutation<CompleteKycKybResponse, CompleteKycKybRequestBody, AxiosError>(
    (api, payload) =>
      api.post<CompleteKycKybResponse>(
        `/loan-applications/${loanApplicationId}/kyc-kyb/complete`,
        payload,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.kycKybDocuments(loanApplicationId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.detail(loanApplicationId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.status(loanApplicationId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.loanApplications.stats(),
        });
      },
    },
  );
}
