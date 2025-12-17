"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LoanApplicationBreadcrumb } from "./_components/loan-application-breadcrumb";
import { LoanApplicationHeader } from "./_components/loan-application-header";

// Dummy data - will be replaced with API call later
const dummyLoanApplication = {
  id: "1",
  loanId: "LN-65938",
  companyName: "Cesha Investments Ltd",
  companyLogo: null,
  legalEntityType: "Public Limited Company",
  city: "Nairobi",
  country: "Kenya",
  loanSource: "Admin Platform",
  loanApplicant: {
    name: "Robert Mugabe",
    email: "robert.mugabe@cesha.com",
    phone: "+255712345678",
    avatar: undefined,
  },
  loanProduct: "Invoice Discount Facility",
  status: "kyc_kyb_verification" as const,
  createdAt: "2025-01-28",
  createdBy: "Melanie Keita",
};

export default function LoanApplicationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const applicationId = params.id as string;

  // TODO: Replace with actual API call
  // const { data, isLoading, isError } = useLoanApplication(applicationId);

  const handleSendToNextStage = () => {
    // TODO: Implement stage advancement
    console.log("Send to next stage");
  };

  const handleEmailApplicant = () => {
    // TODO: Implement email functionality
    console.log("Email applicant");
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    console.log("Archive loan");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <LoanApplicationBreadcrumb
        companyName={dummyLoanApplication.companyName}
      />

      {/* Header with Banner */}
      <LoanApplicationHeader
        application={dummyLoanApplication}
        onSendToNextStage={handleSendToNextStage}
        onEmailApplicant={handleEmailApplicant}
        onArchive={handleArchive}
      />

      {/* Main Card - Tabs will go here later */}
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
