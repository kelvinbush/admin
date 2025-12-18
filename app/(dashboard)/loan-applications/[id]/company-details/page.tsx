"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = params.id as string;
  const entrepreneurId = searchParams.get("entrepreneurId");
  const businessId = searchParams.get("businessId");

  // Redirect to default sub-tab
  useEffect(() => {
    const preservedParams = new URLSearchParams();
    if (entrepreneurId) {
      preservedParams.set("entrepreneurId", entrepreneurId);
    }
    if (businessId) {
      preservedParams.set("businessId", businessId);
    }
    
    const query = preservedParams.toString();
    const base = `/loan-applications/${applicationId}/company-details/information`;
    router.replace(query ? `${base}?${query}` : base);
  }, [applicationId, entrepreneurId, businessId, router]);

  return null;
}
