"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoanApplicationBreadcrumbProps {
  companyName: string;
}

export function LoanApplicationBreadcrumb({
  companyName,
}: LoanApplicationBreadcrumbProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/loan-applications");
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="h-auto p-0 hover:bg-transparent text-primaryGrey-400 hover:text-midnight-blue"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        All Loan Applications
      </Button>
      
      <div className="h-1 w-1 rounded-full bg-primary-green" />
      
      <span className="text-midnight-blue font-medium">{companyName}</span>
    </div>
  );
}
