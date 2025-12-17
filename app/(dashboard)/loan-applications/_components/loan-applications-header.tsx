"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowDownWideNarrow,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type LoanApplicationSort =
  | { sortBy: "createdAt"; sortOrder: "asc" | "desc" }
  | { sortBy: "applicationNumber"; sortOrder: "asc" | "desc" }
  | { sortBy: "applicantName"; sortOrder: "asc" | "desc" }
  | { sortBy: "amount"; sortOrder: "asc" | "desc" };

export type ViewMode = "table" | "board";

type LoanApplicationsHeaderProps = {
  total: number;
  searchValue?: string;
  filtersVisible: boolean;
  sort: LoanApplicationSort;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSortChange: (sort: LoanApplicationSort) => void;
  onToggleFilters: () => void;
  onDownload?: () => void;
  onNewApplication?: () => void;
};

const sortOptions: LoanApplicationSort[] = [
  { sortBy: "createdAt", sortOrder: "desc" },
  { sortBy: "createdAt", sortOrder: "asc" },
  { sortBy: "applicationNumber", sortOrder: "asc" },
  { sortBy: "applicationNumber", sortOrder: "desc" },
  { sortBy: "applicantName", sortOrder: "asc" },
  { sortBy: "applicantName", sortOrder: "desc" },
  { sortBy: "amount", sortOrder: "desc" },
  { sortBy: "amount", sortOrder: "asc" },
];

const sortLabels: Record<string, string> = {
  "createdAt-desc": "Newest first",
  "createdAt-asc": "Oldest first",
  "applicationNumber-asc": "Application # (A-Z)",
  "applicationNumber-desc": "Application # (Z-A)",
  "applicantName-asc": "Applicant (A-Z)",
  "applicantName-desc": "Applicant (Z-A)",
  "amount-desc": "Amount (High to Low)",
  "amount-asc": "Amount (Low to High)",
};

export function LoanApplicationsHeader({
  total,
  searchValue,
  filtersVisible,
  sort,
  onSearchChange,
  onClearSearch,
  onSortChange,
  onToggleFilters,
  onDownload,
  onNewApplication,
}: LoanApplicationsHeaderProps) {
  const sortKey = `${sort.sortBy}-${sort.sortOrder}`;
  const searchPlaceholder = useMemo(
    () => "Search...",
    [],
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-medium text-midnight-blue">
          {`Loan Applications (${total})`}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border rounded-md px-3 h-11 w-full lg:w-[320px]">
            <Search className="h-4 w-4 text-primaryGrey-400" />
            <Input
              className="h-10 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-300 bg-transparent"
              placeholder={searchPlaceholder}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchValue ? (
              <button
                aria-label="Clear search"
                className="ml-auto text-primaryGrey-400 hover:text-midnight-blue"
                onClick={onClearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 gap-2">
                <ArrowDownWideNarrow className="h-4 w-4" />
                <span>Sort by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortOptions.map((option) => {
                const key = `${option.sortBy}-${option.sortOrder}`;
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onSortChange(option)}
                    className={cn(
                      key === sortKey && "font-medium text-midnight-blue",
                    )}
                  >
                    {sortLabels[key]}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-11 gap-2 border-primaryGrey-100 text-primaryGrey-500",
              filtersVisible && "bg-primaryGrey-50 text-midnight-blue",
            )}
            onClick={onToggleFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersVisible ? "Hide Filters" : "Show Filters"}
          </Button>

          <Button
            variant="outline"
            className="h-11 w-11 p-0 justify-center"
            onClick={onDownload}
            aria-label="Download loan applications"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            className="h-11 px-5 text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
            }}
            onClick={onNewApplication}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
    </div>
  );
}
