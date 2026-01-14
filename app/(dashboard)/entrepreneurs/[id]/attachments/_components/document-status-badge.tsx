"use client";

import { cn } from "@/lib/utils";

type DocumentStatus = "approved" | "rejected" | "pending_review" | "missing";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  approved: {
    label: "Approved",
    className: "bg-[#D4F7EF] text-[#017A5D] border-[#A6E8D8]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  pending_review: {
    label: "Pending Review",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  missing: {
    label: "Missing",
    className: "bg-[#FFE5B0] text-[#8C5E00] border-[#FFE5B0]",
  },
};

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

