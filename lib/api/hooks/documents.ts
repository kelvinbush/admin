'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  UpdateUserAndDocumentsBody,
  UpdateUserDocsResponse,
  ListDocumentsResponse,
  AddDocumentsBody,
  AddDocumentsResponse,
} from '../types';

// ===== DOCUMENT HOOKS =====

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
