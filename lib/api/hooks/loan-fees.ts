'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPatch, useClientApiMutation } from '../hooks';
import { queryKeys } from '../query-keys';
import type { AxiosRequestConfig } from 'axios';

// ===== LOAN FEE TYPES =====

export interface LoanFee {
  id: string;
  name: string;
  calculationMethod: 'flat' | 'percentage';
  rate: number;
  collectionRule: 'upfront' | 'end_of_term';
  allocationMethod: string;
  calculationBasis: 'principal' | 'total_disbursed';
  isArchived: boolean;
  createdAt: string;  // ISO 8601 timestamp
  updatedAt: string;  // ISO 8601 timestamp
}

export interface PaginatedLoanFeesResponse {
  items: LoanFee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLoanFeeRequest {
  name: string;                    // Required, max 255 chars
  calculationMethod: 'flat' | 'percentage';
  rate: number;                    // Required, fee rate/percentage
  collectionRule: 'upfront' | 'end_of_term';
  allocationMethod: string;         // e.g., "first_installment", "spread_installments"
  calculationBasis: 'principal' | 'total_disbursed';
}

export interface UpdateLoanFeeRequest {
  name?: string;
  calculationMethod?: 'flat' | 'percentage';
  rate?: number;
  collectionRule?: 'upfront' | 'end_of_term';
  allocationMethod?: string;
  calculationBasis?: 'principal' | 'total_disbursed';
}

export interface DeleteLoanFeeResponse {
  success: boolean;
  message: string;  // Indicates if archived or deleted
}

export interface LoanFeeFilters {
  search?: string;
  includeArchived?: boolean;
}

// ===== LOAN FEE HOOKS =====

export function useLoanFees(filters?: LoanFeeFilters, pagination?: { page?: number; limit?: number }) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  
  // Build query params
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.includeArchived) params.append('includeArchived', 'true');

  const config: AxiosRequestConfig = {
    params: Object.fromEntries(params),
  };

  return useClientApiQuery<PaginatedLoanFeesResponse>(
    queryKeys.loanFees.list(filters),
    `/loan-fees?${params.toString()}`,
    config
  );
}

export function useLoanFee(loanFeeId: string) {
  return useClientApiQuery<LoanFee>(
    queryKeys.loanFees.detail(loanFeeId),
    `/loan-fees/${loanFeeId}`,
    undefined,
    {
      enabled: !!loanFeeId,
    }
  );
}

export function useCreateLoanFee() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<LoanFee, CreateLoanFeeRequest>(
    '/loan-fees',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.lists() });
      }
    }
  );
}

export function useUpdateLoanFee(loanFeeId: string) {
  const queryClient = useQueryClient();
  
  return useClientApiPatch<LoanFee, UpdateLoanFeeRequest>(
    `/loan-fees/${loanFeeId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.detail(loanFeeId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.lists() });
      }
    }
  );
}

export function useDeleteLoanFee() {
  const queryClient = useQueryClient();
  
  return useClientApiMutation<DeleteLoanFeeResponse, { id: string }>(
    async (api, { id }) => api.delete<DeleteLoanFeeResponse>(`/loan-fees/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.lists() });
      }
    }
  );
}

export function useUnarchiveLoanFee(loanFeeId: string) {
  const queryClient = useQueryClient();
  
  return useClientApiPost<LoanFee, void>(
    `/loan-fees/${loanFeeId}/unarchive`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.detail(loanFeeId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.lists() });
      }
    }
  );
}

// Hook for unarchiving that accepts ID in variables (for use in tables)
export function useUnarchiveLoanFeeMutation() {
  const queryClient = useQueryClient();

  return useClientApiMutation<LoanFee, { id: string }>(
    async (api, { id }) => {
      return api.post<LoanFee>(`/loan-fees/${id}/unarchive`);
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanFees.lists() });
      },
    }
  );
}

