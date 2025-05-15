"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DocumentAttachments from "@/app/(dashboard)/loan-applications/_components/document-attachments";

function CompanyDocumentsPage() {
  const searchParams = useSearchParams();
  const loanId = searchParams.get("loanId");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentAttachments loanId={loanId as string} />
    </Suspense>
  );
}

export default CompanyDocumentsPage;
