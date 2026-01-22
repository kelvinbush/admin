"use client";

import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface DocumentFile {
  docUrl: string;
  docName: string;
}

interface MultiFileUploadInputProps {
  value?: DocumentFile[];
  onChange: (value: DocumentFile[]) => void;
  disabled?: boolean;
  docName?: string; // Base document name to use instead of filename (will append index for multiple files)
}

export function MultiFileUploadInput({
  value = [],
  onChange,
  disabled = false,
  docName,
}: MultiFileUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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

  const handleFileUpload = async (files: File[]) => {
    setUploadError(null);
    setIsUploading(true);
    try {
      const res = await startUpload(files);
      if (res) {
        // Use provided docName if available, otherwise fall back to filename
        // For multiple files with docName, append index based on current value length
        // This ensures correct numbering even when files are added incrementally
        const currentCount = value.length;
        const totalFilesAfterUpload = currentCount + files.length;
        const shouldNumber = totalFilesAfterUpload > 1; // Number if there will be multiple files total
        
        const newFiles = res.map((r, i) => ({
          docUrl: r.url,
          docName: docName 
            ? (shouldNumber 
                ? `${docName} ${currentCount + i + 1}` 
                : docName)
            : files[i].name,
        }));
        onChange([...value, ...newFiles]);
      } else {
        setUploadError("Upload failed.");
      }
    } catch (error) {
      console.log(error);
      setUploadError("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
    }
    handleFileUpload(files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn("flex items-center space-x-2", disabled && "opacity-50")}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Choose Files"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          multiple
        />
      </div>
      {value.length > 0 && (
        <div className="mt-2 space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md"
            >
              <span className="truncate">{file.docName}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-red-500 hover:text-red-600"
                onClick={() => handleRemoveFile(index)}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {value.length === 0 && !isUploading && (
        <span className="text-sm text-gray-500">No files chosen</span>
      )}
      {uploadError && (
        <p className="text-sm text-red-500 mt-1">{uploadError}</p>
      )}
    </div>
  );
}
