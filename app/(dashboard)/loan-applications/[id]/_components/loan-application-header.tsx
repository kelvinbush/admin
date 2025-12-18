"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MoreVertical, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { businessLegalEntityTypeOptions } from "@/lib/constants/business-options";

type LoanApplicationStatus =
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
  | "approved"
  | "rejected"
  | "disbursed"
  | "cancelled";

interface LoanApplicationData {
  id: string;
  loanId: string;
  companyName: string;
  companyLogo?: string | null;
  legalEntityType: string;
  city: string;
  country: string;
  loanSource: string;
  loanApplicant: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  loanProduct: string;
  status: LoanApplicationStatus;
  createdAt: string;
  createdBy: string;
}

interface LoanApplicationHeaderProps {
  application: LoanApplicationData;
  onSendToNextStage?: () => void;
  onEmailApplicant?: () => void;
  onArchive?: () => void;
}

// Get the next stage based on current status
function getNextStage(currentStatus: LoanApplicationStatus): string | null {
  const stageFlow: Record<LoanApplicationStatus, LoanApplicationStatus | null> = {
    kyc_kyb_verification: "eligibility_check",
    eligibility_check: "credit_analysis",
    credit_analysis: "head_of_credit_review",
    head_of_credit_review: "internal_approval_ceo",
    internal_approval_ceo: "committee_decision",
    committee_decision: "sme_offer_approval",
    sme_offer_approval: "document_generation",
    document_generation: "signing_execution",
    signing_execution: "awaiting_disbursement",
    awaiting_disbursement: "disbursed",
    approved: null,
    rejected: null,
    disbursed: null,
    cancelled: null,
  };
  return stageFlow[currentStatus] || null;
}

// Get button text based on current status
function getButtonText(currentStatus: LoanApplicationStatus): string {
  const nextStage = getNextStage(currentStatus);
  if (!nextStage) return "No Next Stage";

  const stageLabels: Record<LoanApplicationStatus, string> = {
    kyc_kyb_verification: "Send for Eligibility Check",
    eligibility_check: "Send for Credit Assessment",
    credit_analysis: "Send for Head of Credit Review",
    head_of_credit_review: "Send for Internal Approval (CEO)",
    internal_approval_ceo: "Send for Committee Decision",
    committee_decision: "Send for SME Offer Approval",
    sme_offer_approval: "Send for Document Generation",
    document_generation: "Send for Signing & Execution",
    signing_execution: "Send for Awaiting Disbursement",
    awaiting_disbursement: "Disburse Loan",
    approved: "No Next Stage",
    rejected: "No Next Stage",
    disbursed: "No Next Stage",
    cancelled: "No Next Stage",
  };

  return stageLabels[currentStatus] || "Send to Next Stage";
}

// Get status badge styling
function getStatusBadge(status: LoanApplicationStatus) {
  switch (status) {
    case "kyc_kyb_verification":
    case "eligibility_check":
    case "credit_analysis":
    case "head_of_credit_review":
    case "internal_approval_ceo":
    case "committee_decision":
    case "sme_offer_approval":
    case "document_generation":
    case "signing_execution":
    case "awaiting_disbursement":
      return {
        label: status === "kyc_kyb_verification"
          ? "KYC-KYB Verification"
          : status === "eligibility_check"
            ? "Eligibility Check"
            : status === "credit_analysis"
              ? "Credit Assessment"
              : status === "head_of_credit_review"
                ? "Head of Credit Review"
                : status === "internal_approval_ceo"
                  ? "Internal Approval (CEO)"
                  : status === "committee_decision"
                    ? "Committee Decision"
                    : status === "sme_offer_approval"
                      ? "SME Offer Approval"
                      : status === "document_generation"
                        ? "Document Generation"
                        : status === "signing_execution"
                          ? "Signing & Execution"
                          : "Awaiting Disbursement",
        className: "border-0",
        style: {
          backgroundColor: "#FFE5B0",
          color: "#8C5E00",
        },
      };
    case "approved":
      return {
        label: "Approved",
        className: "border-0",
        style: {
          backgroundColor: "#B0EFDF",
          color: "#007054",
        },
      };
    case "rejected":
      return {
        label: "Rejected",
        className: "border-0",
        style: {
          backgroundColor: "#E9B7BD",
          color: "#650D17",
        },
      };
    case "disbursed":
      return {
        label: "Disbursed",
        className: "border-0",
        style: {
          backgroundColor: "#E1EFFE",
          color: "#1E429F",
        },
      };
    case "cancelled":
      return {
        label: "Cancelled",
        className: "border-0",
        style: {
          backgroundColor: "#151F28",
          color: "#FFF",
        },
      };
    default:
      return {
        label: status,
        className: "border-0",
        style: {
          backgroundColor: "#E8E9EA",
          color: "#000",
        },
      };
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getFormattedLegalEntityType(value: string): string {
  const option = businessLegalEntityTypeOptions.find((opt) => opt.value === value);
  return option?.label || value;
}

export function LoanApplicationHeader({
  application,
  onSendToNextStage,
  onEmailApplicant,
  onArchive,
}: LoanApplicationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nextStage = getNextStage(application.status);
  const canAdvance = nextStage !== null;
  const buttonText = getButtonText(application.status);
  const statusBadge = getStatusBadge(application.status);

  const getCompanyInitials = () => {
    return application.companyName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  };

  return (
    <div className="relative w-full">
      {/* Dark Header Background with Pattern */}
      <div className="relative bg-gradient-to-br from-[#1A222B] to-[#151F28] rounded-lg overflow-hidden">
        {/* Pattern overlay - subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 20px
            )`,
          }}
        />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Top Section - Company Info and Actions */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-start gap-3">
              {/* Company Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-white overflow-hidden border-3 border-white shadow-lg">
                  {application.companyLogo ? (
                    <img
                      src={application.companyLogo}
                      alt={application.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-primary-green flex flex-col items-center justify-center">
                      <div className="text-white font-bold text-sm">
                        {getCompanyInitials()}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute -bottom-0.5 -right-0.5 w-6 h-6 z-10 rounded-full bg-primary-green flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary-green/90 transition-colors"
                >
                  <Camera className="h-3 w-3 text-white" />
                </button>
              </div>

              {/* Company Details and Actions */}
              <div className="flex-1 flex flex-col gap-2">
                {/* Top Row: Company Name and Action Buttons */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h1 className="text-xl font-medium text-white">
                      {application.companyName}
                    </h1>
                    <p className="text-xs text-[#B6BABC]">
                      {getFormattedLegalEntityType(application.legalEntityType)} • {application.city}, {application.country}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onEmailApplicant}
                      className="bg-white hover:bg-primaryGrey-50 text-midnight-blue border-0 h-9"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      Email Applicant
                    </Button>
                    {canAdvance && (
                      <Button
                        size="sm"
                        onClick={onSendToNextStage}
                        className="h-9 px-4 text-sm text-white border-0"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                        }}
                      >
                        {buttonText}
                      </Button>
                    )}
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white hover:bg-primaryGrey-50 text-midnight-blue border-0 w-9 h-9 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={onArchive}>
                          Archive loan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Progress Line */}
                <div className="h-0.5 bg-primary-green" />
              </div>
            </div>
          </div>

          {/* Bottom Section - Loan Details */}
          <div className="px-6 pb-3">
            <div className="grid grid-cols-7 gap-3 py-2 border-t border-[#B6BABC]">
              <div className="flex flex-col gap-0.5 pr-4 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Loan ID
                </p>
                <p className="text-white text-sm font-medium">
                  {application.loanId}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 px-4 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Loan Source
                </p>
                <p className="text-white text-sm font-medium">
                  {application.loanSource}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 px-4 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Loan Applicant
                </p>
                <p className="text-white text-sm font-medium">
                  {application.loanApplicant.name}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 px-4 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Loan Product
                </p>
                <p className="text-white text-sm font-medium">
                  {application.loanProduct}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 px-4 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Loan status
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "w-fit text-xs font-normal px-2 py-0.5 rounded-md",
                    statusBadge.className,
                  )}
                  style={statusBadge.style}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block mr-1"
                    style={{ backgroundColor: statusBadge.style.color }}
                  />
                  {statusBadge.label}
                </Badge>
              </div>

              <div className="flex flex-col gap-0.5 px-4 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Created At
                </p>
                <p className="text-white text-sm font-medium">
                  {formatDate(application.createdAt)}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 pl-4">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Created By
                </p>
                <p className="text-white text-sm font-medium">
                  {application.createdBy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
