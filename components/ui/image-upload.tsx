"use client";

import * as React from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

export interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  circular?: boolean;
  showPreview?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  maxSizeMB = 5,
  acceptedFormats = ["PNG", "JPG", "JPEG"],
  label,
  required = false,
  error = false,
  errorMessage,
  className,
  circular = false,
  showPreview = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader");

  const currentImages = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    // Validate file count
    const totalFiles = multiple ? currentImages.length + files.length : files.length;
    if (totalFiles > maxFiles) {
      setUploadError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
      return;
    }

    // Validate file size and format
    const invalidFiles: string[] = [];
    Array.from(files).forEach((file) => {
      const fileSizeMB = file.size / (1024 * 1024);
      const fileExtension = file.name.split(".").pop()?.toUpperCase();
      
      if (fileSizeMB > maxSizeMB) {
        invalidFiles.push(`${file.name} (exceeds ${maxSizeMB}MB)`);
      }
      if (fileExtension && !acceptedFormats.includes(fileExtension)) {
        invalidFiles.push(`${file.name} (invalid format)`);
      }
    });

    if (invalidFiles.length > 0) {
      setUploadError(`Invalid files: ${invalidFiles.join(", ")}`);
      return;
    }

    setIsUploading(true);

    try {
      const filesArray = Array.from(files);
      const response = await startUpload(filesArray);

      if (!response || response.length === 0) {
        throw new Error("Upload failed");
      }

      const uploadedUrls = response.map((file) => file.url);

      if (multiple) {
        onChange([...currentImages, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((_, i) => i !== index);
      onChange(newValues);
    } else {
      onChange("");
    }
  };

  const handleChangeImage = (index: number) => {
    fileInputRef.current?.click();
  };

  const getInitials = (index: number) => {
    if (label) {
      const words = label.split(" ");
      return words.map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    }
    return "PH";
  };

  if (multiple) {
    return (
      <div className={cn("space-y-4", className)}>
        {label && (
          <div>
            <label className="text-sm font-medium text-primaryGrey-400">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentImages.map((imageUrl, index) => (
            <div
              key={index}
              className={cn(
                "relative border-2 border-dashed rounded-md overflow-hidden",
                error ? "border-red-500" : "border-primaryGrey-200"
              )}
            >
              {showPreview && imageUrl ? (
                <>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={imageUrl}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={isUploading}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeImage(index)}
                    disabled={isUploading}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change Image
                  </button>
                </>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center p-4 bg-primaryGrey-50">
                  <ImageIcon className="h-8 w-8 text-primaryGrey-400 mb-2" />
                  <p className="text-xs text-center text-primaryGrey-400 mb-1">
                    File formats: {acceptedFormats.join(", ")}
                  </p>
                  <p className="text-xs text-center text-primaryGrey-400">
                    Max. File Size: {maxSizeMB}MB
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mt-3 px-4 py-1.5 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Image
                  </button>
                </div>
              )}
            </div>
          ))}

          {currentImages.length < maxFiles && (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center p-4 bg-primaryGrey-50 transition-colors",
                error ? "border-red-500" : "border-primaryGrey-200",
                isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-primaryGrey-100"
              )}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-primary-green animate-spin mb-2" />
                  <p className="text-xs text-center text-primaryGrey-400 font-medium">
                    Uploading...
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-primaryGrey-400 mb-2" />
                  <p className="text-xs text-center text-primaryGrey-400 mb-1">
                    File formats: {acceptedFormats.join(", ")}
                  </p>
                  <p className="text-xs text-center text-primaryGrey-400">
                    Max. File Size: {maxSizeMB}MB
                  </p>
                  <button
                    type="button"
                    className="mt-3 px-4 py-1.5 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Upload Image
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.map((f) => `.${f.toLowerCase()}`).join(",")}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {(uploadError || errorMessage) && (
          <p className="text-sm text-red-500">{uploadError || errorMessage}</p>
        )}
      </div>
    );
  }

  // Single image upload (for logo)
  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div>
          <label className="text-sm font-medium text-primaryGrey-400">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Preview */}
        {showPreview && value && typeof value === "string" ? (
          <div
            className={cn(
              "relative flex-shrink-0 overflow-hidden",
              circular ? "w-24 h-24 rounded-full" : "w-24 h-24 rounded-md"
            )}
          >
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "relative flex-shrink-0 flex items-center justify-center bg-primaryGrey-100 text-primaryGrey-400 font-semibold",
              circular ? "w-24 h-24 rounded-full" : "w-24 h-24 rounded-md"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-primary-green animate-spin" />
            ) : (
              getInitials(0)
            )}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              error && "ring-2 ring-red-500"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload logo
              </>
            )}
          </button>
          <p className="text-xs text-primaryGrey-400">
            File types: {acceptedFormats.join(", ")}
          </p>
          <p className="text-xs text-primaryGrey-400">
            Max file size: {maxSizeMB}MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map((f) => `.${f.toLowerCase()}`).join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {(uploadError || errorMessage) && (
        <p className="text-sm text-red-500">{uploadError || errorMessage}</p>
      )}
    </div>
  );
}

