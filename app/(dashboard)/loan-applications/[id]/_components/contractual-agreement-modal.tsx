"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUploadInput } from "./file-upload-input";
import { toast } from "sonner";

interface ContractualAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: { docUrl: string; docName: string }) => Promise<void>;
  isLoading?: boolean;
}

export function ContractualAgreementModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ContractualAgreementModalProps) {
  const [uploadedFile, setUploadedFile] = useState<{
    docUrl: string;
    docName: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a contractual agreement file");
      return;
    }

    try {
      await onSubmit(uploadedFile);
      // Reset form on successful submission
      setUploadedFile(null);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleCancel = () => {
    setUploadedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setUploadedFile(null);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Additional details
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Fill in the required information below to proceed to the next step
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary-green">
              Contractual agreement
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Upload contractual agreement <span className="text-red-500">*</span>
              </label>
              <FileUploadInput
                value={uploadedFile || undefined}
                onChange={(file) => setUploadedFile(file || null)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Supported formats: PDF, PNG, JPG, JPEG (Max 2MB)
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !uploadedFile}
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
