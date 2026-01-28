"use client";

import React, { useRef, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

export interface MultiDocumentItem {
  url: string;
  name: string;
}

interface MultiDocumentUploadProps {
  value?: MultiDocumentItem[];
  onChange: (value: MultiDocumentItem[]) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export function MultiDocumentUpload({
  value = [],
  onChange,
  label,
  required = false,
  error = false,
  errorMessage,
  maxFiles = 5,
  maxSizeMB = 8,
  acceptedFormats = ["PDF", "PNG", "JPG", "JPEG"],
}: MultiDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("documentUploader");

  const validateFile = (file: File): string | null => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `${file.name} exceeds ${maxSizeMB}MB`;
    }
    const ext = file.name.split(".").pop()?.toUpperCase();
    if (!ext || !acceptedFormats.includes(ext)) {
      return `${file.name} has an unsupported format`;
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setUploadError(null);

    if (value.length + files.length > maxFiles) {
      setUploadError(`You can upload up to ${maxFiles} files.`);
      return;
    }

    for (const file of files) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setUploadError(errorMsg);
        return;
      }
    }

    setIsUploading(true);
    try {
      const res = await startUpload(files);
      if (!res || res.length === 0) {
        setUploadError("Upload failed.");
        return;
      }

      const items: MultiDocumentItem[] = res.map((r, index) => ({
        url: r.url,
        // Prefer the name from uploadthing response, fall back to local file name
        name: (r as any).name || files[index]?.name || `Document ${index + 1}`,
      }));

      onChange([...value, ...items]);
    } catch (err) {
      setUploadError("Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-primaryGrey-400">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Choose files
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept={acceptedFormats.map((f) => `.${f.toLowerCase()}`).join(",")}
        />
        <span className="text-xs text-primaryGrey-400">
          Up to {maxFiles} files, {maxSizeMB}MB each ({acceptedFormats.join(", ")})
        </span>
      </div>

      {value.length > 0 && (
        <div className="mt-2 space-y-2">
          {value.map((item, index) => (
            <div
              key={item.url + index}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md border px-3 py-2 bg-white",
                error && "border-red-500",
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-primaryGrey-500 flex-shrink-0" />
                <span className="text-sm text-primaryGrey-700 truncate">
                  {item.name}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-red-500 hover:text-red-700 flex-shrink-0"
                onClick={() => handleRemove(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}
      {!uploadError && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

