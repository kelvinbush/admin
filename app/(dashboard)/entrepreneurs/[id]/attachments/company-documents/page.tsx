"use client";

import { useState } from "react";
import { AttachmentsHeader } from "../_components/attachments-header";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";
type FilterStatus = "all" | "uploaded" | "pending" | "rejected";

export default function CompanyDocumentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const handleUpload = () => {
    // TODO: Implement upload functionality
    console.log("Upload document");
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <AttachmentsHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onClearSearch={() => setSearchValue("")}
        sort={sort}
        onSortChange={setSort}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onUpload={handleUpload}
      />

      {/* Table - Placeholder for now */}
      <div className="rounded-md bg-white border border-primaryGrey-50 p-8">
        <p className="text-primaryGrey-400">Company Documents table - to be implemented</p>
      </div>
    </div>
  );
}

