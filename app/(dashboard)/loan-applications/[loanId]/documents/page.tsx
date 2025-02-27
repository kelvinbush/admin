"use client";
import { Suspense } from "react";
import CompanyDocuments from "@/components/business-profile/company-documents";
import { useSearchParams } from "next/navigation";

function CompanyDocumentsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyDocuments userId={userId as string} />
    </Suspense>
  );
}

export default CompanyDocumentsPage;
