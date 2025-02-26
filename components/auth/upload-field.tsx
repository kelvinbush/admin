import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud, Eye } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";
import {
  CircularProgress,
  CircularProgressLabel,
} from "@/components/ui/circular-progress";

interface UploadFieldProps {
  onChange: (value: string) => void;
  value?: string;
  accept: string;
  maxSize: number;
  supportingText?: string;
  label?: string;
  type: "identity" | "passport" | "tax";
}

export function UploadField({
  onChange,
  value,
  accept,
  maxSize,
  label,
  type,
  supportingText,
}: UploadFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { edgestore } = useEdgeStore();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        setError(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      try {
        setIsUploading(true);
        const res = await edgestore.publicFiles.upload({
          file, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          input: { type },
          onProgressChange: (progress) => {
            setProgress(progress);
          },
        });
        onChange(res.url);
        setError(null);
      } catch (err) {
        setError("Failed to upload file. Please try again.");
        console.error(err);
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await edgestore.publicFiles.delete({
          url: value,
        });
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }
    onChange("");
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${
          value
            ? "border-green-500"
            : "border-dashed border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
        {value ? (
          <div className="flex items-center justify-between">
            <span className="truncate text-sm text-gray-600">
              {label || "File uploaded"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(value, "_blank");
                }}
              >
                <Eye className="h-4 w-4 text-primary-green" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CircularProgress value={progress} size="60px" color="primary">
              <CircularProgressLabel>
                {Math.round(progress)}%
              </CircularProgressLabel>
            </CircularProgress>
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              Click to upload or drag and drop
            </div>
            <div className="text-xs text-gray-500">{supportingText}</div>
          </>
        )}
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
      {isUploading && (
        <div className="mt-2">
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </div>
  );
}
