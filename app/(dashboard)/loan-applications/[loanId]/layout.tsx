"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const LoanDetailsLayout = ({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: { loanId: string }
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const businessId = searchParams.get("businessId");
  
  // Create query string to pass to all tabs
  const queryString = `?userId=${userId}&businessId=${businessId}`;
  
  const isLoanRoute = pathname === `/loan-applications/${params.loanId}` || 
                       pathname === `/loan-applications/${params.loanId}/loan`;
  const isBusinessRoute = pathname.includes('/business-details');
  const isApplicantRoute = pathname.includes('/applicant-details');

  return (
    <Suspense fallback={<div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
    </div>}>
      <div className="p-4 space-y-6">
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Tabs">
            <Link
              href={`/loan-applications/${params.loanId}/loan${queryString}`}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                isLoanRoute 
                  ? "border-teal-500 text-teal-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Loan Details
            </Link>
            <Link
              href={`/loan-applications/${params.loanId}/business-details${queryString}`}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                isBusinessRoute
                  ? "border-teal-500 text-teal-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Business Details
            </Link>
            <Link
              href={`/loan-applications/${params.loanId}/applicant-details${queryString}`}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                isApplicantRoute
                  ? "border-teal-500 text-teal-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Applicant Details
            </Link>
          </nav>
        </div>
        <div>{children}</div>
      </div>
    </Suspense>
  );
};

export default LoanDetailsLayout;
