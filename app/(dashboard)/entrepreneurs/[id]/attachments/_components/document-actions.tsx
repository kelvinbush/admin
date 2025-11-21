"use client";

import React from "react";
import { EyeIcon, EditIcon, DownloadIcon, UploadIcon } from "@/components/icons/document-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DocumentStatus = "uploaded" | "pending" | "rejected";

interface DocumentActionsProps {
  status: DocumentStatus;
  onView?: () => void;
  onUpdate?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
}

export function DocumentActions({
  status,
  onView,
  onUpdate,
  onDownload,
  onUpload,
}: DocumentActionsProps) {
  if (status === "pending") {
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

