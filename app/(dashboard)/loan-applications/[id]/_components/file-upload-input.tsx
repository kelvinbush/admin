"use client";

import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface FileUploadInputProps {
  value?: { docUrl: string; docName: string };
  onChange: (value?: { docUrl: string; docName: string }) => void;
  disabled?: boolean;
}

export function FileUploadInput({
  onChange,
  disabled = false,
}: FileUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ docUrl: string; docName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("documentUploader");

  const validateFile = (file: File): string | null => {
    if (file.size / (1024 * 1024) > 2) return "File exceeds 2MB";
    const extension = file.name.split(".").pop()?.toUpperCase();
    if (!extension || !["PNG", "JPG", "JPEG", "PDF"].includes(extension)) {
      return "Unsupported file format";
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);
    try {
      const res = await startUpload([file]);
      if (res && res[0]) {
        const newFile = { docUrl: res[0].url, docName: file.name };
        setUploadedFile(newFile);
        onChange(newFile);
      } else {
        setUploadError("Upload failed.");
      }
    } catch (error) {
      setUploadError("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    handleFileUpload(file);
  };

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center space-x-2", disabled && "opacity-50")}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Choose File"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
        {uploadedFile && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{uploadedFile.docName}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={() => {
                setUploadedFile(null);
                onChange(undefined);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {!uploadedFile && !isUploading && (
          <span className="text-sm text-gray-500">No file chosen</span>
        )}
      </div>
      {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
    </div>
  );
}
