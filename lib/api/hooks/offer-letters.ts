'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useClientApiQuery, useClientApiPost, useClientApiPatch, useClientApiMutation } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  OfferLetterItem,
  ListOfferLettersResponse,
  OfferLetterFilters,
  CreateOfferLetterData,
  SendOfferLetterData,
  SendOfferLetterResponse,
  UpdateOfferLetterData,
} from '../types';

// ===== OFFER LETTER HOOKS =====

export function useOfferLetters(filters?: OfferLetterFilters) {
  return useClientApiQuery<ListOfferLettersResponse>(
    queryKeys.offerLetters.list(filters || {}),
    '/offer-letters',
    {
      params: filters,
    },
    {
      enabled: true,
    }
  );
}

export function useOfferLetter(offerLetterId: string) {
  return useClientApiQuery<OfferLetterItem>(
    queryKeys.offerLetters.detail(offerLetterId),
    `/offer-letters/${offerLetterId}`,
    undefined,
    {
      enabled: !!offerLetterId,
    }
  );
}

export function useCreateOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiPost<OfferLetterItem, CreateOfferLetterData>(
    '/offer-letters',
    {
      onSuccess: (data: OfferLetterItem) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.lists() });
        // Also invalidate loan application data since it includes offer letters
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.detail(data.loanApplicationId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}

export function useSendOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<SendOfferLetterResponse, { id: string; data: SendOfferLetterData }>(
    (api: any, variables: { id: string; data: SendOfferLetterData }) => 
      api.post(`/offer-letters/${variables.id}/send`, variables.data),
    {
      onSuccess: (data: SendOfferLetterResponse, variables: { id: string; data: SendOfferLetterData }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.detail(variables.id) });
        // Invalidate loan application data as status may have changed
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}

export function useUpdateOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<OfferLetterItem, { id: string; data: UpdateOfferLetterData }>(
    (api: any, variables: { id: string; data: UpdateOfferLetterData }) => 
      api.patch(`/offer-letters/${variables.id}`, variables.data),
    {
      onSuccess: (data: OfferLetterItem, variables: { id: string; data: UpdateOfferLetterData }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.detail(variables.id) });
        // Also invalidate loan application data
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.detail(data.loanApplicationId) });
      }
    }
  );
}

export function useVoidOfferLetter() {
  const queryClient = useQueryClient();

  return useClientApiMutation<OfferLetterItem, { id: string }>(
    (api: any, variables: { id: string }) => 
      api.patch(`/offer-letters/${variables.id}/void`),
    {
      onSuccess: (data: OfferLetterItem, variables: { id: string }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.offerLetters.detail(variables.id) });
        // Also invalidate loan application data
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.detail(data.loanApplicationId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.loanApplications.lists() });
      }
    }
  );
}

// ===== OFFER LETTERS BY LOAN APPLICATION =====

export function useOfferLettersByApplication(loanApplicationId: string) {
  return useOfferLetters({ loanApplicationId });
}
