"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useClientApiMutation,
  useClientApiPaginatedQuery,
  useClientApiPatch,
  useClientApiPost,
  useClientApiQuery,
} from "../hooks";
import { queryKeys } from "@/lib/api";
import type { PaginationParams } from "../types"; // ===== ORGANIZATION HOOKS =====

// ===== ORGANIZATION HOOKS =====

export interface CreateOrganizationRequest {
  name: string; // Required, max 255 chars
  description?: string; // Optional
}

export interface UpdateOrganizationRequest {
  name?: string; // Optional, max 255 chars
  description?: string; // Optional
}

export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface PaginatedOrganizationsResponse {
  items: OrganizationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useOrganizations(
  filters?: { search: string | undefined },
  pagination?: PaginationParams,
) {
  return useClientApiPaginatedQuery<PaginatedOrganizationsResponse>(
    queryKeys.organizations.list(filters),
    "/organizations",
    pagination?.page || 1,
    pagination?.limit || 10,
  );
}

export function useOrganization(organizationId: string) {
  return useClientApiQuery<OrganizationResponse>(
    queryKeys.organizations.detail(organizationId),
    `/organizations/${organizationId}`,
    undefined,
    {
      enabled: !!organizationId,
    },
  );
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useClientApiPost<OrganizationResponse, CreateOrganizationRequest>(
    "/organizations",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.lists(),
        });
      },
    },
  );
}

export function useUpdateOrganization(organizationId: string) {
  const queryClient = useQueryClient();

  return useClientApiPatch<OrganizationResponse, UpdateOrganizationRequest>(
    `/organizations/${organizationId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.detail(organizationId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.lists(),
        });
      },
    },
  );
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    { success: boolean; message: string },
    { id: string }
  >(
    async (api, { id }) =>
      api.delete<{
        success: boolean;
        message: string;
      }>(`/organizations/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.lists(),
        });
      },
    },
  );
}
