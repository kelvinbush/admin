"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";

export interface BankStatementEntry {
  id: string;
  bankName: string;
  specifyBankName?: string;
  statementFile: string;
  password?: string;
}

interface BankStatementUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entries: BankStatementEntry[]) => void;
  initialEntries?: BankStatementEntry[];
  isLoading?: boolean;
}

// Bank options
const bankOptions: SelectOption[] = [
  { value: "equity", label: "Equity Bank" },
  { value: "kcb", label: "KCB Bank" },
  { value: "cooperative", label: "Cooperative Bank" },
  { value: "absa", label: "Absa Bank" },
  { value: "standard-chartered", label: "Standard Chartered" },
  { value: "diamond-trust", label: "Diamond Trust Bank" },
  { value: "ncba", label: "NCBA Bank" },
  { value: "stanbic", label: "Stanbic Bank" },
  { value: "citibank", label: "Citibank" },
  { value: "other", label: "Other" },
];

export function BankStatementUploadModal({
  open,
  onOpenChange,
  onSubmit,
  initialEntries = [],
  isLoading = false,
}: BankStatementUploadModalProps) {
  const [entries, setEntries] = useState<BankStatementEntry[]>([]);
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
            bankName: "",
            statementFile: "",
            password: "",
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
        bankName: "",
        statementFile: "",
        password: "",
      },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: string, updates: Partial<BankStatementEntry>) => {
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const handleSubmit = () => {
    // Validate entries
    for (const entry of entries) {
      if (!entry.bankName) {
        alert("Please select a bank name for all entries");
        return;
      }
      if (entry.bankName === "other" && !entry.specifyBankName) {
        alert("Please specify the bank name for entries with 'Other' selected");
        return;
      }
      if (!entry.statementFile) {
        alert("Please upload a bank statement file for all entries");
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
              Upload Bank Statement(s)
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
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="space-y-4 p-4 border border-primaryGrey-200 rounded-md bg-white"
              >
                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-primaryGrey-400 mb-2">
                    Bank name <span className="text-red-500">*</span>
                  </label>
                  <SelectWithDescription
                    options={bankOptions}
                    value={entry.bankName}
                    onValueChange={(value) => updateEntry(entry.id, { bankName: value })}
                    placeholder="Select bank"
                    triggerClassName="h-10"
                    disabled={isLoading}
                  />
                </div>

                {/* Specify Bank Name - Only show if "Other" is selected */}
                {entry.bankName === "other" && (
                  <div>
                    <label className="block text-sm font-medium text-primaryGrey-400 mb-2">
                      Specify bank name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={entry.specifyBankName || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { specifyBankName: e.target.value })
                      }
                      placeholder="Enter bank name"
                      className="h-10"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Upload Bank Statement */}
                <div>
                  <FileUpload
                    value={entry.statementFile}
                    onChange={(value) => updateEntry(entry.id, { statementFile: value })}
                    label="Upload bank statement for the last 12 months"
                    required
                    acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                    maxSizeMB={8}
                    error={false}
                  />
                </div>

                {/* Password and Remove */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-primaryGrey-400 mb-2">
                      Bank statement password (if applicable)
                    </label>
                    <Input
                      type="password"
                      value={entry.password || ""}
                      onChange={(e) => updateEntry(entry.id, { password: e.target.value })}
                      placeholder="Enter password"
                      className="h-10"
                      disabled={isLoading}
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

          {/* Add Bank Statement Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            disabled={isLoading}
            className="mt-4 w-full h-10 gap-2 border-dashed border-primaryGrey-300 text-primaryGrey-400 hover:bg-primaryGrey-50"
          >
            <Plus className="h-4 w-4" />
            Add bank statement
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

