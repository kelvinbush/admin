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

export type LoanProductSort =
  | { sortBy: "createdAt"; sortOrder: "asc" | "desc" }
  | { sortBy: "name"; sortOrder: "asc" | "desc" };

type LoanProductsHeaderProps = {
  total: number;
  searchValue?: string;
  filtersVisible: boolean;
  sort: LoanProductSort;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSortChange: (sort: LoanProductSort) => void;
  onToggleFilters: () => void;
  onDownload?: () => void;
  onAddLoanProduct?: () => void;
};

const sortLabels: Record<string, string> = {
  "createdAt-desc": "Newest first",
  "createdAt-asc": "Oldest first",
  "name-asc": "Name (A-Z)",
  "name-desc": "Name (Z-A)",
};

export function LoanProductsHeader({
  total,
  searchValue,
  filtersVisible,
  sort,
  onSearchChange,
  onClearSearch,
  onToggleFilters,
  onDownload,
  onAddLoanProduct,
}: LoanProductsHeaderProps) {
  const sortKey = `${sort.sortBy}-${sort.sortOrder}`;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-2xl font-medium text-midnight-blue">
          {`Loan Products (${total})`}
        </h2>
        <p className="mt-1 text-sm text-primaryGrey-500">
          Configure and manage the loan products available to entrepreneurs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border rounded-md px-3 h-11 w-full lg:w-[320px]">
          <Search className="h-4 w-4 text-primaryGrey-400" />
          <Input
            className="h-10 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-300 bg-transparent"
            placeholder="Search loan products..."
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

        <Button variant="outline" className="h-11 gap-2" type="button">
          <ArrowDownWideNarrow className="h-4 w-4" />
          <span>{sortLabels[sortKey]}</span>
        </Button>

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
          aria-label="Download loan products"
          type="button"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          className="h-11 px-5 text-white border-0"
          style={{
            background:
              "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
          }}
          type="button"
          onClick={onAddLoanProduct}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Loan Product
        </Button>
      </div>
    </div>
  );
}


