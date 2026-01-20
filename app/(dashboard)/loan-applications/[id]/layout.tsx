"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LoanApplicationBreadcrumb } from "./_components/loan-application-breadcrumb";
import { LoanApplicationHeader } from "./_components/loan-application-header";
import { LoanApplicationStagesCard } from "./_components/loan-application-stages-card";
import { LoanApplicationTabs } from "./_components/loan-application-tabs";
import { IncompleteKycKybModal } from "./_components/incomplete-kyc-kyb-modal";
import { NextApproverModal } from "./_components/next-approver-modal";
import { EligibilityCheckModal, type EligibilityCheckFormValues } from "./_components/eligibility-check-modal";
import { RejectLoanModal, type RejectLoanFormValues } from "./_components/reject-loan-modal";
import { CreditAssessmentModal, type CreditAssessmentFormValues } from "./_components/credit-assessment-modal";
import { HeadOfCreditReviewModal, type HeadOfCreditReviewFormValues } from "./_components/head-of-credit-review-modal";
import { InternalApprovalCEOModal, type InternalApprovalCEOFormValues } from "./_components/internal-approval-ceo-modal";
import { SmeOfferApprovalModal, type SmeOfferApprovalFormValues } from "./_components/sme-offer-approval-modal";
import { GenerateRepaymentScheduleModal, type GenerateRepaymentScheduleFormValues } from "./_components/generate-repayment-schedule-modal";
import { ContractualAgreementModal } from "./_components/contractual-agreement-modal";
import { SigningExecutionModal } from "./_components/signing-execution-modal";
import { useCompleteDocumentGeneration } from "@/lib/api/hooks";
import {
  useLoanApplication,
  useUpdateLoanApplicationStatus,
  useSubmitCounterOffer,
  useCompleteEligibilityAssessment,
  useCompleteCreditAssessment,
  useCompleteHeadOfCreditReview,
  useCompleteInternalApprovalCEO,
  useCompleteCommitteeDecision,
  getNextStage,
  type LoanApplicationStatus,
} from "@/lib/api/hooks/loan-applications";
import { useCompleteKycKyb } from "@/lib/api/hooks/kyc-kyb";
import {
  useInternalUsers,
  type InternalUserItem,
} from "@/lib/api/hooks/internal-users";

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

  const {
    data: loanApplication,
    isLoading,
    isError,
  } = useLoanApplication(applicationId);
  const { data: internalUsersData } = useInternalUsers();
  const internalUsers = useMemo(() => {
    return (internalUsersData?.items || []).map((user: InternalUserItem) => {
      const nameParts = user.name?.split(" ") || [];
      return {
        id: user.clerkId || "",
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email,
      };
    });
  }, [internalUsersData]);
  const completeKycKybMutation = useCompleteKycKyb(applicationId);
  const updateStatusMutation = useUpdateLoanApplicationStatus();
  const completeEligibilityAssessmentMutation = useCompleteEligibilityAssessment();
  const completeCreditAssessmentMutation = useCompleteCreditAssessment();
  const completeHeadOfCreditReviewMutation = useCompleteHeadOfCreditReview();
  const completeInternalApprovalCEOMutation = useCompleteInternalApprovalCEO();
  const completeCommitteeDecisionMutation = useCompleteCommitteeDecision();
  const submitCounterOfferMutation = useSubmitCounterOffer();
  const completeDocumentGenerationMutation = useCompleteDocumentGeneration();

  const [incompleteModalOpen, setIncompleteModalOpen] = useState(false);
  const [nextApproverModalOpen, setNextApproverModalOpen] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [creditAssessmentModalOpen, setCreditAssessmentModalOpen] = useState(false);
  const [headOfCreditReviewModalOpen, setHeadOfCreditReviewModalOpen] = useState(false);
  const [internalApprovalCEOModalOpen, setInternalApprovalCEOModalOpen] = useState(false);
  const [smeOfferApprovalModalOpen, setSmeOfferApprovalModalOpen] = useState(false);
  const [generateRepaymentScheduleModalOpen, setGenerateRepaymentScheduleModalOpen] = useState(false);
  const [contractualAgreementModalOpen, setContractualAgreementModalOpen] = useState(false);
  const [signingExecutionModalOpen, setSigningExecutionModalOpen] = useState(false);

  const handleNextStage = () => {
    if (loanApplication?.status === "eligibility_check") {
      setEligibilityModalOpen(true);
    } else if (loanApplication?.status === "credit_analysis") {
      setCreditAssessmentModalOpen(true);
    } else if (loanApplication?.status === "head_of_credit_review") {
      setHeadOfCreditReviewModalOpen(true);
    } else if (loanApplication?.status === "internal_approval_ceo") {
      setInternalApprovalCEOModalOpen(true);
    } else if (loanApplication?.status === "committee_decision") {
      setSmeOfferApprovalModalOpen(true);
    } else if (loanApplication?.status === "sme_offer_approval") {
      setGenerateRepaymentScheduleModalOpen(true);
    } else if (loanApplication?.status === "document_generation") {
      setContractualAgreementModalOpen(true);
    } else if (loanApplication?.status === "signing_execution") {
      setSigningExecutionModalOpen(true);
    } else {
      setNextApproverModalOpen(true);
    }
  };

  const handleSmeOfferApprovalAdvance = async () => {
    if (!loanApplication) return;

    const nextStatus = getNextStage(loanApplication.status);
    if (!nextStatus) {
      toast.error("No next stage available");
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: applicationId,
        data: {
          status: nextStatus,
          reason: `Advanced to ${getStatusLabel(nextStatus)}. Gunning for disbursement.`,
        },
      });
      toast.success("Loan application has been advanced to the next stage.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to advance loan stage.",
      );
    }
  };

  const handleReject = () => {
    setRejectModalOpen(true);
  };

  const handleNextApproverSubmit = async (data: {
    approverId: string;
    approverEmail: string;
  }) => {
    if (!loanApplication) return;

    try {
      if (loanApplication.status === "kyc_kyb_verification") {
        const approver = internalUsers.find((u) => u.id === data.approverId);
        await completeKycKybMutation.mutateAsync({
          nextApprover: {
            nextApproverEmail: data.approverEmail,
            nextApproverName: approver
              ? `${approver.firstName} ${approver.lastName}`
              : "",
          },
        });
      } else {
        const nextStatus = getNextStage(loanApplication.status);
        if (!nextStatus) {
          toast.error("No next stage available");
          return;
        }
        await updateStatusMutation.mutateAsync({
          id: applicationId,
          data: {
            status: nextStatus,
            reason: `Advanced to ${getStatusLabel(nextStatus)} by approver.`,
          },
        });
      }
      toast.success("Loan application has been advanced to the next stage.");
      setNextApproverModalOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.error?.includes("[NO_DOCUMENTS_REVIEWED]")) {
        setNextApproverModalOpen(false);
        setIncompleteModalOpen(true);
      } else {
        toast.error(
          error?.response?.data?.error || "Failed to advance loan stage.",
        );
      }
    }
  };

  // Helper function to get human-readable status label
  const getStatusLabel = (status: LoanApplicationStatus): string => {
    const labels: Record<LoanApplicationStatus, string> = {
      kyc_kyb_verification: "KYC-KYB Verification",
      eligibility_check: "Eligibility Check",
      credit_analysis: "Credit Assessment",
      head_of_credit_review: "Head of Credit Review",
      internal_approval_ceo: "Internal Approval (CEO)",
      committee_decision: "Committee Decision",
      sme_offer_approval: "SME Offer Approval",
      document_generation: "Document Generation",
      signing_execution: "Signing & Execution",
      awaiting_disbursement: "Awaiting Disbursement",
      approved: "Approved",
      rejected: "Rejected",
      disbursed: "Disbursed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
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
  if (isError || !loanApplication) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">
            Error loading loan application. Please try again.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to get full name from user object
  const getFullName = (
    user: { firstName?: string | null; lastName?: string | null } | undefined,
  ) => {
    if (!user) return "";
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "";
  };

  // Transform API data to match component expectations
  const applicationData = {
    id: loanApplication.id,
    loanId: loanApplication.loanId,
    companyName:
      loanApplication.businessName || loanApplication.business?.name || "",
    companyLogo: null, // Logo not available in API response
    legalEntityType: loanApplication.business?.entityType || "",
    city: loanApplication.business?.city || "",
    country: loanApplication.business?.country || "",
    loanSource: loanApplication.loanSource || "",
    loanApplicant: {
      name:
        loanApplication.applicantName ||
        getFullName(loanApplication.entrepreneur) ||
        "N/A",
      email: loanApplication.entrepreneur?.email || "",
      phone: loanApplication.entrepreneur?.phoneNumber || "",
      avatar: loanApplication.entrepreneur?.imageUrl || undefined,
    },
    loanProduct: loanApplication.loanProduct?.name || "",
    status: loanApplication.status as LoanApplicationStage,
    createdAt: loanApplication.createdAt || "",
    createdBy:
      loanApplication.creatorName ||
      getFullName(loanApplication.creator) ||
      loanApplication.createdBy ||
      "",
  };

  return (
    <div className="space-y-6">
      <LoanApplicationBreadcrumb companyName={applicationData.companyName} />
      <LoanApplicationHeader
        application={applicationData}
        onSendToNextStage={handleNextStage}
        onReject={handleReject}
        isUpdatingStatus={
          isLoading ||
          completeKycKybMutation.isPending ||
          updateStatusMutation.isPending
        }
      />
      <LoanApplicationStagesCard currentStage={applicationData.status} />
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50">
        <LoanApplicationTabs applicationId={applicationId} />
        <div className="p-8">{children}</div>
      </div>

      <IncompleteKycKybModal
        open={incompleteModalOpen}
        onOpenChange={setIncompleteModalOpen}
      />

      <EligibilityCheckModal
        open={eligibilityModalOpen}
        onOpenChange={setEligibilityModalOpen}
        onSubmit={async (data: EligibilityCheckFormValues) => {
          try {
            const approver = internalUsers.find((u) => u.id === data.nextApproverId);
            await completeEligibilityAssessmentMutation.mutateAsync({
              id: applicationId,
              data: {
                comment: data.assessmentComment,
                supportingDocuments: data.supportingDocument ? [data.supportingDocument] : undefined,
                nextApprover: {
                  nextApproverEmail: approver?.email || "",
                  nextApproverName: approver ? `${approver.firstName} ${approver.lastName}` : "",
                },
              },
            });
            toast.success("Eligibility check submitted successfully.");
            setEligibilityModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to submit eligibility check.");
          }
        }}
        users={internalUsers.map((u) => ({
          clerkId: u.id,
          name: `${u.firstName} ${u.lastName}`,
        }))}
        isLoading={completeEligibilityAssessmentMutation.isPending}
      />

      <RejectLoanModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        onSubmit={async (data: RejectLoanFormValues) => {
          try {
            await updateStatusMutation.mutateAsync({
              id: applicationId,
              data: {
                status: "rejected",
                rejectionReason: data.reason,
              },
            });
            toast.success("Loan has been rejected.");
            setRejectModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to reject loan.");
          }
        }}
        isLoading={updateStatusMutation.isPending}
      />

      <CreditAssessmentModal
        open={creditAssessmentModalOpen}
        onOpenChange={setCreditAssessmentModalOpen}
        onSubmit={async (data: CreditAssessmentFormValues) => {
          try {
            const approver = internalUsers.find((u) => u.id === data.nextApproverId);
            const supportingDocuments = [
              data.supportingDocuments,
              data.creditMemo,
              data.offTakerAgreement,
              data.parentGuaranteeAgreement,
            ].filter(Boolean) as { docUrl: string; docName: string }[];

            await completeCreditAssessmentMutation.mutateAsync({
              id: applicationId,
              data: {
                comment: data.assessmentComment || "",
                supportingDocuments,
                nextApprover: {
                  nextApproverEmail: approver?.email || "",
                  nextApproverName: approver ? `${approver.firstName} ${approver.lastName}` : "",
                },
              },
            });
            toast.success("Credit assessment submitted successfully.");
            setCreditAssessmentModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to submit credit assessment.");
          }
        }}
        users={internalUsers.map((u) => ({
          clerkId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
        }))}
        isLoading={completeCreditAssessmentMutation.isPending}
      />

      <HeadOfCreditReviewModal
        open={headOfCreditReviewModalOpen}
        onOpenChange={setHeadOfCreditReviewModalOpen}
        onSubmit={async (data: HeadOfCreditReviewFormValues) => {
          try {
            const ceo = internalUsers.find((u) => u.id === data.ceoId);
            if (!ceo) {
              toast.error("Selected CEO not found.");
              return;
            }

            await completeHeadOfCreditReviewMutation.mutateAsync({
              id: applicationId,
              data: {
                comment: data.assessmentComment,
                supportingDocuments: [data.supportingDocument],
                nextApprover: {
                  nextApproverEmail: ceo.email,
                  nextApproverName: `${ceo.firstName} ${ceo.lastName}`,
                },
              },
            });

            toast.success("Head of Credit review submitted successfully.");
            setHeadOfCreditReviewModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to submit for CEO approval.");
          }
        }}
        users={internalUsers.map((u) => ({
          clerkId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
        }))}
        isLoading={completeHeadOfCreditReviewMutation.isPending}
      />

      <InternalApprovalCEOModal
        open={internalApprovalCEOModalOpen}
        onOpenChange={setInternalApprovalCEOModalOpen}
        onSubmit={async (data: InternalApprovalCEOFormValues) => {
          try {
            const approver = internalUsers.find((u) => u.id === data.nextApproverId);
            if (!approver) {
              toast.error("Selected approver not found.");
              return;
            }

            await completeInternalApprovalCEOMutation.mutateAsync({
              id: applicationId,
              data: {
                comment: data.assessmentComment,
                supportingDocuments: [data.supportingDocuments],
                nextApprover: {
                  nextApproverEmail: approver.email,
                  nextApproverName: `${approver.firstName} ${approver.lastName}`,
                },
              },
            });

            toast.success("CEO approval request submitted successfully.");
            setInternalApprovalCEOModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to submit for committee decision.");
          }
        }}
        users={internalUsers.map((u) => ({
          clerkId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
        }))}
        isLoading={completeInternalApprovalCEOMutation.isPending}
      />

      <SmeOfferApprovalModal
        open={smeOfferApprovalModalOpen}
        onOpenChange={setSmeOfferApprovalModalOpen}
        onSubmit={async (data: SmeOfferApprovalFormValues) => {
          try {
            await completeCommitteeDecisionMutation.mutateAsync({
              id: applicationId,
              data: {
                termSheetUrl: data.termSheet.docUrl,
              },
            });
            toast.success("Term sheet sent for SME approval successfully.");
            setSmeOfferApprovalModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to send term sheet.");
          }
        }}
        applicantName={applicationData.loanApplicant.name}
        applicantEmail={applicationData.loanApplicant.email}
        isLoading={completeCommitteeDecisionMutation.isPending}
      />

      <GenerateRepaymentScheduleModal
        open={generateRepaymentScheduleModalOpen}
        onOpenChange={setGenerateRepaymentScheduleModalOpen}
        onSubmit={async (data: GenerateRepaymentScheduleFormValues, fees) => {
          try {
            // Transform form data to API payload
            const repaymentCycleMap: Record<string, "daily" | "weekly" | "bi_weekly" | "monthly" | "quarterly"> = {
              every_30_days: "monthly",
              every_45_days: "monthly", // Fallback to monthly
              every_60_days: "bi_weekly", // Approximate
              every_90_days: "quarterly",
            };

            const repaymentStructureMap: Record<string, "principal_and_interest" | "bullet_repayment"> = {
              principal_interest_amortized: "principal_and_interest",
              bullet_repayment: "bullet_repayment",
            };

            const returnTypeMap: Record<string, "interest_based" | "revenue_sharing"> = {
              interest_based: "interest_based",
              revenue_share: "revenue_sharing",
            };

            // Transform custom fees
            const customFees = fees.map((fee) => ({
              name: fee.name,
              amount: parseFloat(fee.rate),
              type: fee.calculationMethod as "flat" | "percentage",
            }));

            // Calculate grace period in days
            let gracePeriodInDays: number | undefined;
            if (data.gracePeriod) {
              const gracePeriodValue = parseInt(data.gracePeriod);
              if (data.gracePeriodUnit === "months") {
                gracePeriodInDays = gracePeriodValue * 30; // Approximate
              } else {
                gracePeriodInDays = gracePeriodValue;
              }
            }

            await submitCounterOfferMutation.mutateAsync({
              id: applicationId,
              data: {
                fundingAmount: parseFloat(data.approvedLoanAmount),
                repaymentPeriod: parseInt(data.approvedLoanTenure),
                returnType: returnTypeMap[data.returnType] || "interest_based",
                interestRate: parseFloat(data.interestRate),
                repaymentStructure: repaymentStructureMap[data.repaymentStructure] || "principal_and_interest",
                repaymentCycle: repaymentCycleMap[data.repaymentCycle] || "monthly",
                gracePeriod: gracePeriodInDays,
                firstPaymentDate: data.firstPaymentDate,
                customFees: customFees.length > 0 ? customFees : undefined,
              },
            });
            
            toast.success("Counter offer submitted successfully.");
            setGenerateRepaymentScheduleModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to submit counter offer.");
          }
        }}
        isLoading={submitCounterOfferMutation.isPending}
        loanApplicationData={
          loanApplication
            ? {
                fundingAmount: loanApplication.activeVersion?.fundingAmount ?? loanApplication.fundingAmount,
                fundingCurrency: loanApplication.fundingCurrency,
                repaymentPeriod: loanApplication.activeVersion?.repaymentPeriod ?? loanApplication.repaymentPeriod,
                interestRate: loanApplication.activeVersion?.interestRate ?? loanApplication.interestRate,
                returnType: loanApplication.activeVersion?.returnType,
                repaymentStructure: loanApplication.activeVersion?.repaymentStructure,
                repaymentCycle: loanApplication.activeVersion?.repaymentCycle,
                gracePeriod: loanApplication.activeVersion?.gracePeriod,
                firstPaymentDate: loanApplication.activeVersion?.firstPaymentDate,
                customFees: loanApplication.activeVersion?.customFees,
              }
            : undefined
        }
        loanProductId={loanApplication?.loanProductId}
      />

      <ContractualAgreementModal
        open={contractualAgreementModalOpen}
        onOpenChange={setContractualAgreementModalOpen}
        onSubmit={async (file: { docUrl: string; docName: string }) => {
          try {
            await completeDocumentGenerationMutation.mutateAsync({
              id: applicationId,
              data: {
                contractUrl: file.docUrl,
                docName: file.docName,
                notes: "Contractual agreement uploaded",
              },
            });

            toast.success("Contractual agreement uploaded successfully.");
            setContractualAgreementModalOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to upload contractual agreement.");
          }
        }}
        isLoading={completeDocumentGenerationMutation.isPending}
      />

      <SigningExecutionModal
        open={signingExecutionModalOpen}
        onOpenChange={setSigningExecutionModalOpen}
        onSubmit={async () => {
          toast.success("Signing execution details saved.");
          setSigningExecutionModalOpen(false);
        }}
        isLoading={false}
      />

      <NextApproverModal
        open={nextApproverModalOpen}
        onOpenChange={setNextApproverModalOpen}
        onSubmit={handleNextApproverSubmit}
        users={internalUsers}
        isLoading={
          completeKycKybMutation.isPending || updateStatusMutation.isPending
        }
      />
    </div>
  );
}
