"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AttachmentsPage() {
  const params = useParams();
  const router = useRouter();
  const entrepreneurId = params.id as string;

  // Redirect to default tab
  useEffect(() => {
    router.replace(`/entrepreneurs/${entrepreneurId}/attachments/entrepreneur-documents`);
  }, [entrepreneurId, router]);

  return null;
}

