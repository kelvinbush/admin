"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useLoanApplicationContractTimeline } from "@/lib/api/hooks/loan-applications";
import { ContractTimeline } from "../_components/contract-timeline";

export default function ContractTimelinePage() {
  const params = useParams();
  const applicationId = params.id as string;

  const { data, isLoading, error } = useLoanApplicationContractTimeline(applicationId);

  const events = data?.events ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-midnight-blue">
            Contract tracking
          </h2>
          <p className="text-sm text-primaryGrey-500">
            Track the key agreement stages from upload to full execution.
          </p>
        </div>

        <div className="flex items-center justify-center py-20">
          <p className="text-primaryGrey-500">Loading contract timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-midnight-blue">
            Contract tracking
          </h2>
          <p className="text-sm text-primaryGrey-500">
            Track the key agreement stages from upload to full execution.
          </p>
        </div>

        <div className="flex items-center justify-center py-20">
          <p className="text-red-500">
            Error loading contract timeline. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-midnight-blue">
          Contract tracking
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Track the key agreement stages from upload to full execution.
        </p>
      </div>

      <ContractTimeline events={events} />
    </div>
  );
}

