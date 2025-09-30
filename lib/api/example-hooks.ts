'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPut, useClientApiDelete, useClientApiPaginatedQuery } from './hooks';
import { queryKeys } from './query-keys';
import type {
  User,
  LoanApplication,
  LoanProduct,
  ListLoanProductsResponse,
  Organization,
  Partner,
  UserGroup,
  DashboardOverview,
  LoanAnalytics,
  SMEAnalytics,
  CreateLoanProductData,
  UpdateLoanProductData,
  CreateUserGroupData,
  UpdateUserGroupData,
  CreateOrganizationData,
  UpdateOrganizationData,
  CreatePartnerData,
  UpdatePartnerData,
  LoanApplicationFilters,
  UserFilters,
  LoanProductFilters,
  OrganizationFilters,
  PartnerFilters,
  UserGroupFilters,
  PaginationParams,
  UpdateUserAndDocumentsBody,
  UpdateUserDocsResponse,
  ListDocumentsResponse,
  AddDocumentsBody,
  AddDocumentsResponse,
} from './types';

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

// ===== LOAN APPLICATION HOOKS =====

export function useLoanApplications(filters?: LoanApplicationFilters, pagination?: PaginationParams) {
  return useClientApiPaginatedQuery<LoanApplication[]>(
    queryKeys.loanApplications.list(filters),
    '/loan-applications',
    pagination?.page || 1,
    pagination?.limit || 10
  );
}

export function useLoanApplication(applicationId: string) {
  return useClientApiQuery<LoanApplication>(
    queryKeys.loanApplications.detail(applicationId),
    `/loan-applications/${applicationId}`
  );
}

export function useUpdateLoanApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<LoanApplication, { id: string; status: string; rejectionReason?: string }>(
    '/loan-applications/status',
    {
      onSuccess: (data, variables) => {
        // Invalidate specific loan application
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.detail(variables.id) });
        // Invalidate loan applications list
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}

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
  
  return useClientApiPost<LoanProduct, any>(
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
  
  return useClientApiPut<LoanProduct, any>(
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

// ===== DASHBOARD HOOKS =====

export function useDashboardOverview() {
  return useClientApiQuery<DashboardOverview>(
    queryKeys.dashboard.overview(),
    '/dashboard/overview'
  );
}

export function useLoanAnalytics() {
  return useClientApiQuery<LoanAnalytics>(
    queryKeys.dashboard.loanAnalytics(),
    '/dashboard/loan-analytics'
  );
}

export function useSMEAnalytics() {
  return useClientApiQuery<SMEAnalytics>(
    queryKeys.dashboard.smeAnalytics(),
    '/dashboard/sme-analytics'
  );
}

// ===== DOCUMENT HOOKS (Your specific use case) =====

/**
 * Hook for updating user documents
 */
export const useUpdateUserDocuments = () => {
  const queryClient = useQueryClient();
  
  return useClientApiPost<UpdateUserDocsResponse, UpdateUserAndDocumentsBody>(
    '/user/update-docs',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.documents() });
      }
    }
  );
};

/**
 * Hook for fetching the user's documents list (GET /documents)
 */
export const useGetDocumentsQuery = () =>
  useClientApiQuery<ListDocumentsResponse>(
    queryKeys.users.documents(),
    '/documents',
    undefined,
    { staleTime: 60_000 }
  );

/**
 * Hook for adding one or multiple documents (POST /documents)
 */
export const useAddDocumentsMutation = () => {
  const queryClient = useQueryClient();
  
  return useClientApiPost<AddDocumentsResponse, AddDocumentsBody>(
    '/documents',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.documents() });
      }
    }
  );
};

// ===== UTILITY HOOKS =====

export function useSearchUsers(searchTerm: string) {
  return useClientApiQuery<User[]>(
    queryKeys.search.users(searchTerm),
    `/users/search?q=${encodeURIComponent(searchTerm)}`
  );
}

export function useSearchLoanApplications(searchTerm: string) {
  return useClientApiQuery<LoanApplication[]>(
    queryKeys.search.loanApplications(searchTerm),
    `/loan-applications/search?q=${encodeURIComponent(searchTerm)}`
  );
}

export function useBulkUpdateLoanApplications() {
  const queryClient = useQueryClient();
  
  return useClientApiPost<
    { success: boolean; updated: number },
    { ids: string[]; status: string }
  >(
    '/loan-applications/bulk-update',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}

export function useExportData() {
  return useClientApiPost<
    { downloadUrl: string },
    { type: string; filters?: Record<string, any> }
  >('/export');
}
