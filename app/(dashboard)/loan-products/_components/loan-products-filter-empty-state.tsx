"use client";

import { DashboardEmptyIllustration } from "@/app/(dashboard)/_components/dashboard-empty-illustration";

type LoanProductsFilterEmptyStateProps = {
  message?: string;
};

export function LoanProductsFilterEmptyState({
  message = "No loan products match your current search or selected filters. Try adjusting them or clearing all filters.",
}: LoanProductsFilterEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <DashboardEmptyIllustration className="mb-6" />
      <p className="text-primaryGrey-500 mb-2 text-center max-w-md">
        {message}
      </p>
    </div>
  );
}

