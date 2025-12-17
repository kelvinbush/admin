"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoanApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  useEffect(() => {
    // Redirect to loan-summary as the default tab
    router.replace(`/loan-applications/${applicationId}/loan-summary`);
  }, [applicationId, router]);

  return null;
}
