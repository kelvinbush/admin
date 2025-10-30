"use client";

import {
  useClientApiQuery,
  useClientApiPaginatedQuery,
  useClientApiMutation,
  useClientApiPost,
} from "../hooks";
import { queryKeys } from "../query-keys";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  User,
  UserGroup,
  Permission,
  CreateUserGroupData,
  UpdateUserGroupData,
  UserGroupFilters,
} from "../types";

// Types based on docs/user-groups-frontend.md
// (Using shared types from lib/api/types)

// Queries
export function useUserGroups(
  filters?: UserGroupFilters,
  pagination?: PaginationParams,
) {
  return useClientApiPaginatedQuery<PaginatedResponse<UserGroup>>(
    queryKeys.userGroups.list(filters),
    "/user-groups",
    pagination?.page || 1,
    pagination?.limit || 10,
  );
}

export function useUserGroup(id: string) {
  return useClientApiQuery<UserGroup>(
    queryKeys.userGroups.detail(id),
    `/user-groups/${id}`,
  );
}

export function useUserGroupPermissions(id: string) {
  return useClientApiQuery<Permission[]>(
    queryKeys.userGroups.permissions(id),
    `/user-groups/${id}/permissions`,
  );
}

export function useUserGroupMembers(
  id: string,
  pagination?: PaginationParams,
) {
  return useClientApiPaginatedQuery<PaginatedResponse<User>>(
    [...queryKeys.userGroups.detail(id), "members"],
    `/user-groups/${id}/members`,
    pagination?.page || 1,
    pagination?.limit || 20,
  );
}

// Mutations
export function useCreateUserGroupMutation() {
  return useClientApiPost<UserGroup, CreateUserGroupData>(
    "/user-groups",
  );
}

export function useUpdateUserGroupMutation() {
  return useClientApiMutation<UserGroup, UpdateUserGroupData>(
    async (api, body) => {
      const { id, ...payload } = body as any;
      return api.patch<UserGroup>(`/user-groups/${id}`, payload);
    },
  );
}

export function useDeleteUserGroupMutation() {
  return useClientApiMutation<ApiResponse, { id: string }>(
    async (api, { id }) => api.delete<ApiResponse>(`/user-groups/${id}`),
  );
}

