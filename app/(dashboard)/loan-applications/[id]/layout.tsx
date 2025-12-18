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

  // Helper function to get full name from user object
  const getFullName = (user: { firstName?: string | null; lastName?: string | null } | undefined) => {
    if (!user) return "";
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "";
  };

  // Transform API data to match component expectations
  const applicationData = {
    id: application.id,
    loanId: application.loanId,
    companyName: application.businessName || application.business?.name || "",
    companyLogo: null, // Logo not available in API response
    legalEntityType: application.business?.entityType || "",
    city: application.business?.city || "",
    country: application.business?.country || "",
    loanSource: application.loanSource || "",
    loanApplicant: {
      name: application.applicantName || getFullName(application.entrepreneur) || "N/A",
      email: application.entrepreneur?.email || "",
      phone: application.entrepreneur?.phoneNumber || "",
      avatar: application.entrepreneur?.imageUrl || undefined,
    },
    loanProduct: application.loanProduct?.name || "",
    status: application.status as LoanApplicationStage,
    createdAt: application.createdAt || "",
    createdBy: application.creatorName || getFullName(application.creator) || application.createdBy || "",
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
