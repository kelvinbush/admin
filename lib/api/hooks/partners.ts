'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPut, useClientApiDelete, useClientApiPaginatedQuery } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  Partner,
  PartnerFilters,
  PaginationParams,
  CreatePartnerData,
  UpdatePartnerData,
} from '../types';

// ===== PARTNER HOOKS =====

export function usePartners(filters?: PartnerFilters, pagination?: PaginationParams) {
  return useClientApiPaginatedQuery<Partner[]>(
    queryKeys.partners.list(filters),
    '/partners',
    pagination?.page || 1,
    pagination?.limit || 10
  );
}

export function usePartner(partnerId: string) {
  return useClientApiQuery<Partner>(
    queryKeys.partners.detail(partnerId),
    `/partners/${partnerId}`
  );
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<Partner, CreatePartnerData>(
    '/partners',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.partners.lists() });
      }
    }
  );
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  
  return useClientApiPut<Partner, UpdatePartnerData>(
    '/partners',
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.partners.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.partners.lists() });
      }
    }
  );
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  
  return useClientApiDelete<{ success: boolean }>(
    '/partners',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.partners.lists() });
      }
    }
  );
}
