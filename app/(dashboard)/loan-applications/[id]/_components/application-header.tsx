"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  Building2, 
  Calendar,
  DollarSign,
  Clock
} from "lucide-react";
import type { LoanApplicationItem } from "@/lib/api/types";
import { formatCurrency, formatStatusText } from "@/lib/utils/currency";

interface ApplicationHeaderProps {
  application: LoanApplicationItem;
}

export function ApplicationHeader({ application }: ApplicationHeaderProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "border-gray-500 text-gray-500";
    
    switch (status) {
      case "draft":
        return "border-gray-500 text-gray-500 bg-gray-50";
      case "submitted":
        return "border-blue-500 text-blue-700 bg-blue-50";
      case "under_review":
        return "border-yellow-500 text-yellow-700 bg-yellow-50";
      case "approved":
        return "border-green-500 text-green-700 bg-green-50";
      case "offer_letter_sent":
        return "border-purple-500 text-purple-700 bg-purple-50";
      case "offer_letter_signed":
        return "border-indigo-500 text-indigo-700 bg-indigo-50";
      case "offer_letter_declined":
        return "border-orange-500 text-orange-700 bg-orange-50";
      case "rejected":
        return "border-red-500 text-red-700 bg-red-50";
      case "withdrawn":
        return "border-gray-500 text-gray-700 bg-gray-50";
      case "disbursed":
        return "border-emerald-500 text-emerald-700 bg-emerald-50";
      default:
        return "border-gray-500 text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-midnight-blue/10 rounded-xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-midnight-blue" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Application #{application.applicationNumber}
              </h1>
              <p className="text-gray-500">
                Created on {formatDate(application.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className={`px-4 py-2 text-sm font-medium rounded-full border-2 ${getStatusColor(application.status)}`}
            >
              {formatStatusText(application.status)}
            </Badge>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(application.loanAmount, application.currency || "USD")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Term</p>
                <p className="text-xl font-bold text-gray-900">
                  {application.loanTerm} {application.loanProduct?.termUnit || "months"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                {application.isBusinessLoan ? (
                  <Building2 className="h-5 w-5 text-purple-600" />
                ) : (
                  <User className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-xl font-bold text-gray-900">
                  {application.isBusinessLoan ? "Business" : "Personal"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(application.submittedAt || null)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Applicant</p>
              <p className="font-semibold text-gray-900">
                {application.user?.firstName} {application.user?.lastName}
              </p>
              <p className="text-gray-500">{application.user?.email}</p>
            </div>
            
            {application.business && (
              <div>
                <p className="text-gray-500 mb-1">Business</p>
                <p className="font-semibold text-gray-900">
                  {application.business.name}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-500 mb-1">Loan Product</p>
              <p className="font-semibold text-gray-900">
                {application.loanProduct?.name || "N/A"}
              </p>
              {application.loanProduct?.interestRate && (
                <p className="text-gray-500">{application.loanProduct.interestRate}% interest</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}