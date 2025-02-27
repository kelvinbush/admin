"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useGetLoanApplicationQuery } from "@/lib/redux/services/user";
import { LoanApplication } from "@/lib/types/user";

const LoanDetailsPage = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const [loanApplication, setLoanApplication] =
    useState<LoanApplication | null>(null);

  const { data: loanApplicationData, isLoading } = useGetLoanApplicationQuery({
    guid: loanId as string,
  });

  useEffect(() => {
    if (loanApplicationData && !isLoading) {
      // Check if the API response has a data property or is the direct loan application
      if (loanApplicationData) {
        setLoanApplication(loanApplicationData);
      } else {
        setLoanApplication(loanApplicationData);
      }
    }
  }, [loanApplicationData, isLoading]);

  if (isLoading || !loanApplication) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const getLoanStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      case 3:
        return "Disbursed";
      default:
        return "Pending";
    }
  };

  const getLoanStatusColor = (status: number): string => {
    switch (status) {
      case 1:
        return "bg-[#B0EFDF] text-[#007054]";
      case 2:
        return "bg-[#FECACA] text-[#B91C1C]";
      case 3:
        return "bg-[#DBEAFE] text-[#1E40AF]";
      default:
        return "bg-[#B1EFFE] text-[#1E429F]";
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>
              Loan Application - {loanApplication.loanProductName}
            </CardTitle>
            <CardDescription>
              Loan application ID: {loanApplication.loanApplicationGuid}
            </CardDescription>
          </div>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLoanStatusColor(loanApplication.loanStatus)}`}
          >
            {getLoanStatusText(loanApplication.loanStatus)}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Loan Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {loanApplication.defaultCurrency}{" "}
              {loanApplication.loanAmount.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              Repayment Period
            </p>
            <p className="text-lg font-medium text-gray-900">
              {loanApplication.repaymentPeriod}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Interest Rate</p>
            <p className="text-lg font-medium text-gray-900">
              {loanApplication.interestRate}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              Ecobank Subscription
            </p>
            <p className="text-lg font-medium text-gray-900">
              {loanApplication.ecobankSubscription ? "Yes" : "No"}
            </p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
            <p className="text-sm text-gray-900">
              {loanApplication.loanPurpose}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanDetailsPage;
