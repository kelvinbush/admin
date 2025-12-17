"use client";

import React from "react";
import { LoanTimeline, type TimelineEvent } from "../_components/loan-timeline";

// Dummy data - will be replaced with API call later
const dummyTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "submitted",
    title: "Loan submitted successfully",
    description: "Loan application LNN-77204 has been submitted and is awaiting review.",
    date: "Jan 25, 2025",
    time: "6:04PM",
    performedBy: "Shalyne Waweru",
    lineColor: "orange",
  },
  {
    id: "2",
    type: "cancelled",
    title: "Loan cancelled",
    description: "Loan application LNN-77204 has been cancelled.",
    date: "Jan 25, 2025",
    time: "6:15PM",
    performedBy: "Shalyne Waweru",
    lineColor: "green",
  },
  {
    id: "3",
    type: "review_in_progress",
    title: "Loan officer review in progress",
    description:
      "Our team is reviewing your information and documents. You'll be notified once a decision is made.",
    date: "Jan 27, 2025",
    time: "10:30AM",
    updatedDate: "Jan 28, 2025",
    updatedTime: "12:24PM",
    lineColor: "green",
  },
  {
    id: "4",
    type: "rejected",
    title: "Loan rejected",
    description:
      "Your loan application was not approved. You can review the reason provided and reapply when ready.",
    date: "Jan 28, 2025",
    time: "2:00PM",
    lineColor: "grey",
  },
  {
    id: "5",
    type: "approved",
    title: "Loan approved",
    description:
      "Congratulations! Your loan has been approved. We're preparing it for disbursement.",
    date: "Jan 28, 2025",
    time: "2:00PM",
    lineColor: "grey",
  },
  {
    id: "6",
    type: "awaiting_disbursement",
    title: "Loan awaiting disbursement",
    description:
      "Your loan is now being processed and will be disbursed shortly.",
    updatedDate: "Jan 29, 2025",
    updatedTime: "2:15PM",
    lineColor: "grey",
  },
  {
    id: "7",
    type: "disbursed",
    title: "Loan disbursed",
    description:
      "Funds have been sent successfully to your account. You can now view your repayment schedule.",
    date: "Jan 30, 2025",
    time: "12:00PM",
  },
];

export default function LoanTimelinePage() {
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
      <LoanTimeline events={dummyTimelineEvents} />
    </div>
  );
}
