'use client';

import { useClientApiQuery } from '../hooks';
import { queryKeys } from '../query-keys';
import type {
  DashboardOverview,
  LoanAnalytics,
  SMEAnalytics,
} from '../types';

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
