"use client";
import { Suspense } from "react";
import CompanyDocuments from "@/components/business-profile/company-documents";

function CompanyDocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyDocuments />
    </Suspense>
  );
}

export default CompanyDocumentsPage;
