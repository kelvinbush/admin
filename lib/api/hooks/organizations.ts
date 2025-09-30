'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPut, useClientApiDelete, useClientApiPaginatedQuery } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  Organization,
  OrganizationFilters,
  PaginationParams,
  CreateOrganizationData,
  UpdateOrganizationData,
} from '../types';

// ===== ORGANIZATION HOOKS =====

export function useOrganizations(filters?: OrganizationFilters, pagination?: PaginationParams) {
  return useClientApiPaginatedQuery<Organization[]>(
    queryKeys.organizations.list(filters),
    '/organizations',
    pagination?.page || 1,
    pagination?.limit || 10
  );
}

export function useOrganization(organizationId: string) {
  return useClientApiQuery<Organization>(
    queryKeys.organizations.detail(organizationId),
    `/organizations/${organizationId}`
  );
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<Organization, CreateOrganizationData>(
    '/organizations',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() });
      }
    }
  );
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  
  return useClientApiPut<Organization, UpdateOrganizationData>(
    '/organizations',
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() });
      }
    }
  );
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  
  return useClientApiDelete<{ success: boolean }>(
    '/organizations',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() });
      }
    }
  );
}
