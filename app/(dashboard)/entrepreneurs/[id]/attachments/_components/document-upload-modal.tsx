"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (fileUrl: string, documentName?: string) => void;
  documentName?: string; // For named documents (e.g., "Certificate of Incorporation")
  requireDocumentName?: boolean; // For unnamed documents - show name input field
  acceptedFormats?: string[];
  maxSizeMB?: number;
  isLoading?: boolean;
}

export function DocumentUploadModal({
  open,
  onOpenChange,
  onSubmit,
  documentName,
  requireDocumentName = false,
  acceptedFormats = ["PNG", "JPG", "JPEG", "PDF"],
  maxSizeMB = 2,
  isLoading = false,
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [inputDocumentName, setInputDocumentName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const { startUpload: startDocumentUpload } = useUploadThing("documentUploader");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setUploadedFileUrl("");
      setUploadError(null);
      setInputDocumentName("");
      setIsUploading(false);
    }
  }, [open]);

  // Handle escape key and click outside
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && !isUploading) {
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
        if (!isLoading && !isUploading) {
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
  }, [open, onOpenChange, isLoading, isUploading]);

  const validateFile = (file: File): string | null => {
    const fileSizeMB = file.size / (1024 * 1024);
    const fileExtension = file.name.split(".").pop()?.toUpperCase();

    if (fileSizeMB > maxSizeMB) {
      return `File exceeds ${maxSizeMB}MB`;
    }

    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      return `File format not supported. Supported formats: ${acceptedFormats.join(", ")}`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const fileExtension = file.name.split(".").pop()?.toUpperCase();
      const isImage = ["PNG", "JPG", "JPEG"].includes(fileExtension || "");

      const uploadedFiles = isImage
        ? await startImageUpload([file])
        : await startDocumentUpload([file]);

      if (uploadedFiles && uploadedFiles[0]) {
        setUploadedFileUrl(uploadedFiles[0].url);
        setSelectedFile(file);
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadError("Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    await handleFileUpload(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    await handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (!uploadedFileUrl) {
      setUploadError("Please select a file to upload");
      return;
    }

    if (requireDocumentName && !inputDocumentName.trim()) {
      setUploadError("Document name is required");
      return;
    }

    onSubmit(uploadedFileUrl, requireDocumentName ? inputDocumentName : documentName);
  };

  const modalTitle = documentName
    ? `Update ${documentName}`
    : requireDocumentName
    ? "Upload Document"
    : "Upload Document";

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isLoading && !isUploading) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={contentRef}
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-[600px] translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95"
      >
        <div className="px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-midnight-blue">
              {modalTitle}
            </h2>
            <button
              onClick={() => !isLoading && !isUploading && onOpenChange(false)}
              className="rounded-sm opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
              disabled={isLoading || isUploading}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Instruction */}
          <p className="text-sm text-primaryGrey-400 mb-6">
            Select a file to upload below.
          </p>

          {/* Document Name Input (for unnamed documents) */}
          {requireDocumentName && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-primaryGrey-400 mb-2">
                Document name <span className="text-red-500">*</span>
              </label>
              <Input
                value={inputDocumentName}
                onChange={(e) => setInputDocumentName(e.target.value)}
                placeholder="Enter document name"
                className="h-10"
                disabled={isLoading || isUploading}
              />
            </div>
          )}

          {/* Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primaryGrey-400 mb-2">
              Upload document <span className="text-red-500">*</span>
            </label>
            <div
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "border-2 border-dashed rounded-md p-8 text-center transition-colors",
                isDragging
                  ? "border-primary-green bg-primary-green/5"
                  : "border-primaryGrey-200 bg-primaryGrey-50",
                uploadError && "border-red-500",
                (isLoading || isUploading) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
                  <p className="text-sm text-primaryGrey-400">Uploading...</p>
                </div>
              ) : uploadedFileUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-green/20 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#00CC99"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-midnight-blue">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-primaryGrey-400 mt-1">
                      File uploaded successfully
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadedFileUrl("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={isLoading}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primaryGrey-100 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primaryGrey-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-midnight-blue mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-primaryGrey-400">
                      Supported formats: {acceptedFormats.join(", ")} or PDF
                    </p>
                    <p className="text-xs text-primaryGrey-400">
                      Max. File Size: {maxSizeMB}MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading}
                    className="gap-2 bg-midnight-blue text-white hover:bg-midnight-blue/90 border-0"
                  >
                    <Search className="h-4 w-4" />
                    Browse File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={acceptedFormats.map((f) => `.${f.toLowerCase()}`).join(",") + ",.pdf"}
                    onChange={handleFileSelect}
                    disabled={isLoading || isUploading}
                  />
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={() => !isLoading && !isUploading && onOpenChange(false)}
              disabled={isLoading || isUploading}
              className="bg-white border border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={
                !uploadedFileUrl ||
                isLoading ||
                isUploading ||
                (requireDocumentName && !inputDocumentName.trim())
              }
              className="bg-primary-green hover:bg-primary-green/90 text-white border-0 flex items-center gap-2"
            >
              {(isUploading || isLoading) && (
                <Upload className="h-4 w-4 animate-spin" />
              )}
              {isUploading
                ? "Uploading..."
                : isLoading
                ? "Saving..."
                : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

