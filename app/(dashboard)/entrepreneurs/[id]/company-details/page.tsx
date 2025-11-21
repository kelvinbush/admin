"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const entrepreneurId = params.id as string;

  // Redirect to default sub-tab
  useEffect(() => {
    router.replace(`/entrepreneurs/${entrepreneurId}/company-details/information`);
  }, [entrepreneurId, router]);

  return null;
}

