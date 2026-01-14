"use client";

import React from "react";
import { EyeIcon, EditIcon, DownloadIcon, UploadIcon } from "@/components/icons/document-icons";
import { Button } from "@/components/ui/button";

type DocumentStatus = "approved" | "rejected" | "pending_review" | "missing";

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
  const isMissing = status === "missing";
  const isPendingReview = status === "pending_review";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        {isMissing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpload}
            className="h-9 gap-2 border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50"
          >
            <UploadIcon />
            Upload Document
          </Button>
        ) : (
          <>
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
          </>
        )}
      </div>

      {isPendingReview && onApprove && onReject && (
        <div className="flex items-center gap-4">
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 text-[#017A5D] hover:opacity-80 transition-colors text-sm font-medium"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1.5 text-[#A71525] hover:opacity-80 transition-colors text-sm font-medium"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

