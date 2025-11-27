"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, X, ArrowDownWideNarrow, Filter, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";
type FilterStatus = "all" | "uploaded" | "pending" | "rejected";

interface AttachmentsHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onUpload: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "date-asc", label: "Date (Oldest first)" },
  { value: "date-desc", label: "Date (Newest first)" },
];

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All status" },
  { value: "uploaded", label: "Uploaded" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

export function AttachmentsHeader({
  searchValue,
  onSearchChange,
  onClearSearch,
  sort,
  onSortChange,
  filterStatus,
  onFilterChange,
  onUpload,
}: AttachmentsHeaderProps) {
  const sortLabel = sortOptions.find((opt) => opt.value === sort)?.label || "Sort by";
  const statusLabel = statusOptions.find((opt) => opt.value === filterStatus)?.label || "Filter status";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search */}
      <div className="flex items-center gap-2 border rounded-md px-3 h-10 w-full sm:w-[320px]">
        <Search className="h-4 w-4 text-primaryGrey-400 flex-shrink-0" />
        <Input
          className="h-9 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-300 bg-transparent"
          placeholder="Search document..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchValue && (
          <button
            aria-label="Clear search"
            className="ml-auto text-primaryGrey-400 hover:text-midnight-blue flex-shrink-0"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              <ArrowDownWideNarrow className="h-4 w-4" />
              <span>{sortLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  sort === option.value && "font-medium text-midnight-blue"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              <Filter className="h-4 w-4" />
              <span>{statusLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={cn(
                  filterStatus === option.value && "font-medium text-midnight-blue"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Upload Button */}
        <Button
          className="h-10 px-5 text-white border-0"
          style={{
            background:
              "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
          }}
          onClick={onUpload}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </div>
  );
}

