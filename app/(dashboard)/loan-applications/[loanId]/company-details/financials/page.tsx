"use client";
import { Suspense } from "react";
import CompanyFinancials from "@/components/business-profile/company-details/company-financials";
import { useSearchParams } from "next/navigation";

function CompanyFinancialsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyFinancials userId={userId as string} />
    </Suspense>
  );
}

export default CompanyFinancialsPage;
