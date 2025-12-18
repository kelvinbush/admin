"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LoanApplicationBreadcrumb } from "./_components/loan-application-breadcrumb";
import { LoanApplicationHeader } from "./_components/loan-application-header";
import { LoanApplicationStagesCard } from "./_components/loan-application-stages-card";
import { LoanApplicationTabs } from "./_components/loan-application-tabs";
import { useLoanApplication } from "@/lib/api/hooks/loan-applications";

type LoanApplicationStage =
  | "kyc_kyb_verification"
  | "eligibility_check"
  | "credit_analysis"
  | "head_of_credit_review"
  | "internal_approval_ceo"
  | "committee_decision"
  | "sme_offer_approval"
  | "document_generation"
  | "signing_execution"
  | "awaiting_disbursement"
  | "disbursed";

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
  status: "kyc_kyb_verification" as LoanApplicationStage,
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

  const { data: application, isLoading, error } = useLoanApplication(applicationId);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-primaryGrey-500">Loading loan application...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Error loading loan application. Please try again.</p>
        </div>
      </div>
    );
  }

  // Transform API data to match component expectations
  const applicationData = {
    id: application.id,
    loanId: application.loanId,
    companyName: application.businessName,
    companyLogo: null,
    legalEntityType: "", // TODO: Add to API response
    city: "", // TODO: Add to API response
    country: "", // TODO: Add to API response
    loanSource: application.loanSource,
    loanApplicant: {
      name: application.applicant.name,
      email: application.applicant.email,
      phone: application.applicant.phone,
      avatar: application.applicant.avatar,
    },
    loanProduct: application.loanProduct,
    status: application.status as LoanApplicationStage,
    createdAt: application.createdAt,
    createdBy: application.createdBy,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <LoanApplicationBreadcrumb
        companyName={applicationData.companyName}
      />

      {/* Header with Banner */}
      <LoanApplicationHeader
        application={applicationData}
        onSendToNextStage={handleSendToNextStage}
        onEmailApplicant={handleEmailApplicant}
        onArchive={handleArchive}
      />

      {/* Stages Card */}
      <LoanApplicationStagesCard currentStage={applicationData.status} />

      {/* Main Card - Tabs */}
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50">
        <LoanApplicationTabs applicationId={applicationId} />
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
