"use client";

import React from "react";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  PenTool,
  XCircle,
} from "lucide-react";
import type {
  LoanApplicationItem,
  LoanApplicationStatus,
} from "@/lib/api/types";
import { useLoanApplicationStatusHistory } from "@/lib/api/hooks/loan-applications";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusTimelineProps {
  application: LoanApplicationItem;
}

interface TimelineStep {
  status: LoanApplicationStatus;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

export function StatusTimeline({ application }: StatusTimelineProps) {
  const {
    data: statusHistory = [],
    isLoading,
    error,
  } = useLoanApplicationStatusHistory(application.id);

  const timelineSteps: TimelineStep[] = [
    {
      status: "draft",
      label: "Draft",
      icon: PenTool,
      description: "Application being prepared",
    },
    {
      status: "submitted",
      label: "Submitted",
      icon: FileText,
      description: "Application submitted for review",
    },
    {
      status: "under_review",
      label: "Under Review",
      icon: Eye,
      description: "Application being reviewed by loan officer",
    },
    {
      status: "approved",
      label: "Approved",
      icon: CheckCircle,
      description: "Application approved for loan",
    },
    {
      status: "offer_letter_sent",
      label: "Offer Letter Sent",
      icon: Mail,
      description: "Loan offer sent to applicant",
    },
    {
      status: "offer_letter_signed",
      label: "Offer Letter Signed",
      icon: CheckCircle,
      description: "Applicant signed the loan offer",
    },
    {
      status: "disbursed",
      label: "Disbursed",
      icon: Banknote,
      description: "Loan funds disbursed to applicant",
    },
    {
      status: "rejected",
      label: "Rejected",
      icon: XCircle,
      description: "Application rejected",
    },
    {
      status: "offer_letter_declined",
      label: "Offer Declined",
      icon: XCircle,
      description: "Applicant declined the loan offer",
    },
    {
      status: "withdrawn",
      label: "Withdrawn",
      icon: ArrowLeft,
      description: "Application withdrawn",
    },
  ];

  const getStatusColor = (
    status: LoanApplicationStatus,
    isActive: boolean,
    isCompleted: boolean,
  ) => {
    if (
      status === "rejected" ||
      status === "offer_letter_declined" ||
      status === "withdrawn"
    ) {
      return isActive
        ? "text-red-600 bg-red-100 border-red-200"
        : "text-red-400 bg-red-50 border-red-100";
    }

    if (status === "disbursed") {
      return isActive
        ? "text-green-600 bg-green-100 border-green-200"
        : "text-green-400 bg-green-50 border-green-100";
    }

    if (isCompleted) {
      return "text-green-600 bg-green-100 border-green-200";
    }

    if (isActive) {
      return "text-blue-600 bg-blue-100 border-blue-200";
    }

    return "text-gray-400 bg-gray-50 border-gray-200";
  };

  const getStepDate = (status: LoanApplicationStatus) => {
    if (!statusHistory || statusHistory.length === 0) return null;

    const historyItem = statusHistory.find(
      (item: any) => item.status === status,
    );
    return historyItem ? new Date(historyItem.createdAt) : null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex(
      (step) => step.status === application.status,
    );
  };

  const currentStepIndex = getCurrentStepIndex();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Application Progress
          </h2>
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Application Progress
          </h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">
                Failed to load status history
              </p>
              <p className="text-gray-500 text-sm">
                Please try refreshing the page
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-8 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Application Progress
        </h2>

        <div className="space-y-6">
          {timelineSteps.map((step, index) => {
            const isActive = step.status === application.status;
            const isCompleted =
              index < currentStepIndex ||
              (step.status === application.status &&
                ["approved", "offer_letter_signed", "disbursed"].includes(
                  application.status,
                ));
            const isRejected =
              ["rejected", "offer_letter_declined", "withdrawn"].includes(
                step.status,
              ) && step.status === application.status;
            const stepDate = getStepDate(step.status);
            const Icon = step.icon;

            // Only show relevant steps based on current status
            const shouldShow = () => {
              // Always show main flow steps
              if (
                [
                  "draft",
                  "submitted",
                  "under_review",
                  "approved",
                  "offer_letter_sent",
                  "offer_letter_signed",
                  "disbursed",
                ].includes(step.status)
              ) {
                return true;
              }

              // Show rejection/decline/withdrawal only if it's the current status
              if (
                ["rejected", "offer_letter_declined", "withdrawn"].includes(
                  step.status,
                )
              ) {
                return step.status === application.status;
              }

              return false;
            };

            if (!shouldShow()) {
              return null;
            }

            return (
              <div key={step.status} className="flex items-start gap-4">
                {/* Step Icon */}
                <div
                  className={`
                  flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center
                  ${getStatusColor(step.status, isActive, isCompleted)}
                  ${isActive ? "ring-4 ring-blue-100" : ""}
                  ${isRejected ? "ring-4 ring-red-100" : ""}
                `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`
                      text-base font-semibold
                      ${isActive || isCompleted || isRejected ? "text-gray-900" : "text-gray-500"}
                    `}
                    >
                      {step.label}
                    </h3>
                    {stepDate && (
                      <span className="text-sm text-gray-500 font-medium">
                        {formatDate(stepDate)}
                      </span>
                    )}
                  </div>

                  <p
                    className={`
                    text-sm
                    ${isActive || isCompleted || isRejected ? "text-gray-600" : "text-gray-400"}
                  `}
                  >
                    {step.description}
                  </p>

                  {/* Show additional details from status history */}
                  {statusHistory &&
                    statusHistory.length > 0 &&
                    statusHistory
                      .filter((item: any) => item.status === step.status)
                      .map((item: any, historyIndex: number) => (
                        <div
                          key={historyIndex}
                          className="mt-2 text-xs text-gray-500"
                        >
                          {item.reason && (
                            <p>
                              <span className="font-medium">Reason:</span>{" "}
                              {item.reason}
                            </p>
                          )}
                          {item.updatedBy && (
                            <p>
                              <span className="font-medium">By:</span>{" "}
                              {item.updatedBy}
                            </p>
                          )}
                        </div>
                      ))}

                  {/* Active step indicator */}
                  {isActive && (
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">
                        Current Status
                      </span>
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {index < timelineSteps.length - 1 &&
                  step.status !== "rejected" && (
                    <div
                      className={`
                    absolute left-6 mt-12 w-0.5 h-6
                    ${isCompleted ? "bg-green-300" : "bg-gray-200"}
                  `}
                      style={{ marginLeft: "1.5rem" }}
                    />
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
