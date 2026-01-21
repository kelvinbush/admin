"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLoanApplication } from "@/lib/api/hooks/loan-applications";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function LoanSummaryPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const { data: application, isLoading, error } = useLoanApplication(applicationId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-primaryGrey-500">Loading loan application details...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">Error loading loan application details. Please try again.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-midnight-blue">
          Loan application details
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Review the loan application details below to assess and process the request.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loan Product */}
          <div className="space-y-2">
            <Label className="text-primaryGrey-400">Loan product</Label>
            <Input
              type="text"
              value={application.loanProduct?.name || "N/A"}
              readOnly
              className="h-10 bg-white border-primaryGrey-200"
            />
          </div>

          {/* Loan Provider/Organization */}
          <div className="space-y-2">
            <Label className="text-primaryGrey-400">Loan provider/organization</Label>
            <Input
              type="text"
              value={application.organizationName || "N/A"}
              readOnly
              className="h-10 bg-white border-primaryGrey-200"
            />
          </div>

          {/* Loan Requested */}
          <div className="space-y-2">
            <Label className="text-primaryGrey-400">Loan requested</Label>
            <div className="flex">
              <Input
                type="text"
                value={application.fundingAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                readOnly
                className="h-10 bg-white border-primaryGrey-200 rounded-r-none border-r-0"
              />
              <div className="h-10 px-3 flex items-center justify-center border border-primaryGrey-200 rounded-r-md border-l-0 bg-primaryGrey-50 text-sm text-primaryGrey-600">
                {application.fundingCurrency}
              </div>
            </div>
          </div>

          {/* Preferred Loan Tenure */}
          <div className="space-y-2">
            <Label className="text-primaryGrey-400">Preferred loan tenure</Label>
            <div className="flex">
              <Input
                type="text"
                value={application.repaymentPeriod.toString()}
                readOnly
                className="h-10 bg-white border-primaryGrey-200 rounded-r-none border-r-0"
              />
              <div className="h-10 px-3 flex items-center justify-center border border-primaryGrey-200 rounded-r-md border-l-0 bg-primaryGrey-50 text-sm text-primaryGrey-600">
                months
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="space-y-2">
          <Label className="text-primaryGrey-400">Intended use of funds</Label>
          <div className="relative">
            <Textarea
              value={application.intendedUseOfFunds}
              readOnly
              rows={4}
              className="bg-white border-primaryGrey-200 resize-none pr-16"
            />
            <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
              {application.intendedUseOfFunds.length}/100
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-primaryGrey-400">Applied on</Label>
          <Input
            type="text"
            value={formatDate(application.createdAt)}
            readOnly
            className="h-10 bg-white border-primaryGrey-200"
          />
        </div>

        {/* Review Comments */}
        {(application.eligibilityAssessmentComment ||
          application.creditAssessmentComment ||
          application.headOfCreditReviewComment ||
          application.internalApprovalCeoComment) && (
          <div className="space-y-3 pt-4 border-t border-primaryGrey-100">
            <h3 className="text-sm font-medium text-midnight-blue">
              Internal review comments
            </h3>

            {application.eligibilityAssessmentComment && (
              <div className="space-y-1">
                <Label className="text-primaryGrey-400">
                  Eligibility assessment comment
                </Label>
                <Textarea
                  value={application.eligibilityAssessmentComment}
                  readOnly
                  rows={3}
                  className="bg-white border-primaryGrey-200 resize-none"
                />
              </div>
            )}

            {application.creditAssessmentComment && (
              <div className="space-y-1">
                <Label className="text-primaryGrey-400">
                  Credit assessment comment
                </Label>
                <Textarea
                  value={application.creditAssessmentComment}
                  readOnly
                  rows={3}
                  className="bg-white border-primaryGrey-200 resize-none"
                />
              </div>
            )}

            {application.headOfCreditReviewComment && (
              <div className="space-y-1">
                <Label className="text-primaryGrey-400">
                  Head of Credit review comment
                </Label>
                <Textarea
                  value={application.headOfCreditReviewComment}
                  readOnly
                  rows={3}
                  className="bg-white border-primaryGrey-200 resize-none"
                />
              </div>
            )}

            {application.internalApprovalCeoComment && (
              <div className="space-y-1">
                <Label className="text-primaryGrey-400">
                  Internal Approval (CEO) comment
                </Label>
                <Textarea
                  value={application.internalApprovalCeoComment}
                  readOnly
                  rows={3}
                  className="bg-white border-primaryGrey-200 resize-none"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
