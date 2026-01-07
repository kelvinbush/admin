"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  LoanTimeline,
  type TimelineEvent as ComponentTimelineEvent,
} from "../_components/loan-timeline";
import { useLoanApplicationTimeline } from "@/lib/api/hooks/loan-applications";

export default function LoanTimelinePage() {
  const params = useParams();
  const applicationId = params.id as string;

  const {
    data: timelineEvents,
    isLoading,
    error,
  } = useLoanApplicationTimeline(applicationId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-midnight-blue">
            Loan application progress
          </h2>
          <p className="text-sm text-primaryGrey-500">
            Track the key loan application stages from submission to
            disbursement.
          </p>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-20">
          <p className="text-primaryGrey-500">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error || !timelineEvents) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-midnight-blue">
            Loan application progress
          </h2>
          <p className="text-sm text-primaryGrey-500">
            Track the key loan application stages from submission to
            disbursement.
          </p>
        </div>

        {/* Error State */}
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500">
            Error loading timeline. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-midnight-blue">
          Loan application progress
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Track the key loan application stages from submission to disbursement.
        </p>
      </div>

      {/* Timeline */}
      <LoanTimeline events={timelineEvents as ComponentTimelineEvent[]} />
    </div>
  );
}
