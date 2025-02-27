"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Import mock data - this would be replaced with an API call in production
import { mockLoanApplications } from "../../mockData";
import { LoanApplication } from "@/lib/types/user";

// Type definitions

const LoanDetailsPage = () => {
  const params = useParams();
  const loanId = params.loanId as string;
  const [loanApplication, setLoanApplication] =
    useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we're using mock data
    const loan = mockLoanApplications.find(
      (loan) => loan.loanApplicationGuid === loanId,
    );

    if (loan) {
      setLoanApplication(loan);
    }

    setLoading(false);
  }, [loanId]);

  // Helper function to get status text and color
  const getLoanStatusDetails = (status: number) => {
    switch (status) {
      case 0:
        return {
          text: "Pending",
          bgColor: "bg-[#B1EFFE]",
          textColor: "text-[#1E429F]",
        };
      case 1:
        return {
          text: "Approved",
          bgColor: "bg-[#B0EFDF]",
          textColor: "text-[#007054]",
        };
      case 2:
        return {
          text: "Rejected",
          bgColor: "bg-[#FECACA]",
          textColor: "text-[#B91C1C]",
        };
      case 3:
        return {
          text: "Disbursed",
          bgColor: "bg-[#DBEAFE]",
          textColor: "text-[#1E40AF]",
        };
      default:
        return {
          text: "Unknown",
          bgColor: "bg-gray-200",
          textColor: "text-gray-700",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!loanApplication) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Loan Not Found</h2>
        <p className="mt-2 text-gray-500">
          The loan application you&apos;re looking for doesn&apos;t exist or has
          been removed.
        </p>
      </div>
    );
  }

  const statusDetails = getLoanStatusDetails(loanApplication.loanStatus);

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Loan Application Details
          </h1>
          <p className="text-gray-500">
            Review the loan details below to assess and process the request.
          </p>
        </div>
        <Badge
          className={`px-3 py-1.5 text-sm font-medium ${statusDetails.bgColor} ${statusDetails.textColor}`}
        >
          {statusDetails.text}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
          <CardDescription>
            General information about the loan request
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Loan Reference ID
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {loanApplication.loanApplicationGuid}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Loan Product</p>
            <p className="mt-1 text-sm text-gray-900">
              {loanApplication.loanProductName}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Loan Amount</p>
            <p className="mt-1 text-sm text-gray-900 font-semibold">
              {loanApplication.defaultCurrency}{" "}
              {loanApplication.loanAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Repayment Period
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {loanApplication.repaymentPeriod}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Interest Rate</p>
            <p className="mt-1 text-sm text-gray-900">
              {loanApplication.interestRate}%
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Ecobank Subscription
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {loanApplication.ecobankSubscription ? "Yes" : "No"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Purpose</CardTitle>
          <CardDescription>
            How the applicant plans to use the funds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-900">{loanApplication.loanPurpose}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
            <CardDescription>
              Personal details of the loan applicant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {loanApplication.personalProfile.profilePhoto && (
                <img
                  src={loanApplication.personalProfile.profilePhoto}
                  alt={`${loanApplication.personalProfile.firstName} ${loanApplication.personalProfile.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {loanApplication.personalProfile.firstName}{" "}
                  {loanApplication.personalProfile.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {loanApplication.personalProfile.positionHeld}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-500">
                Contact Information
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.personalProfile.email} |{" "}
                {loanApplication.personalProfile.phoneNumber}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Country</p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.personalProfile.country}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Identity</p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.personalProfile.identityDocType
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                : {loanApplication.personalProfile.identityDocNumber}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Tax ID</p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.personalProfile.taxIdNumber}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Details about the applicant&apos;s business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {loanApplication.businessProfile.businessLogo && (
                <img
                  src={loanApplication.businessProfile.businessLogo}
                  alt={loanApplication.businessProfile.businessName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {loanApplication.businessProfile.businessName}
                </p>
                <p className="text-sm text-gray-500">
                  Est. {loanApplication.businessProfile.yearOfRegistration}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-500">
                Contact Information
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.businessProfile.businessEmail} |{" "}
                {loanApplication.businessProfile.businessPhoneNumber}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.businessProfile.street1}
                {loanApplication.businessProfile.street2
                  ? `, ${loanApplication.businessProfile.street2}`
                  : ""}
                {", "}
                {loanApplication.businessProfile.city},{" "}
                {loanApplication.businessProfile.country},{" "}
                {loanApplication.businessProfile.postalCode}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Annual Turnover
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.businessProfile.currency}{" "}
                {loanApplication.businessProfile.averageAnnualTurnover.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Monthly Turnover
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.businessProfile.currency}{" "}
                {loanApplication.businessProfile.averageMonthlyTurnover.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Previous Loans
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {loanApplication.businessProfile.previousLoans ? "Yes" : "No"}
                {loanApplication.businessProfile.previousLoans &&
                  loanApplication.businessProfile.recentLoanStatus !== "NONE" &&
                  ` (Status: ${loanApplication.businessProfile.recentLoanStatus})`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CardFooter className="pt-6 px-0 flex justify-end space-x-4">
        {loanApplication.loanStatus === 0 && (
          <>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reject Application
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00AA82] hover:bg-[#00805F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Approve Application
            </button>
          </>
        )}

        {loanApplication.loanStatus === 1 && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Disburse Funds
          </button>
        )}
      </CardFooter>
    </div>
  );
};

export default LoanDetailsPage;
