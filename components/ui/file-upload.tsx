"use client";

import * as React from "react";
import { Upload, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

export interface FileUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  showUploadedState?: boolean; // Show uploaded state with label, view, and delete icons
}

export function FileUpload({
  value,
  onChange,
  label,
  required = false,
  error = false,
  errorMessage,
  className,
  acceptedFormats = ["PDF", "PNG", "JPG", "JPEG"],
  maxSizeMB = 5,
  showUploadedState = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const { startUpload: startDocumentUpload } = useUploadThing("documentUploader");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    const file = files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    const fileExtension = file.name.split(".").pop()?.toUpperCase();

    if (fileSizeMB > maxSizeMB) {
      setUploadError(`File exceeds ${maxSizeMB}MB`);
      return;
    }
    if (fileExtension && !acceptedFormats.includes(fileExtension)) {
      setUploadError(`Invalid format. Accepted: ${acceptedFormats.join(", ")}`);
      return;
    }

    // Store the original file name
    setFileName(file.name);

    setIsUploading(true);

    try {
      // Determine which uploader to use based on file type
      const isImage = ["PNG", "JPG", "JPEG"].includes(fileExtension || "");
      const startUpload = isImage ? startImageUpload : startDocumentUpload;
      
      const response = await startUpload([file]);

      if (!response || response.length === 0) {
        throw new Error("Upload failed");
      }

      onChange(response[0].url);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload file");
      setFileName(""); // Clear file name on error
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setFileName("");
  };

  const handleView = () => {
    if (value) {
      window.open(value, "_blank");
    }
  };

  // Clean up label for uploaded state - extract clean document name
  const getDisplayLabel = (label?: string): string => {
    if (!label) return "Uploaded file";
    
    let cleaned = label
      // Remove common prefixes
      .replace(/^Upload\s+/i, "") // "Upload " → ""
      .replace(/^Upload\s+the\s+/i, "") // "Upload the " → ""
      .replace(/^Upload\s+a\s+/i, "") // "Upload a " → ""
      // Remove common suffixes
      .replace(/\s*\(optional\)$/i, "") // " (optional)" → ""
      .replace(/\s*\(required\)$/i, "") // " (required)" → ""
      .trim();
    
    // Remove generic words that don't add value
    cleaned = cleaned
      .replace(/\s+document\s*$/i, "") // Remove trailing "document"
      .replace(/\s+page\s*$/i, "") // Remove trailing "page"
      .replace(/\s+certificate\s*$/i, "") // Remove trailing "certificate" (we'll add it back if needed)
      .trim();
    
    // Smart extraction for common patterns
    const patterns: Array<[RegExp, string]> = [
      [/front\s+id/i, "Front ID"],
      [/back\s+id/i, "Back ID"],
      [/passport\s+bio/i, "Passport Bio"],
      [/passport\s+photo/i, "Passport Photo"],
      [/personal\s+tax/i, "Personal Tax"],
      [/company\s+tax/i, "Company Tax"],
      [/tax\s+registration/i, "Tax Registration"],
      [/tax\s+clearance/i, "Tax Clearance"],
      [/certificate\s+of\s+incorporation/i, "Certificate of Incorporation"],
      [/certificate\s+of\s+registration/i, "Certificate of Registration"],
      [/business\s+permit/i, "Business Permit"],
      [/pitch\s+deck/i, "Pitch Deck"],
    ];
    
    // Try to match known patterns first
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(cleaned)) {
        return replacement;
      }
    }
    
    // If no pattern matches, capitalize properly and limit to 3-4 words max
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    const limited = words.slice(0, 4).join(" ");
    
    // Capitalize first letter of each word, handle special cases like "ID"
    return limited
      .split(/\s+/)
      .map(word => {
        const upper = word.toUpperCase();
        // Keep common acronyms uppercase
        if (upper === "ID" || upper === "CR" || upper === "PDF") {
          return upper;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  // Clear file name when value is cleared externally
  React.useEffect(() => {
    if (!value) {
      setFileName("");
    }
  }, [value]);

  // Show uploaded state (like the image) when file is uploaded and showUploadedState is true
  if (showUploadedState && value) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className={cn(
          "flex items-center justify-between rounded-md border border-primary-green px-4 py-3 bg-white",
          error && "border-red-500"
        )}>
          <span className="text-sm font-medium text-primaryGrey-700">
            {getDisplayLabel(label)}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleView}
              className="text-primary-green hover:text-primary-green/80 transition-colors"
              aria-label="View file"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {(uploadError || errorMessage) && (
          <p className="text-sm text-red-500">{uploadError || errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-primaryGrey-400">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={cn(
        "flex items-center rounded-md overflow-hidden border border-primaryGrey-200",
        error && "border-red-500"
      )}>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.map((f) => `.${f.toLowerCase()}`).join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "h-10 px-4 bg-black text-white border-0 rounded-none hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0",
            error && "ring-2 ring-red-500"
          )}
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Choose file
            </>
          )}
        </Button>

        <div className={cn(
          "flex-1 min-w-0 px-3 py-2 h-10 flex items-center",
          error && "border-l border-red-500"
        )}>
          {fileName || value ? (
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm text-primaryGrey-700 truncate flex-1">
                {fileName || "Uploaded file"}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="text-sm text-primaryGrey-400">No file chosen</span>
          )}
        </div>
      </div>

      {(uploadError || errorMessage) && (
        <p className="text-sm text-red-500">{uploadError || errorMessage}</p>
      )}
    </div>
  );
}

