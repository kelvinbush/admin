"use client";
import { Suspense } from "react";

function CompanyDocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Cleaning this page up... construction 🦺 in progress</div>
      {/*<DocumentAttachments loanId={loanId as string} />*/}
    </Suspense>
  );
}

export default CompanyDocumentsPage;
