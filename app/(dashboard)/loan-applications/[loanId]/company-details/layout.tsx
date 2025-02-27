"use client";

import React, { Suspense } from "react";
import CompanyDetails from "@/components/business-profile/company-details";
import { useParams, useSearchParams } from "next/navigation";

export default function CompanyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loanId } = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyDetails userId={userId as string} loanId={loanId as string}>
        {children}
      </CompanyDetails>
    </Suspense>
  );
}
