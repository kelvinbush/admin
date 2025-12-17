"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Dummy data - will be replaced with API call later
const dummyLoanSummary = {
  loanProduct: "Invoice Discount Facility",
  loanProvider: "MK Green Facility (Ecobank)",
  loanRequested: "9,000.00",
  loanCurrency: "EUR",
  preferredTenure: "7",
  tenureUnit: "months",
  intendedUseOfFunds: "To purchase more solar panels for my business",
  appliedOn: "25-01-2025",
};

export default function LoanSummaryPage() {
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
              value={dummyLoanSummary.loanProduct}
              readOnly
              className="h-10 bg-white border-primaryGrey-200"
            />
          </div>

          {/* Loan Provider/Organization */}
          <div className="space-y-2">
            <Label className="text-primaryGrey-400">Loan provider/organization</Label>
            <Input
              type="text"
              value={dummyLoanSummary.loanProvider}
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
                value={dummyLoanSummary.loanRequested}
                readOnly
                className="h-10 bg-white border-primaryGrey-200 rounded-r-none border-r-0"
              />
              <div className="h-10 px-3 flex items-center justify-center border border-primaryGrey-200 rounded-r-md border-l-0 bg-primaryGrey-50 text-sm text-primaryGrey-600">
                {dummyLoanSummary.loanCurrency}
              </div>
            </div>
          </div>

          {/* Preferred Loan Tenure */}
          <div className="space-y-2">
            <Label className="text-primaryGrey-400">Preferred loan tenure</Label>
            <div className="flex">
              <Input
                type="text"
                value={dummyLoanSummary.preferredTenure}
                readOnly
                className="h-10 bg-white border-primaryGrey-200 rounded-r-none border-r-0"
              />
              <div className="h-10 px-3 flex items-center justify-center border border-primaryGrey-200 rounded-r-md border-l-0 bg-primaryGrey-50 text-sm text-primaryGrey-600">
                {dummyLoanSummary.tenureUnit}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="space-y-2">
          <Label className="text-primaryGrey-400">Intended use of funds</Label>
          <div className="relative">
            <Textarea
              value={dummyLoanSummary.intendedUseOfFunds}
              readOnly
              rows={4}
              className="bg-white border-primaryGrey-200 resize-none pr-16"
            />
            <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
              {dummyLoanSummary.intendedUseOfFunds.length}/100
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-primaryGrey-400">Applied on</Label>
          <Input
            type="text"
            value={dummyLoanSummary.appliedOn}
            readOnly
            className="h-10 bg-white border-primaryGrey-200"
          />
        </div>
      </div>
    </div>
  );
}
