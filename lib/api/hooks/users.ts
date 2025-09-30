'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPaginatedQuery } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  User,
  UserFilters,
  PaginationParams,
} from '../types';

// ===== USER HOOKS =====

export function useUsers(filters?: UserFilters, pagination?: PaginationParams) {
  return useClientApiPaginatedQuery<User[]>(
    queryKeys.users.list(filters),
    '/users',
    pagination?.page || 1,
    pagination?.limit || 10
  );
}

export function useUser(userId: string) {
  return useClientApiQuery<User>(
    queryKeys.users.detail(userId),
    `/users/${userId}`
  );
}

export function useUserProfile(userId: string) {
  return useClientApiQuery<User>(
    queryKeys.users.profile(userId),
    `/users/${userId}/profile`
  );
}

export function useSearchUsers(searchTerm: string) {
  return useClientApiQuery<User[]>(
    queryKeys.search.users(searchTerm),
    `/users/search?q=${encodeURIComponent(searchTerm)}`
  );
}
