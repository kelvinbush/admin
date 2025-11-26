'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSMEOnboardingState } from '@/lib/api/hooks/sme';
import type { SMEOnboardingState } from '@/lib/api/types';

interface SMEOnboardingContextValue {
  userId: string | null;
  onboardingState: SMEOnboardingState | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  setUserId: (userId: string) => void;
  clearUserId: () => void;
  refreshState: () => void;
}

const SMEOnboardingContext = createContext<SMEOnboardingContextValue | undefined>(undefined);

interface SMEOnboardingProviderProps {
  children: React.ReactNode;
}

export function SMEOnboardingProvider({ children }: SMEOnboardingProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserIdState] = useState<string | null>(null);
  
  // Get userId from URL
  const urlUserId = searchParams.get('userId');
  
  // Fetch onboarding state if userId exists
  const {
    data: onboardingState,
    isLoading,
    isError,
    error,
    refetch,
  } = useSMEOnboardingState(urlUserId || '', {
    enabled: !!urlUserId,
  });

  // Sync userId from URL to state
  useEffect(() => {
    if (urlUserId) {
      setUserIdState(urlUserId);
    } else {
      setUserIdState(null);
    }
  }, [urlUserId]);

  // Set userId and update URL
  const setUserId = useCallback((newUserId: string) => {
    setUserIdState(newUserId);
    const currentStep = searchParams.get('step') || '1';
    router.push(`/entrepreneurs/create?userId=${newUserId}&step=${currentStep}`);
  }, [router, searchParams]);

  // Clear userId and reset to step 1
  const clearUserId = useCallback(() => {
    setUserIdState(null);
    router.push('/entrepreneurs/create?step=1');
  }, [router]);

  // Refresh onboarding state
  const refreshState = useCallback(() => {
    if (urlUserId) {
      refetch();
    }
  }, [urlUserId, refetch]);

  const value: SMEOnboardingContextValue = {
    userId: userId,
    onboardingState: onboardingState || null,
    isLoading,
    isError: isError || false,
    error: error as Error | null,
    setUserId,
    clearUserId,
    refreshState,
  };

  return (
    <SMEOnboardingContext.Provider value={value}>
      {children}
    </SMEOnboardingContext.Provider>
  );
}

export function useSMEOnboarding() {
  const context = useContext(SMEOnboardingContext);
  if (context === undefined) {
    throw new Error('useSMEOnboarding must be used within a SMEOnboardingProvider');
  }
  return context;
}

