'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  LoanApplication,
  LoanApplicationFilters,
  PaginationParams,
} from '../types';

// ===== LOAN APPLICATION HOOKS =====

export function useLoanApplications(filters?: LoanApplicationFilters, pagination?: PaginationParams) {
  return useClientApiQuery<LoanApplication[]>(
    queryKeys.loanApplications.list(filters),
    '/loan-applications',
    undefined,
    {
      enabled: true,
    }
  );
}

export function useLoanApplication(applicationId: string) {
  return useClientApiQuery<LoanApplication>(
    queryKeys.loanApplications.detail(applicationId),
    `/loan-applications/${applicationId}`
  );
}

export function useUpdateLoanApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<LoanApplication, { id: string; status: string; rejectionReason?: string }>(
    '/loan-applications/status',
    {
      onSuccess: (data, variables) => {
        // Invalidate specific loan application
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.detail(variables.id) });
        // Invalidate loan applications list
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}

export function useSearchLoanApplications(searchTerm: string) {
  return useClientApiQuery<LoanApplication[]>(
    queryKeys.search.loanApplications(searchTerm),
    `/loan-applications/search?q=${encodeURIComponent(searchTerm)}`
  );
}

export function useBulkUpdateLoanApplications() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<
    { success: boolean; updated: number },
    { ids: string[]; status: string }
  >(
    '/loan-applications/bulk-update',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}
