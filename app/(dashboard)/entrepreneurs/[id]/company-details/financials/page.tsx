"use client";

import { useParams } from "next/navigation";
import { FinancialDetailsForm } from "./_components/financial-details-form";
import { useSMEUser } from "@/lib/api/hooks/sme";

export default function CompanyFinancialsPage() {
  const params = useParams();
  const entrepreneurId = params.id as string;

  const { data, isLoading, isError } = useSMEUser(entrepreneurId);

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading financial details...
      </div>
    );
  }

  if (isError || !data || !data.business) {
    return (
      <div className="text-sm text-red-500">
        Failed to load financial details.
      </div>
    );
  }

  const business = data.business;

  const hasBorrowingHistory: "yes" | "no" | undefined =
    business.previousLoans === null
      ? undefined
      : business.previousLoans
      ? "yes"
      : "no";

  const formatNumber = (value: number | null): string =>
    typeof value === "number" ? value.toLocaleString() : "";

  const initialData = {
    averageMonthlyTurnover: formatNumber(business.averageMonthlyTurnover),
    averageMonthlyTurnoverCurrency: business.defaultCurrency || "KES",
    averageYearlyTurnover: formatNumber(business.averageYearlyTurnover),
    averageYearlyTurnoverCurrency: business.defaultCurrency || "KES",
    hasBorrowingHistory,
    amountBorrowed: formatNumber(business.loanAmount),
    amountBorrowedCurrency: business.defaultCurrency || "KES",
    loanStatus: (business.recentLoanStatus as any) || undefined,
    defaultReason: business.defaultReason || "",
  };

  return (
    <FinancialDetailsForm
      userId={entrepreneurId}
      initialData={initialData}
    />
  );
}

