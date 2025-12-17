"use client";

import { useState } from "react";
import { LoanApplicationsStatsHeader } from "./_components/loan-applications-stats-header";
import { LoanApplicationsHeader, type LoanApplicationSort } from "./_components/loan-applications-header";
import type { ViewMode } from "./_components/loan-applications-header";
import { LoanApplicationsFilters, type LoanApplicationFiltersState } from "./_components/loan-applications-filters";
import { LoanApplicationsTabs, type LoanApplicationTab } from "./_components/loan-applications-tabs";
import { LoanApplicationsEmptyState } from "./_components/loan-applications-empty-state";
import { LoanApplicationsTable } from "./_components/loan-applications-table";
import { LoanApplicationsBoard } from "./_components/loan-applications-board";

export default function LoanApplicationsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sort, setSort] = useState<LoanApplicationSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [activeTab, setActiveTab] = useState<LoanApplicationTab>("all");
  const [filters, setFilters] = useState<LoanApplicationFiltersState>({});
  const total = 0; // Dummy data

  const handleFilterChange = <K extends keyof LoanApplicationFiltersState>(
    key: K,
    value?: LoanApplicationFiltersState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      <LoanApplicationsStatsHeader />
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        <LoanApplicationsHeader
          total={total}
          searchValue={searchValue}
          filtersVisible={filtersVisible}
          sort={sort}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onSortChange={setSort}
          onToggleFilters={() => setFiltersVisible((prev) => !prev)}
          onDownload={() => {
            /* TODO: hook up download */
          }}
          onNewApplication={() => {
            /* TODO: hook up new application */
          }}
        />

        <LoanApplicationsFilters
          values={filters}
          visible={filtersVisible}
          onValueChange={handleFilterChange}
          onApply={() => {
            /* Filters reactive */
          }}
          onClear={handleClearFilters}
        />

        <LoanApplicationsTabs
          activeTab={activeTab}
          viewMode={viewMode}
          onTabChange={setActiveTab}
          onViewModeChange={setViewMode}
        />

        {viewMode === "table" ? (
          <LoanApplicationsTable
            onRowClick={(application) => {
              /* TODO: navigate to application details */
              console.log("Clicked application:", application);
            }}
          />
        ) : (
          <LoanApplicationsBoard
            onCardClick={(application) => {
              /* TODO: navigate to application details */
              console.log("Clicked application:", application);
            }}
          />
        )}
      </div>
    </div>
  );
}