'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPut, useClientApiDelete, useClientApiMutation } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  LoanProduct,
  ListLoanProductsResponse,
  UpdateLoanProductData,
  LoanProductsFilters,
} from '../types';
import type { CreateLoanProductFormData } from '../../validations/loan-product';

// ===== LOAN PRODUCT HOOKS =====

export function useLoanProducts(filters?: LoanProductsFilters) {
  return useClientApiQuery<ListLoanProductsResponse>(
    queryKeys.loanProducts.list(filters || {}),
    '/loan-products',
    {
      params: filters,
    },
    {
      enabled: true,
    }
  );
}

export function useLoanProduct(productId: string) {
  return useClientApiQuery<LoanProduct>(
    queryKeys.loanProducts.detail(productId),
    `/loan-products/${productId}`
  );
}

export function useCreateLoanProduct() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<LoanProduct, CreateLoanProductFormData>(
    '/loan-products',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
      }
    }
  );
}

export function useUpdateLoanProduct() {
  const queryClient = useQueryClient();

  return useClientApiMutation<LoanProduct, { id: string; data: UpdateLoanProductData }>(
    (api: any, variables: { id: string; data: UpdateLoanProductData }) => 
      api.patch(`/loan-products/${variables.id}`, variables.data),
    {
      onSuccess: (data: LoanProduct, variables: { id: string; data: UpdateLoanProductData }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.detail(variables.id) });
      }
    }
  );
}

export function useDeleteLoanProduct() {
  const queryClient = useQueryClient();
  
  return useClientApiDelete<{ success: boolean }>(
    '/loan-products',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
      }
    }
  );
}

export function useUpdateLoanProductStatus() {
  const queryClient = useQueryClient();
  
  return useClientApiMutation<LoanProduct, { id: string; status: string; changeReason: string; approvedBy: string }>(
    (api: any, variables: { id: string; status: string; changeReason: string; approvedBy: string }) => 
      api.patch(`/loan-products/${variables.id}/status`, {
        status: variables.status,
        changeReason: variables.changeReason,
        approvedBy: variables.approvedBy
      }),
    {
      onSuccess: (data: LoanProduct, variables: { id: string; status: string; changeReason: string; approvedBy: string }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
      }
    }
  );
}
