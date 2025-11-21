"use client";

import { cn } from "@/lib/utils";

type DocumentStatus = "uploaded" | "pending" | "rejected";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  uploaded: {
    label: "Uploaded",
    className: "bg-primary-green/20 text-primary-green border-primary-green/30",
  },
  pending: {
    label: "Pending",
    className: "bg-[#FFE5B0] text-[#8C5E00] border-[#FFE5B0]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
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

