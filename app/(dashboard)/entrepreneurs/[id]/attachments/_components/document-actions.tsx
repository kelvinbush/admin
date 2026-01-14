"use client";

import React from "react";
import { EyeIcon, EditIcon, DownloadIcon, UploadIcon } from "@/components/icons/document-icons";
import { Button } from "@/components/ui/button";

type DocumentStatus = "uploaded" | "pending" | "approved" | "rejected";

interface DocumentActionsProps {
  status: DocumentStatus;
  documentName?: string;
  onView?: () => void;
  onUpdate?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function DocumentActions({
  status,
  onView,
  onUpdate,
  onDownload,
  onUpload,
  onApprove,
  onReject,
}: DocumentActionsProps) {
  if (status === "pending" && !onApprove && !onReject) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onUpload}
        className="h-9 gap-2 border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50"
      >
        <UploadIcon />
        Upload Document
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {status === "pending" && (onApprove || onReject) ? (
        <>
          {onApprove && (
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 text-[#017A5D] hover:opacity-80 transition-colors text-sm font-medium"
            >
              Yes, Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 text-[#A71525] hover:opacity-80 transition-colors text-sm font-medium"
            >
              Yes, Reject
            </button>
          )}
        </>
      ) : null}
      <button
        onClick={onView}
        className="flex items-center gap-1.5 text-[#01337F] hover:text-[#01337F]/80 transition-colors text-sm font-medium"
      >
        <EyeIcon />
        View
      </button>
      <button
        onClick={onUpdate}
        className="flex items-center gap-1.5 text-[#00CC99] hover:text-[#00CC99]/80 transition-colors text-sm font-medium"
      >
        <EditIcon />
        Update
      </button>
      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 text-[#151F28] hover:text-[#151F28]/80 transition-colors text-sm font-medium"
      >
        <DownloadIcon />
        Download
      </button>
    </div>
  );
}

