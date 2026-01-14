"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ActionIcon = ({ color }: { color: string }) => (
  <svg width="80" height="80" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 23.8125C49.5 23.8125 51 25.3125 51 26.8125V50.8125C51 52.5 49.5 53.8125 48 53.8125C46.3125 53.8125 45 52.5 45 50.8125V26.8125C45 25.3125 46.3125 23.8125 48 23.8125ZM52.5 65.8125C52.5 68.4375 50.4375 70.3125 48 70.3125C45.375 70.3125 43.5 68.4375 43.5 65.8125C43.5 63.375 45.375 61.3125 48 61.3125C50.4375 61.3125 52.5 63.375 52.5 65.8125ZM0 35.8125C0 32.25 1.3125 28.875 3.9375 26.25L26.25 3.9375C28.875 1.3125 32.25 0 35.8125 0H60C63.5625 0 66.9375 1.3125 69.5625 3.9375L91.875 26.25C94.5 28.875 95.8125 32.25 95.8125 35.8125V60C95.8125 63.5625 94.5 66.9375 91.875 69.5625L69.5625 91.875C66.9375 94.5 63.5625 95.8125 60 95.8125H35.8125C32.25 95.8125 28.875 94.5 26.25 91.875L3.9375 69.5625C1.3125 66.9375 0 63.5625 0 60V35.8125ZM8.0625 30.5625C6.75 31.875 6 33.75 6 35.8125V60C6 62.0625 6.75 63.9375 8.0625 65.25L30.5625 87.75C31.875 89.0625 33.75 89.8125 35.8125 89.8125H60C62.0625 89.8125 63.9375 89.0625 65.25 87.75L87.75 65.25C89.0625 63.9375 89.8125 62.0625 89.8125 60V35.8125C89.8125 33.75 89.0625 31.875 87.75 30.5625L65.25 8.0625C63.9375 6.75 62.0625 6 60 6H35.8125C33.75 6 31.875 6.75 30.5625 8.0625L8.0625 30.5625Z" fill={color} />
  </svg>
);

interface VerificationActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
  variant: "approve" | "reject";
  isLoading?: boolean;
}

export function VerificationActionModal({ open, onOpenChange, onConfirm, variant, isLoading }: VerificationActionModalProps) {
  const [reason, setReason] = React.useState("");

  const isApprove = variant === "approve";
  const title = isApprove ? "Are you sure you want to approve this document?" : "Are you sure you want to reject this document?";
  const description = isApprove
    ? "Approving this document confirms it is valid and meets all required criteria. You may still reject or update later if needed."
    : "Please provide a clear reason for rejecting this document to help the user understand what needs to be provided";
  const confirmText = isApprove ? "Yes, Approve" : "Yes, Reject";
  const iconColor = isApprove ? "#E9499C" : "#A71525";

  const handleConfirm = () => {
    if (variant === 'reject' && !reason.trim()) {
      // You might want to show a toast or inline error here
      return;
    }
    onConfirm(reason);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason("");
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] text-center p-12">
        <DialogHeader className="items-center">
          <div className="w-20 h-20 mb-4">
            <ActionIcon color={iconColor} />
          </div>
          <DialogTitle className="text-2xl font-medium text-midnight-blue mb-2">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-primaryGrey-400 mb-6">{description}</p>
        {variant === "reject" && (
          <div className="mb-6">
            <Textarea
              placeholder="Enter rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={1000}
              className="min-h-[120px] text-left"
            />
            <div className="text-right text-xs text-primaryGrey-400 mt-1">{reason.length}/1000</div>
          </div>
        )}
        <DialogFooter className="sm:justify-center gap-5">
          <Button size="lg" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="font-normal">
            No, Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isLoading || (variant === 'reject' && !reason.trim())}
            className="font-normal text-white border-0"
            style={{
              background: isApprove
                ? 'linear-gradient(90deg, #0C9 0%, #F0459C 100%)'
                : '#A71525'
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
