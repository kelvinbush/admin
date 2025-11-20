"use client";

import * as React from "react";
import { Link2, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface VideoLinkInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  maxLinks?: number;
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  placeholder?: string;
}

export function VideoLinkInput({
  value = [],
  onChange,
  maxLinks = 3,
  label,
  required = false,
  error = false,
  errorMessage,
  className,
  placeholder = "Paste link here",
}: VideoLinkInputProps) {
  const handleAddLink = () => {
    if (value.length < maxLinks) {
      onChange([...value, ""]);
    }
  };

  const handleRemoveLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, newValue: string) => {
    const newLinks = [...value];
    newLinks[index] = newValue;
    onChange(newLinks);
  };

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

      <div className="space-y-3">
        {value.map((link, index) => (
          <div key={index} className="relative">
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primaryGrey-400" />
              <Input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder={placeholder}
                className={cn(
                  "pl-10 pr-10 h-10",
                  error && "border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {value.length < maxLinks && (
          <button
            type="button"
            onClick={handleAddLink}
            className="text-primary-green hover:text-primary-green/80 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add another link
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

