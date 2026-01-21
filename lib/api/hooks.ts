"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useApiWithAuth } from "./client";
import { AxiosRequestConfig, AxiosError } from "axios";

// Generic hook for GET requests with authentication
export function useClientApiQuery<TData = unknown, TError = AxiosError>(
  queryKey: readonly unknown[],
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">,
) {
  const api = useApiWithAuth();

  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => api.get<TData>(url, config),
    ...options,
  });
}

export interface CompleteDocumentGenerationBody {
  contractUrl: string;
  docName?: string;
  notes?: string;
}

export function useCompleteDocumentGeneration() {
  return useClientApiMutation<unknown, { id: string; data: CompleteDocumentGenerationBody }>(
    (api, { id, data }) =>
      api.post<unknown>(`/loan-applications/${id}/document-generation/complete`, data),
  );
}

// ===== INTERNAL USERS HELPERS =====

export interface UpdateInvitationBody {
  email?: string;
  role?: "super-admin" | "admin" | "member";
}

export function useUpdateInternalInvitation() {
  return useClientApiMutation<
    unknown,
    { id: string; data: UpdateInvitationBody }
  >((api, { id, data }) =>
    api.patch<unknown>(`/admin/internal-users/invitations/${id}`, data),
  );
}

export interface UpdateUserRoleBody {
  role: "super-admin" | "admin" | "member";
}

export function useUpdateInternalUserRole() {
  return useClientApiMutation<
    unknown,
    { clerkUserId: string; data: UpdateUserRoleBody }
  >((api, { clerkUserId, data }) =>
    api.patch<unknown>(`/admin/internal-users/${clerkUserId}/role`, data),
  );
}

// Generic hook for mutations with authentication
export function useClientApiMutation<
  TData = unknown,
  TVariables = unknown,
  TError = AxiosError,
>(
  mutationFn: (
    api: ReturnType<typeof useApiWithAuth>,
    variables: TVariables,
  ) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>,
) {
  const api = useApiWithAuth();
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => mutationFn(api, variables),
    onSuccess: () => {
      // Invalidate all queries on successful mutation
      queryClient.invalidateQueries();
    },
    ...options,
  });
}

// Hook for POST mutations
export function useClientApiPost<
  TData = unknown,
  TVariables = unknown,
  TError = AxiosError,
>(url: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useClientApiMutation<TData, TVariables, TError>(
    (api, variables) => api.post<TData>(url, variables),
    options,
  );
}

// Hook for PUT mutations
export function useClientApiPut<
  TData = unknown,
  TVariables = unknown,
  TError = AxiosError,
>(url: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useClientApiMutation<TData, TVariables, TError>(
    (api, variables) => api.put<TData>(url, variables),
    options,
  );
}

// Hook for PATCH mutations
export function useClientApiPatch<
  TData = unknown,
  TVariables = unknown,
  TError = AxiosError,
>(url: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useClientApiMutation<TData, TVariables, TError>(
    (api, variables) => api.patch<TData>(url, variables),
    options,
  );
}

// Hook for DELETE mutations
export function useClientApiDelete<TData = unknown, TError = AxiosError>(
  url: string,
  options?: UseMutationOptions<TData, TError, void>,
) {
  return useClientApiMutation<TData, void, TError>(
    (api) => api.delete<TData>(url),
    options,
  );
}

// Hook for paginated queries
export function useClientApiPaginatedQuery<
  TData = unknown,
  TError = AxiosError,
>(
  queryKey: readonly unknown[],
  url: string,
  page: number = 1,
  limit: number = 10,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">,
) {
  const api = useApiWithAuth();

  return useQuery<TData, TError>({
    queryKey: [...queryKey, page, limit],
    queryFn: () => api.get<TData>(`${url}?page=${page}&limit=${limit}`, config),
    ...options,
  });
}

// Hook for infinite queries (for infinite scroll)
export function useClientApiInfiniteQuery<TData = unknown>(
  queryKey: readonly unknown[],
  url: string,
  config?: AxiosRequestConfig,
  options?: any,
) {
  const api = useApiWithAuth();

  return useQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return api.get<TData>(`${url}?page=${pageParam}`, config);
    },
    getNextPageParam: (lastPage: any) => {
      // Adjust this based on your API's pagination structure
      return lastPage?.pagination?.hasNext
        ? lastPage.pagination.page + 1
        : undefined;
    },
    ...options,
  });
}
