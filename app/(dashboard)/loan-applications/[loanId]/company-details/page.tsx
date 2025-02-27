"use client";

import { redirect, useParams, useSearchParams } from "next/navigation";

export default function CompanyDetailsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { loanId } = useParams();

  redirect(
    `/loan-applications/${loanId}/company-details/information?userId=${userId}`,
  );
}
