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

  return (
    <div className="space-y-6 p-6 rounded">
      <div>
        <h1 className="text-2xl font-bold">Loan application details</h1>
        <p className="text-gray-600 mt-1">
          Review the loan application details below to assess and process the
          request.
        </p>
      </div>

      <div className="bg-white rounded-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan amount
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                className="flex-1 rounded-l-md border border-gray-300 py-2 px-3 focus:outline-none"
                value={loanApplication.loanAmount.toLocaleString()}
              />
              <div className="inline-flex items-center px-4 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md">
                {loanApplication.defaultCurrency}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan tenure
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                className="flex-1 rounded-l-md border border-gray-300 py-2 px-3 focus:outline-none"
                value={loanApplication.repaymentPeriod.replace(/[^0-9]/g, "")}
              />
              <div className="inline-flex items-center px-4 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md">
                months
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intended use of funds
            </label>
            <textarea
              readOnly
              className="w-full rounded-md border border-gray-300 py-2 px-3 min-h-[100px] focus:outline-none"
              value={loanApplication.loanPurpose}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interested in Ecobank loans
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  checked={loanApplication.ecobankSubscription}
                  readOnly
                />
                <label className="ml-2 text-sm text-gray-700">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                  checked={!loanApplication.ecobankSubscription}
                  readOnly
                />
                <label className="ml-2 text-sm text-gray-700">No</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsPage;
