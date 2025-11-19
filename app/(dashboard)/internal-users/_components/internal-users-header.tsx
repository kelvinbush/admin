"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo } from "react";

export type InternalUsersSort =
  | { sortBy: "createdAt"; sortOrder: "asc" | "desc" }
  | { sortBy: "name"; sortOrder: "asc" | "desc" };

type InternalUsersHeaderProps = {
  total: number;
  searchValue?: string;
  filtersVisible: boolean;
  sort: InternalUsersSort;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSortChange: (sort: InternalUsersSort) => void;
  onToggleFilters: () => void;
  onDownload?: () => void;
  onAddUser?: () => void;
};

const sortOptions: InternalUsersSort[] = [
  { sortBy: "createdAt", sortOrder: "desc" },
  { sortBy: "createdAt", sortOrder: "asc" },
  { sortBy: "name", sortOrder: "asc" },
  { sortBy: "name", sortOrder: "desc" },
];

const sortLabels: Record<string, string> = {
  "createdAt-desc": "Newest first",
  "createdAt-asc": "Oldest first",
  "name-asc": "Ascending (A-Z)",
  "name-desc": "Descending (Z-A)",
};

export function InternalUsersHeader({
  total,
  searchValue,
  filtersVisible,
  sort,
  onSearchChange,
  onClearSearch,
  onSortChange,
  onToggleFilters,
  onDownload,
  onAddUser,
}: InternalUsersHeaderProps) {
  const sortKey = `${sort.sortBy}-${sort.sortOrder}`;

  const searchPlaceholder = useMemo(() => "Search user...", []);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-medium text-midnight-blue">{`System Users (${total})`}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border rounded-md px-3 h-10 w-full lg:w-[260px]">
          <Search className="h-4 w-4 text-primaryGrey-400" />
          <Input
            className="h-9 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-400"
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
            <Button variant="outline" className="h-10 gap-2">
              <Filter className="h-4 w-4" />
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {sortOptions.map((option) => {
              const key = `${option.sortBy}-${option.sortOrder}`;
              return (
                <DropdownMenuItem key={key} onClick={() => onSortChange(option)}>
                  <span className={cn("flex-1", key === sortKey ? "font-medium text-midnight-blue" : undefined)}>
                    {sortLabels[key]}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 gap-2 border-primaryGrey-100 text-primaryGrey-500",
            filtersVisible && "bg-primaryGrey-50 text-midnight-blue",
          )}
          onClick={onToggleFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </Button>

        <Button
          variant="outline"
          className="h-10 w-10 p-0 justify-center"
          onClick={onDownload}
          aria-label="Download internal users"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          className="h-10 bg-black hover:bg-black/90 text-white"
          onClick={onAddUser}
        >
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button>
      </div>
    </div>
  );
}


