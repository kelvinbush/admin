"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardEmptyIllustration } from "@/app/(dashboard)/_components/dashboard-empty-illustration";

type LoanProductsEmptyStateProps = {
  onAddLoanProduct?: () => void;
};

export function LoanProductsEmptyState({
  onAddLoanProduct,
}: LoanProductsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <DashboardEmptyIllustration className="mb-6" />
      <p className="text-primaryGrey-500 mb-6">
        No loan products have been added yet!
      </p>
      {onAddLoanProduct && (
        <Button
          className="h-11 px-5 border-0 text-white"
          style={{
            background:
              "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
          }}
          onClick={onAddLoanProduct}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Loan Product +
        </Button>
      )}
    </div>
  );
}


