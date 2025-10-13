"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLoanApplication } from "@/lib/api/hooks/loan-applications";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText } from "lucide-react";

// Import components (we'll create these step by step)
import { ApplicationHeader } from "./_components/application-header";
import { StatusTimeline } from "./_components/status-timeline";
import { ApplicantInformation } from "./_components/applicant-information";
import { LoanDetails } from "./_components/loan-details";
import { DocumentsSection } from "./_components/documents-section";
import { AuditTrail } from "./_components/audit-trail";
import { ActionsPanel } from "./_components/actions-panel";

export default function LoanApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setTitle } = useTitle();
  const applicationId = params.id as string;

  const {
    data: application,
    isLoading,
    error,
  } = useLoanApplication(applicationId);

  React.useEffect(() => {
    if (application) {
      setTitle(`Application ${application.applicationNumber}`);
    } else {
      setTitle("Loan Application Details");
    }
  }, [application, setTitle]);

  const handleBack = () => {
    router.push("/loan-applications");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-56 w-full rounded-xl" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Application Not Found
          </h3>
          <p className="text-gray-500 mb-6">
            The loan application you&apos;re looking for doesn&apos;t exist or
            has been removed.
          </p>
          <Button
            onClick={handleBack}
            className="bg-midnight-blue hover:bg-midnight-blue/90"
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Back Navigation */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </div>

          {/* Application Header */}
          <ApplicationHeader application={application} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-3 space-y-8">
              <StatusTimeline application={application} />
              <ApplicantInformation application={application} />
              <LoanDetails application={application} />
              <DocumentsSection applicationId={applicationId} />
              <AuditTrail applicationId={applicationId} />
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ActionsPanel application={application} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
