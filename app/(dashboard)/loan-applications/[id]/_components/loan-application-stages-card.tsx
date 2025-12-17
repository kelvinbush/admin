"use client";

import React from "react";
import { cn } from "@/lib/utils";

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

interface LoanApplicationStagesCardProps {
  currentStage: LoanApplicationStage;
}

const stages: Array<{ value: LoanApplicationStage; label: string }> = [
  { value: "kyc_kyb_verification", label: "KYC-KYB Verification" },
  { value: "eligibility_check", label: "Eligibility Check" },
  { value: "credit_analysis", label: "Credit Assessment" },
  { value: "head_of_credit_review", label: "Head of Credit Review" },
  { value: "internal_approval_ceo", label: "Internal Approval (CEO)" },
  { value: "committee_decision", label: "Committee Decision" },
  { value: "sme_offer_approval", label: "SME Offer Approval" },
  { value: "document_generation", label: "Document Generation" },
  { value: "signing_execution", label: "Signing & Execution" },
  { value: "awaiting_disbursement", label: "Awaiting Disbursement" },
  { value: "disbursed", label: "Disbursed" },
];

export function LoanApplicationStagesCard({
  currentStage,
}: LoanApplicationStagesCardProps) {
  const currentStageIndex = stages.findIndex(
    (stage) => stage.value === currentStage,
  );

  return (
    <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: `
        .stages-scroll::-webkit-scrollbar {
          height: 1px !important;
        }
        .stages-scroll::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 1px;
        }
        .stages-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 1px;
        }
        .stages-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}} />
      <div className="flex items-center overflow-x-auto stages-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f5f5f5' }}>
        {stages.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          const isFirst = index === 0;
          const isLast = index === stages.length - 1;
          const arrowSize = 14;

          return (
            <div
              key={stage.value}
              className="flex items-center flex-shrink-0"
              style={{ marginLeft: isFirst ? 0 : `-${arrowSize}px` }}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center px-4 py-2.5 h-10 text-xs font-medium whitespace-nowrap z-10",
                  isActive
                    ? "bg-primary-green text-white"
                    : "bg-white text-primaryGrey-500 border border-primaryGrey-200",
                )}
                style={{
                  clipPath: isFirst
                    ? isLast
                      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                      : `polygon(0 0, calc(100% - ${arrowSize}px) 0, 100% 50%, calc(100% - ${arrowSize}px) 100%, 0 100%)`
                    : isLast
                      ? `polygon(${arrowSize}px 0, 100% 0, 100% 100%, ${arrowSize}px 100%, 0 50%)`
                      : `polygon(${arrowSize}px 0, calc(100% - ${arrowSize}px) 0, 100% 50%, calc(100% - ${arrowSize}px) 100%, ${arrowSize}px 100%, 0 50%)`,
                }}
              >
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
