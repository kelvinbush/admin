"use client";

import { FinancialDetailsForm } from "./_components/financial-details-form";

export default function CompanyFinancialsPage() {
  // TODO: Fetch financial data using the ID
  // For now, using placeholder data matching the image
  const initialData = {
    averageMonthlyTurnover: "",
    averageMonthlyTurnoverCurrency: "KES",
    averageYearlyTurnover: "",
    averageYearlyTurnoverCurrency: "KES",
    hasBorrowingHistory: "yes" as const,
    amountBorrowed: "300,000",
    amountBorrowedCurrency: "KES",
    loanStatus: "defaulted" as const,
    defaultReason: "",
  };

  return <FinancialDetailsForm initialData={initialData} />;
}

