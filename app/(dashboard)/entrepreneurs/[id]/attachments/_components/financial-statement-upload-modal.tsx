"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { FileUpload } from "@/components/ui/file-upload";

export interface FinancialStatementEntry {
  id: string;
  year: string;
  statementFile: string;
}

interface FinancialStatementUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entries: FinancialStatementEntry[]) => void;
  initialEntries?: FinancialStatementEntry[];
  isLoading?: boolean;
}

// Generate year options (current year and past 10 years)
const generateYearOptions = (): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const years: SelectOption[] = [];
  for (let i = 0; i <= 10; i++) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

export function FinancialStatementUploadModal({
  open,
  onOpenChange,
  onSubmit,
  initialEntries = [],
  isLoading = false,
}: FinancialStatementUploadModalProps) {
  const [entries, setEntries] = useState<FinancialStatementEntry[]>([]);
  const yearOptions = generateYearOptions();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize entries
  useEffect(() => {
    if (open) {
      if (initialEntries.length > 0) {
        setEntries(initialEntries);
      } else {
        // Start with one empty entry
        setEntries([
          {
            id: Date.now().toString(),
            year: "",
            statementFile: "",
          },
        ]);
      }
    }
  }, [open, initialEntries]);

  // Handle escape key and click outside
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

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: Date.now().toString(),
        year: "",
        statementFile: "",
      },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: string, updates: Partial<FinancialStatementEntry>) => {
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const handleSubmit = () => {
    // Validate entries
    for (const entry of entries) {
      if (!entry.year) {
        alert("Please select a year for all entries");
        return;
      }
      if (!entry.statementFile) {
        alert("Please upload a financial statement file for all entries");
        return;
      }
    }

    onSubmit(entries);
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
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-[700px] max-h-[90vh] translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95 flex flex-col"
      >
        <div className="px-8 py-6 flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-midnight-blue">
              Upload Financial Statement(s)
            </h2>
            <button
              onClick={() => !isLoading && onOpenChange(false)}
              className="rounded-sm opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Instruction */}
          <p className="text-sm text-primaryGrey-400 mb-6">
            Select a file to upload below.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="space-y-4 p-4 border border-primaryGrey-200 rounded-md bg-white"
              >
                {/* Financial Statement Year */}
                <div>
                  <label className="block text-sm font-medium text-primaryGrey-400 mb-2">
                    Financial statement year <span className="text-red-500">*</span>
                  </label>
                  <SelectWithDescription
                    options={yearOptions}
                    value={entry.year}
                    onValueChange={(value) => updateEntry(entry.id, { year: value })}
                    placeholder="Select year"
                    triggerClassName="h-10 w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* Upload Financial Statement */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FileUpload
                      value={entry.statementFile}
                      onChange={(value) => updateEntry(entry.id, { statementFile: value })}
                      label={`Upload financial statement for the year ${entry.year || "___"}`}
                      required
                      acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                      maxSizeMB={8}
                      error={false}
                      showUploadedState={!!entry.statementFile}
                    />
                  </div>
                  {entries.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => removeEntry(entry.id)}
                      disabled={isLoading}
                      className="h-10 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Financial Statement Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            disabled={isLoading}
            className="mt-4 w-full h-10 gap-2 border-dashed border-primaryGrey-300 text-primaryGrey-400 hover:bg-primaryGrey-50"
          >
            <Plus className="h-4 w-4" />
            Add financial statement
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-6 flex-shrink-0 border-t border-primaryGrey-100 flex justify-end gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-white border border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50"
          >
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary-green hover:bg-primary-green/90 text-white border-0"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

