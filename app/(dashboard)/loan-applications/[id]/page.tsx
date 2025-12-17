"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoanApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = params.id as string;

  useEffect(() => {
    // Preserve query parameters when redirecting
    const preservedParams = new URLSearchParams();
    const entrepreneurId = searchParams.get("entrepreneurId");
    const businessId = searchParams.get("businessId");
    
    if (entrepreneurId) {
      preservedParams.set("entrepreneurId", entrepreneurId);
    }
    if (businessId) {
      preservedParams.set("businessId", businessId);
    }
    
    const queryString = preservedParams.toString();
    const redirectUrl = `/loan-applications/${applicationId}/loan-summary${queryString ? `?${queryString}` : ""}`;
    
    // Redirect to loan-summary as the default tab
    router.replace(redirectUrl);
  }, [applicationId, router, searchParams]);

  return null;
}
