'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPut, useClientApiDelete, useClientApiPaginatedQuery } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  UserGroup,
  UserGroupFilters,
  PaginationParams,
  CreateUserGroupData,
  UpdateUserGroupData,
} from '../types';

// ===== USER GROUP HOOKS =====

export function useUserGroups(filters?: UserGroupFilters, pagination?: PaginationParams) {
  return useClientApiPaginatedQuery<UserGroup[]>(
    queryKeys.userGroups.list(filters),
    '/user-groups',
    pagination?.page || 1,
    pagination?.limit || 10
  );
}

export function useUserGroup(groupId: string) {
  return useClientApiQuery<UserGroup>(
    queryKeys.userGroups.detail(groupId),
    `/user-groups/${groupId}`
  );
}

export function useCreateUserGroup() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<UserGroup, CreateUserGroupData>(
    '/user-groups',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.userGroups.lists() });
      }
    }
  );
}

export function useUpdateUserGroup() {
  const queryClient = useQueryClient();
  
  return useClientApiPut<UserGroup, UpdateUserGroupData>(
    '/user-groups',
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.userGroups.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.userGroups.lists() });
      }
    }
  );
}

export function useDeleteUserGroup() {
  const queryClient = useQueryClient();
  
  return useClientApiDelete<{ success: boolean }>(
    '/user-groups',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.userGroups.lists() });
      }
    }
  );
}
