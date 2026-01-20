"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    docUrl: string;
    docName: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onOpenChange(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        overlayRef.current &&
        overlayRef.current === e.target
      ) {
        if (!isLoading) {
          onOpenChange(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange, isLoading]);

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

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isLoading) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={contentRef}
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-[800px] translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95"
      >
        <div className="px-8 py-16 flex flex-col items-center text-center">
          <div className="w-full mb-4">
            <button
              onClick={() => !isLoading && onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <h2 className="text-2xl font-medium text-midnight-blue mb-3">
            Additional details
          </h2>

          <p className="text-primaryGrey-400 mb-6">
            Fill in the required information below to proceed to the next step
          </p>

          <div className="w-full mb-6">
            <div className="w-full space-y-2 text-left">
              <label className="text-sm font-medium text-midnight-blue block">
                Upload contractual agreement
                <span className="text-red-500 ml-1">*</span>
              </label>
              <FileUploadInput
                value={uploadedFile || undefined}
                onChange={(file) => setUploadedFile(file || null)}
                disabled={isLoading}
              />
              <p className="text-xs text-primaryGrey-400">
                Supported formats: PDF, PNG, JPG, JPEG (Max 2MB)
              </p>
            </div>
          </div>

          <div className="mt-6 w-full flex flex-col sm:flex-row sm:justify-center gap-5">
            <Button
              size="lg"
              onClick={handleCancel}
              disabled={isLoading}
              variant="outline"
              className="bg-white border border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50 font-normal"
            >
              No, Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading || !uploadedFile}
              className="bg-primary-green hover:bg-primary-green/90 text-white border-0 font-normal"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
