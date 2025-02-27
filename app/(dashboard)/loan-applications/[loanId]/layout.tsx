"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import LoanProfile from "@/components/loan/loan-layout";

const LoanProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { loanId } = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanProfile personalGuid={userId as string} loanId={loanId as string}>
        {children}
      </LoanProfile>
    </Suspense>
  );
};

export default LoanProfileLayout;
