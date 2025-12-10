'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiMutation } from '../hooks';
import { queryKeys } from '../query-keys';
import type { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';

// ===== TYPES =====

export interface BusinessSearchItem {
  id: string;
  name: string;
  description?: string | null;
  sector?: string | null;
  country?: string | null;
  city?: string | null;
  owner: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  isAlreadyInGroup: boolean; // Key field - indicates if business is already assigned
}

export interface BusinessSearchResponse {
  success: boolean;
  message: string;
  data: BusinessSearchItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AssignBusinessesRequest {
  businessIds: string[]; // Array of business IDs (min 1, unique)
}

export interface AssignBusinessesResponse {
  success: boolean;
  message: string;
  assigned: number;      // Number of businesses successfully assigned
  skipped: number;       // Number already in group
  invalid: string[];     // Array of invalid business IDs
}

export interface RemoveBusinessResponse {
  success: boolean;
  message: string;
}

// ===== HOOKS =====

/**
 * Search businesses for a user group
 * GET /user-groups/:groupId/businesses/search
 */
export function useSearchUserGroupBusinesses(
  groupId: string,
  search?: string,
  pagination?: { page?: number; limit?: number }
) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;

  // Build query params - all values must be strings
  const config = useMemo<AxiosRequestConfig>(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (search) {
      params.search = search;
    }

    return { params };
  }, [page, limit, search]);

  return useClientApiQuery<BusinessSearchResponse>(
    [...queryKeys.userGroups.detail(groupId), 'businesses', 'search', search || '', page, limit],
    `/user-groups/${groupId}/businesses/search`,
    config,
    {
      enabled: !!groupId,
    }
  );
}

/**
 * Assign businesses to a user group
 * POST /user-groups/:groupId/businesses
 */
export function useAssignBusinessesToGroup(groupId: string) {
  const queryClient = useQueryClient();

  return useClientApiPost<AssignBusinessesResponse, AssignBusinessesRequest>(
    `/user-groups/${groupId}/businesses`,
    {
      onSuccess: () => {
        // Invalidate business search queries for this group
        queryClient.invalidateQueries({ queryKey: [...queryKeys.userGroups.detail(groupId), 'businesses'] });
        // Also invalidate user group members query
        queryClient.invalidateQueries({ queryKey: [...queryKeys.userGroups.detail(groupId), 'members'] });
        // Invalidate user group detail
        queryClient.invalidateQueries({ queryKey: queryKeys.userGroups.detail(groupId) });
      },
    }
  );
}

/**
 * Remove a business from a user group
 * DELETE /user-groups/:groupId/businesses/:businessId
 */
export function useRemoveBusinessFromGroup() {
  const queryClient = useQueryClient();

  return useClientApiMutation<RemoveBusinessResponse, { groupId: string; businessId: string }>(
    async (api, { groupId, businessId }) => {
      return api.delete<RemoveBusinessResponse>(`/user-groups/${groupId}/businesses/${businessId}`);
    },
    {
      onSuccess: (_data, variables) => {
        // Invalidate business search queries for this group
        queryClient.invalidateQueries({ queryKey: [...queryKeys.userGroups.detail(variables.groupId), 'businesses'] });
        // Also invalidate user group members query
        queryClient.invalidateQueries({ queryKey: [...queryKeys.userGroups.detail(variables.groupId), 'members'] });
        // Invalidate user group detail
        queryClient.invalidateQueries({ queryKey: queryKeys.userGroups.detail(variables.groupId) });
      },
    }
  );
}

