"use client";

import { useState } from "react";
import { Search, Download, X, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  totalUserGroups: number;
  onSearch: (query: string) => void;
  onCreateClick: () => void;
}

export default function Header({
  totalUserGroups,
  onSearch,
  onCreateClick,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl">User groups ({totalUserGroups})</h1>
      
      <div className="flex items-center gap-3">
        <div className="relative w-[230px]">
            <div className="flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  handleSearchChange(e);
                  if (e.target.value === '') {
                    handleClearSearch();
                  }
                }}
                className="pl-10 pr-10 h-10"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-10 w-[120px] justify-between px-3">
              <span>Sort by</span> <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem>Date created (newest)</DropdownMenuItem>
            <DropdownMenuItem>Date created (oldest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          onClick={onCreateClick}
          className="bg-black text-white hover:bg-gray-800 flex items-center gap-1 h-10"
        >
          New User Group <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
