"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AttachmentsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = params.id as string;
  const entrepreneurId = searchParams.get("entrepreneurId");

  // Redirect to default tab
  useEffect(() => {
    const preservedParams = new URLSearchParams();
    if (entrepreneurId) {
      preservedParams.set("entrepreneurId", entrepreneurId);
    }
    const businessId = searchParams.get("businessId");
    if (businessId) {
      preservedParams.set("businessId", businessId);
    }
    
    const query = preservedParams.toString();
    const base = `/loan-applications/${applicationId}/attachments/entrepreneur-documents`;
    router.replace(query ? `${base}?${query}` : base);
  }, [applicationId, entrepreneurId, router, searchParams]);

  return null;
}
