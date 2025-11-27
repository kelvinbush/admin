'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  useClientApiQuery,
  useClientApiMutation,
  useClientApiPost,
  useClientApiPut,
} from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  SMEUser,
  SMEUserDetail,
  SMEOnboardingState,
  ListSMEUsersResponse,
  SMEUsersFilters,
  EntrepreneurListFilters,
  EntrepreneurListResponse,
  EntrepreneursStatsResponse,
  CreateSMEUserData,
  CreateSMEUserResponse,
  UpdateEntrepreneurDetailsData,
  UpdateEntrepreneurDetailsResponse,
  SaveBusinessBasicInfoData,
  SaveLocationInfoData,
  SavePersonalDocumentsData,
  SaveCompanyDocumentsData,
  SaveFinancialDocumentsData,
  SaveFinancialDetailsData,
  SavePermitsData,
  SendInvitationResponse,
  SMEAuditTrailResponse,
  SMEAuditTrailFilters,
} from '../types';

// ===== SME USER / ENTREPRENEUR LIST HOOKS =====

/**
 * List entrepreneurs for the main table view
 */
export function useEntrepreneurs(filters?: EntrepreneurListFilters) {
  const params = new URLSearchParams();

  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.onboardingStatus) params.append('onboardingStatus', filters.onboardingStatus);
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = `/admin/sme/entrepreneurs${queryString ? `?${queryString}` : ''}`;

  return useClientApiQuery<EntrepreneurListResponse>(
    queryKeys.entrepreneurs.list(filters),
    url,
    undefined,
    {
      enabled: true,
    }
  );
}

/**
 * Get aggregate statistics for entrepreneurs dashboard
 */
export function useEntrepreneursStats() {
  return useClientApiQuery<EntrepreneursStatsResponse>(
    queryKeys.entrepreneurs.stats(),
    '/admin/sme/entrepreneurs/stats',
    undefined,
    { enabled: true }
  );
}

/**
 * List all SME users with optional filtering and pagination
 */
export function useSMEUsers(filters?: SMEUsersFilters) {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.onboardingStatus) params.append('onboardingStatus', filters.onboardingStatus);
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = `/admin/sme/users${queryString ? `?${queryString}` : ''}`;

  return useClientApiQuery<ListSMEUsersResponse>(
    queryKeys.sme.list(filters),
    url,
    undefined,
    {
      enabled: true,
    }
  );
}

/**
 * Get detailed information about a specific SME user
 */
export function useSMEUser(
  userId: string,
  options?: { enabled?: boolean }
) {
  return useClientApiQuery<SMEUserDetail>(
    queryKeys.sme.detail(userId),
    `/admin/sme/users/${userId}`,
    undefined,
    {
      enabled: options?.enabled !== false && !!userId,
    }
  );
}

/**
 * Get the current onboarding state for a user
 */
export function useSMEOnboardingState(
  userId: string,
  options?: { enabled?: boolean }
) {
  return useClientApiQuery<SMEOnboardingState>(
    queryKeys.sme.onboarding(userId),
    `/admin/sme/onboarding/${userId}`,
    undefined,
    {
      enabled: options?.enabled !== false && !!userId,
    }
  );
}

// ===== ONBOARDING STEP HOOKS =====

/**
 * Create a new SME user and start the onboarding process (Step 1)
 */
export function useCreateSMEUser() {
  const queryClient = useQueryClient();

  return useClientApiMutation<CreateSMEUserResponse, CreateSMEUserData>(
    (api, variables) => api.post('/admin/sme/onboarding/start', variables),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(data.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(data.userId) });
      },
    }
  );
}

/**
 * Update user information for an existing SME user (Step 1)
 */
export function useUpdateSMEUserStep1() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: CreateSMEUserData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/1`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Update entrepreneur details (consolidated endpoint)
 * Updates all entrepreneur personal details including core user info and metadata fields in a single atomic transaction
 */
export function useUpdateEntrepreneurDetails() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    UpdateEntrepreneurDetailsResponse,
    { userId: string; data: UpdateEntrepreneurDetailsData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/users/${variables.userId}/details`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.entrepreneurs.lists() });
      },
    }
  );
}

/**
 * Save business basic information (Step 2)
 */
export function useSaveBusinessBasicInfo() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SaveBusinessBasicInfoData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/2`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Save business location information (Step 3)
 */
export function useSaveLocationInfo() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SaveLocationInfoData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/3`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Upload personal documents (Step 4)
 */
export function useSavePersonalDocuments() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SavePersonalDocumentsData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/4`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Upload company information documents (Step 5)
 */
export function useSaveCompanyDocuments() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SaveCompanyDocumentsData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/5`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Upload financial documents (Step 6)
 */
export function useSaveFinancialDocuments() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SaveFinancialDocumentsData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/6`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Save or update financial details (Financial Details tab)
 */
export function useSaveFinancialDetails() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SaveFinancialDetailsData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/users/${variables.userId}/financial-details`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Upload permits and pitch deck documents (Step 7)
 */
export function useSavePermitsAndPitchDeck() {
  const queryClient = useQueryClient();

  return useClientApiMutation<
    SMEOnboardingState,
    { userId: string; data: SavePermitsData }
  >(
    (api, variables) =>
      api.put(`/admin/sme/onboarding/${variables.userId}/step/7`, variables.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

/**
 * Send or resend an invitation to the SME user via Clerk
 */
export function useSendSMEInvitation() {
  const queryClient = useQueryClient();

  return useClientApiMutation<SendInvitationResponse, { userId: string }>(
    (api, variables) =>
      api.post(`/admin/sme/onboarding/${variables.userId}/invite`),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.detail(variables.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.sme.onboarding(variables.userId) });
      },
    }
  );
}

// ===== DOCUMENT HOOKS =====

export interface PersonalDocument {
  id: string;
  docType: string;
  docUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessDocument {
  id: string;
  docType: string;
  docUrl: string;
  isPasswordProtected?: boolean;
  docPassword?: string | null;
  docBankName?: string | null;
  docYear?: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all personal documents for an SME user
 */
export function useSMEPersonalDocuments(
  userId: string,
  options?: { enabled?: boolean }
) {
  return useClientApiQuery<PersonalDocument[]>(
    [...queryKeys.sme.detail(userId), 'documents', 'personal'],
    `/admin/sme/users/${userId}/documents/personal`,
    undefined,
    {
      enabled: options?.enabled !== false && !!userId,
      select: (data: any) => {
        // Handle API response wrapper
        if (data?.success && data?.data) {
          return data.data as PersonalDocument[];
        }
        return data as PersonalDocument[];
      },
    }
  );
}

/**
 * Get all business documents for an SME user
 */
export function useSMEBusinessDocuments(
  userId: string,
  options?: { enabled?: boolean }
) {
  return useClientApiQuery<BusinessDocument[]>(
    [...queryKeys.sme.detail(userId), 'documents', 'business'],
    `/admin/sme/users/${userId}/documents/business`,
    undefined,
    {
      enabled: options?.enabled !== false && !!userId,
      select: (data: any) => {
        // Handle API response wrapper
        if (data?.success && data?.data) {
          return data.data as BusinessDocument[];
        }
        return data as BusinessDocument[];
      },
    }
  );
}

/**
 * Get audit trail for an SME user
 */
export function useSMEAuditTrail(
  userId: string,
  filters?: SMEAuditTrailFilters,
  options?: { enabled?: boolean }
) {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.action) params.append('action', filters.action);

  const queryString = params.toString();
  const url = `/admin/sme/users/${userId}/audit-trail${queryString ? `?${queryString}` : ''}`;

  return useClientApiQuery<SMEAuditTrailResponse>(
    queryKeys.sme.auditTrail(userId, filters),
    url,
    undefined,
    {
      enabled: options?.enabled !== false && !!userId,
    }
  );
}

