"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoanApplicationsStatsHeader } from "./_components/loan-applications-stats-header";
import { LoanApplicationsHeader, type LoanApplicationSort } from "./_components/loan-applications-header";
import type { ViewMode } from "./_components/loan-applications-header";
import { LoanApplicationsFilters, type LoanApplicationFiltersState } from "./_components/loan-applications-filters";
import { LoanApplicationsTabs, type LoanApplicationTab } from "./_components/loan-applications-tabs";
import { LoanApplicationsEmptyState } from "./_components/loan-applications-empty-state";
import { LoanApplicationsTable } from "./_components/loan-applications-table";
import { LoanApplicationsBoard } from "./_components/loan-applications-board";
import { CreateLoanApplicationModal } from "./_components/create-loan-application-modal";
import { useLoanApplications, useLoanApplicationStats, type LoanApplicationFilters as ApiFilters } from "@/lib/api/hooks/loan-applications";

// Map tab values to status values
function getStatusFromTab(tab: LoanApplicationTab): string | null {
  switch (tab) {
    case "all":
      return null;
    case "approved":
      return "approved";
    case "pending_approval":
      return "kyc_kyb_verification"; // Map pending_approval to kyc_kyb_verification for now
    case "rejected":
      return "rejected";
    case "disbursed":
      return "disbursed";
    case "cancelled":
      return "cancelled";
    default:
      return null;
  }
}

// Convert UI filters to API filters
function convertFiltersToApi(
  searchValue: string,
  filters: LoanApplicationFiltersState,
  sort: LoanApplicationSort,
  activeTab: LoanApplicationTab,
): ApiFilters {
  const apiFilters: ApiFilters = {};

  if (searchValue) {
    apiFilters.search = searchValue;
  }

  const tabStatus = getStatusFromTab(activeTab);
  if (tabStatus) {
    apiFilters.status = tabStatus as any;
  } else if (filters.status && filters.status !== "all") {
    const statusMap: Record<string, string> = {
      approved: "approved",
      pending_approval: "kyc_kyb_verification",
      rejected: "rejected",
      disbursed: "disbursed",
      cancelled: "cancelled",
    };
    const filterStatus = statusMap[filters.status];
    if (filterStatus) {
      apiFilters.status = filterStatus as any;
    }
  }

  if (filters.loanProduct && filters.loanProduct !== "all") {
    apiFilters.loanProduct = filters.loanProduct;
  }

  if (filters.loanSource && filters.loanSource !== "all") {
    apiFilters.loanSource = filters.loanSource;
  }

  if (filters.applicationDate && filters.applicationDate !== "all") {
    const validDateFilters: readonly ("today" | "this_week" | "this_month" | "last_month" | "this_year")[] = ["today", "this_week", "this_month", "last_month", "this_year"];
    if (validDateFilters.includes(filters.applicationDate as "today" | "this_week" | "this_month" | "last_month" | "this_year")) {
      apiFilters.applicationDate = filters.applicationDate as "today" | "this_week" | "this_month" | "last_month" | "this_year";
    }
  }

  if (sort.sortBy) {
    apiFilters.sortBy = sort.sortBy;
    apiFilters.sortOrder = sort.sortOrder || "desc";
  }

  return apiFilters;
}

export default function LoanApplicationsPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sort, setSort] = useState<LoanApplicationSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [activeTab, setActiveTab] = useState<LoanApplicationTab>("all");
  const [filters, setFilters] = useState<LoanApplicationFiltersState>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const handleFilterChange = <K extends keyof LoanApplicationFiltersState>(
    key: K,
    value?: LoanApplicationFiltersState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  // Convert UI state to API filters
  const apiFilters = useMemo(
    () => convertFiltersToApi(searchValue, filters, sort, activeTab),
    [searchValue, filters, sort, activeTab]
  );

  // Fetch loan applications
  const { data: applicationsData, isLoading: isLoadingApplications, error: applicationsError } = useLoanApplications(
    apiFilters,
    { page, limit }
  );

  // Fetch stats
  const statsFilters = useMemo(() => {
    const { ...statsOnlyFilters } = apiFilters;
    return statsOnlyFilters;
  }, [apiFilters]);

  const { data: statsData } = useLoanApplicationStats(statsFilters);

  // Transform stats data for the header component
  const stats = useMemo(() => {
    if (!statsData) return undefined;

    return [
      {
        label: "Total Applications",
        value: statsData.totalApplications.toLocaleString(),
        delta: statsData.totalApplicationsChange
          ? `${statsData.totalApplicationsChange > 0 ? "+" : ""}${statsData.totalApplicationsChange.toFixed(1)}%`
          : "0%",
      },
      {
        label: "Approved Loans",
        value: statsData.approved.toLocaleString(),
        delta: statsData.approvedChange
          ? `${statsData.approvedChange > 0 ? "+" : ""}${statsData.approvedChange.toFixed(1)}%`
          : "0%",
      },
      {
        label: "Pending Approval",
        value: statsData.pendingApproval.toLocaleString(),
        delta: statsData.pendingApprovalChange
          ? `${statsData.pendingApprovalChange > 0 ? "+" : ""}${statsData.pendingApprovalChange.toFixed(1)}%`
          : "0%",
      },
      {
        label: "Rejected Loans",
        value: statsData.rejected.toLocaleString(),
        delta: statsData.rejectedChange
          ? `${statsData.rejectedChange > 0 ? "+" : ""}${statsData.rejectedChange.toFixed(1)}%`
          : "0%",
      },
      {
        label: "Disbursed Loans",
        value: statsData.disbursed.toLocaleString(),
        delta: statsData.disbursedChange
          ? `${statsData.disbursedChange > 0 ? "+" : ""}${statsData.disbursedChange.toFixed(1)}%`
          : "0%",
      },
      {
        label: "Cancelled Loans",
        value: statsData.cancelled.toLocaleString(),
        delta: statsData.cancelledChange
          ? `${statsData.cancelledChange > 0 ? "+" : ""}${statsData.cancelledChange.toFixed(1)}%`
          : "0%",
      },
    ];
  }, [statsData]);

  const applications = applicationsData?.data || [];
  const total = applicationsData?.pagination?.total || 0;

  // Handle loading and error states
  if (isLoadingApplications && !applicationsData) {
    return (
      <div className="space-y-6">
        <LoanApplicationsStatsHeader stats={stats} />
        <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-primaryGrey-500">Loading loan applications...</p>
        </div>
      </div>
    );
  }

  if (applicationsError) {
    return (
      <div className="space-y-6">
        <LoanApplicationsStatsHeader stats={stats} />
        <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Error loading loan applications. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LoanApplicationsStatsHeader stats={stats} />
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        <LoanApplicationsHeader
          total={total}
          searchValue={searchValue}
          filtersVisible={filtersVisible}
          sort={sort}
          onSearchChange={setSearchValue}
          onClearSearch={() => {
            setSearchValue("");
            setPage(1);
          }}
          onSortChange={setSort}
          onToggleFilters={() => setFiltersVisible((prev) => !prev)}
          onDownload={() => {
            /* TODO: hook up download */
          }}
          onNewApplication={() => {
            setIsCreateModalOpen(true);
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

        {applications.length === 0 ? (
          <LoanApplicationsEmptyState
            onNewApplication={() => {
              setIsCreateModalOpen(true);
            }}
          />
        ) : viewMode === "table" ? (
          <LoanApplicationsTable
            data={applications}
            onRowClick={(application) => {
              router.push(
                `/loan-applications/${application.id}?entrepreneurId=${application.entrepreneurId}&businessId=${application.businessId}`
              );
            }}
          />
        ) : (
          <LoanApplicationsBoard
            data={applications}
            onCardClick={(application) => {
              router.push(
                `/loan-applications/${application.id}?entrepreneurId=${application.entrepreneurId}&businessId=${application.businessId}`
              );
            }}
          />
        )}
      </div>

      <CreateLoanApplicationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={() => {
          // Query invalidation is handled by the hook
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}