"use client";
import { Suspense } from "react";
import DocumentAttachments from "@/app/(dashboard)/loan-applications/_components/document-attachments";
import { useParams } from "next/navigation";

function CompanyDocumentsPage() {
  const { loanId } = useParams();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentAttachments loanId={loanId as string} />
    </Suspense>
  );
}

export default CompanyDocumentsPage;
