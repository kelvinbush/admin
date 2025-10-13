"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  FileText,
  Percent,
  Target,
  TrendingUp,
} from "lucide-react";
import type { LoanApplicationItem } from "@/lib/api/types";
import { formatCurrency, formatPurpose } from "@/lib/utils/currency";

interface LoanDetailsProps {
  application: LoanApplicationItem;
}

export function LoanDetails({ application }: LoanDetailsProps) {
  const calculateMonthlyPayment = () => {
    if (!application.loanProduct) return "N/A";

    const principal = application.loanAmount;
    const annualRate = application.loanProduct.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = application.loanTerm;

    if (monthlyRate === 0) {
      return formatCurrency(
        principal / numberOfPayments,
        application.currency || "USD",
      );
    }

    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return formatCurrency(monthlyPayment, application.currency || "USD");
  };

  const calculateTotalRepayment = () => {
    if (!application.loanProduct) return "N/A";

    const monthlyPayment = parseFloat(
      calculateMonthlyPayment().replace(/[^0-9.-]+/g, ""),
    );
    const totalRepayment = monthlyPayment * application.loanTerm;

    return formatCurrency(totalRepayment, application.currency || "USD");
  };

  return (
    <Card className="shadow-none border border-primaryGrey-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-midnight-blue flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Loan Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loan Amount and Terms */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-3">
            Loan Amount & Terms
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-green/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary-green" />
              </div>
              <div>
                <p className="text-xs text-primaryGrey-400">Requested Amount</p>
                <p className="font-semibold text-midnight-blue text-lg">
                  {formatCurrency(
                    application.loanAmount,
                    application.currency || "USD",
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-primaryGrey-400">Loan Term</p>
                <p className="font-semibold text-midnight-blue text-lg">
                  {application.loanTerm}{" "}
                  {application.loanProduct?.termUnit || "months"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Percent className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-primaryGrey-400">Interest Rate</p>
                <p className="font-semibold text-midnight-blue text-lg">
                  {application.loanProduct?.interestRate || "N/A"}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Purpose */}
        <div className="border-t border-primaryGrey-100"></div>
        <div>
          <h4 className="font-medium text-midnight-blue mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Loan Purpose
          </h4>
          <div className="space-y-3">
            <div>
              <Badge
                variant="outline"
                className="border-blue-500 text-blue-500"
              >
                {formatPurpose(application.purpose)}
              </Badge>
            </div>
            {application.purposeDescription && (
              <div className="bg-primaryGrey-50 p-4 rounded-lg">
                <p className="text-sm text-midnight-blue">
                  {application.purposeDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loan Product Information */}
        {application.loanProduct && (
          <>
            <div className="border-t border-primaryGrey-100"></div>
            <div>
              <h4 className="font-medium text-midnight-blue mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Loan Product Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-primaryGrey-400">Product Name</p>
                    <p className="font-medium text-midnight-blue">
                      {application.loanProduct.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-primaryGrey-400">Amount Range</p>
                    <p className="font-medium text-midnight-blue">
                      {formatCurrency(
                        application.loanProduct.minAmount,
                        application.loanProduct.currency || "USD",
                      )}{" "}
                      -{" "}
                      {formatCurrency(
                        application.loanProduct.maxAmount,
                        application.loanProduct.currency || "USD",
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-primaryGrey-400">Term Range</p>
                    <p className="font-medium text-midnight-blue">
                      {application.loanProduct.minTerm} -{" "}
                      {application.loanProduct.maxTerm}{" "}
                      {application.loanProduct.termUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-primaryGrey-400">
                      Interest Rate
                    </p>
                    <p className="font-medium text-midnight-blue">
                      {application.loanProduct.interestRate}% per annum
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Repayment Calculation */}
        <div className="border-t border-primaryGrey-100"></div>
        <div>
          <h4 className="font-medium text-midnight-blue mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Repayment Calculation
          </h4>
          <div className="bg-primaryGrey-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-primaryGrey-400">Monthly Payment</p>
                <p className="font-semibold text-midnight-blue text-lg">
                  {calculateMonthlyPayment()}
                </p>
              </div>
              <div>
                <p className="text-primaryGrey-400">Total Repayment</p>
                <p className="font-semibold text-midnight-blue text-lg">
                  {calculateTotalRepayment()}
                </p>
              </div>
              <div>
                <p className="text-primaryGrey-400">Total Interest</p>
                <p className="font-semibold text-midnight-blue text-lg">
                  {formatCurrency(
                    parseFloat(
                      calculateTotalRepayment().replace(/[^0-9.-]+/g, ""),
                    ) - application.loanAmount,
                    application.currency || "USD",
                  )}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-primaryGrey-200">
              <p className="text-xs text-primaryGrey-400">
                * Calculations are estimates based on the loan product terms.
                Final terms may vary.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Information */}
        <div className="border-t border-primaryGrey-100"></div>
        <div>
          <h4 className="font-medium text-midnight-blue mb-3">
            Compliance & Risk
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-primaryGrey-400">Risk Assessment</p>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500 mt-1"
              >
                Low Risk
              </Badge>
            </div>
            <div>
              <p className="text-primaryGrey-400">Credit Check</p>
              <Badge
                variant="outline"
                className="border-blue-500 text-blue-500 mt-1"
              >
                Completed
              </Badge>
            </div>
            <div>
              <p className="text-primaryGrey-400">KYC Status</p>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500 mt-1"
              >
                Verified
              </Badge>
            </div>
            <div>
              <p className="text-primaryGrey-400">AML Check</p>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500 mt-1"
              >
                Clear
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
