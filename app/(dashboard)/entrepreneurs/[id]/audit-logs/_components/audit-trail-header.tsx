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
import { Search, X, ArrowDownWideNarrow, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "date-asc" | "date-desc";
type FilterUser = "all" | string;

interface AuditTrailHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterUser: FilterUser;
  onFilterChange: (user: FilterUser) => void;
  availableUsers: { id: string; name: string; email: string }[];
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
];

export function AuditTrailHeader({
  searchValue,
  onSearchChange,
  onClearSearch,
  sort,
  onSortChange,
  filterUser,
  onFilterChange,
  availableUsers,
}: AuditTrailHeaderProps) {
  const sortLabel = sortOptions.find((opt) => opt.value === sort)?.label || "Sort by";
  const selectedUser = availableUsers.find((u) => u.id === filterUser);
  const userLabel = selectedUser ? selectedUser.name : "Filter user";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search */}
      <div className="flex items-center gap-2 border rounded-md px-3 h-10 w-full sm:w-[320px]">
        <Search className="h-4 w-4 text-primaryGrey-400 flex-shrink-0" />
        <Input
          className="h-9 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-300 bg-transparent"
          placeholder="Search..."
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

      {/* Filters */}
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

        {/* Filter User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              <Filter className="h-4 w-4" />
              <span>{userLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => onFilterChange("all")}
              className={cn(
                filterUser === "all" && "font-medium text-midnight-blue"
              )}
            >
              All users
            </DropdownMenuItem>
            {availableUsers.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => onFilterChange(user.id)}
                className={cn(
                  filterUser === user.id && "font-medium text-midnight-blue"
                )}
              >
                {user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

