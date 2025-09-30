'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPut, useClientApiDelete } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  LoanProduct,
  ListLoanProductsResponse,
  CreateLoanProductData,
  UpdateLoanProductData,
} from '../types';

// ===== LOAN PRODUCT HOOKS =====

export function useLoanProducts(filters?: Record<string, any>) {
  return useClientApiQuery<ListLoanProductsResponse>(
    queryKeys.loanProducts.list(filters || {}),
    '/loan-products',
    undefined,
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
  
  return useClientApiPost<LoanProduct, CreateLoanProductData>(
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
  
  return useClientApiPut<LoanProduct, UpdateLoanProductData>(
    '/loan-products',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanProducts.lists() });
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
