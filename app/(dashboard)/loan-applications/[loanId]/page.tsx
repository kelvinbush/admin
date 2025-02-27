"use client";

import { redirect, useParams, useSearchParams } from "next/navigation";

export default function LoanDetailsRedirectPage() {
  const { loanId } = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  redirect(`/loan-applications/${loanId}/loan?userId=${userId}`);
}
