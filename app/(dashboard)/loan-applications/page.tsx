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

// Import dummy data from table component (we'll extract it later)
type LoanApplicationStatus =
  | "kyc_kyb_verification"
  | "credit_analysis"
  | "head_of_credit_review"
  | "rejected"
  | "cancelled"
  | "approved"
  | "disbursed";

type LoanApplication = {
  id: string;
  loanId: string;
  loanSource: string;
  businessName: string;
  entrepreneurId: string;
  businessId: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  loanProduct: string;
  loanRequested: number;
  loanTenure: number;
  status: LoanApplicationStatus;
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
};

// Dummy data - same as in table component
const dummyData: LoanApplication[] = [
  {
    id: "1",
    loanId: "LN-48291",
    loanSource: "SME Platform",
    businessName: "DMA Limited",
    entrepreneurId: "ent-001",
    businessId: "biz-001",
    applicant: {
      name: "Robert Mugabe",
      email: "robert.mugabe@gmail.com",
      phone: "+255712345678",
    },
    loanProduct: "LPO Financing",
    loanRequested: 50000,
    loanTenure: 3,
    status: "kyc_kyb_verification",
    createdAt: "2025-01-28",
    createdBy: "Robert Mugabe",
    lastUpdated: "2025-01-28",
  },
  {
    id: "2",
    loanId: "LN-90357",
    loanSource: "Admin Platform",
    businessName: "Duhqa",
    entrepreneurId: "ent-002",
    businessId: "biz-002",
    applicant: {
      name: "Mariame Bamba",
      email: "mariame.bamba@gmail.com",
      phone: "+255712345679",
    },
    loanProduct: "Term Loan",
    loanRequested: 10000,
    loanTenure: 10,
    status: "rejected",
    createdAt: "2025-02-01",
    createdBy: "Mariame Bamba",
    lastUpdated: "2025-02-03",
  },
  {
    id: "3",
    loanId: "LN-12345",
    loanSource: "SME Platform",
    businessName: "Lineter Enterprise Ltd",
    entrepreneurId: "ent-003",
    businessId: "biz-003",
    applicant: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "+255712345680",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 25000,
    loanTenure: 6,
    status: "credit_analysis",
    createdAt: "2025-01-15",
    createdBy: "John Doe",
    lastUpdated: "2025-01-20",
  },
  {
    id: "4",
    loanId: "LN-67890",
    loanSource: "Admin Platform",
    businessName: "Tech Solutions Inc",
    entrepreneurId: "ent-004",
    businessId: "biz-004",
    applicant: {
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      phone: "+255712345681",
    },
    loanProduct: "Asset Financing",
    loanRequested: 75000,
    loanTenure: 12,
    status: "approved",
    createdAt: "2025-01-10",
    createdBy: "Jane Smith",
    lastUpdated: "2025-01-25",
  },
  {
    id: "5",
    loanId: "LN-65938",
    loanSource: "SME Platform",
    businessName: "Green Energy Co",
    entrepreneurId: "ent-005",
    businessId: "biz-005",
    applicant: {
      name: "Cecile Soul",
      email: "cecile.soul@gmail.com",
      phone: "+255712345682",
    },
    loanProduct: "LPO Financing",
    loanRequested: 30000,
    loanTenure: 4,
    status: "head_of_credit_review",
    createdAt: "2025-01-05",
    createdBy: "Cecile Soul",
    lastUpdated: "2025-01-18",
  },
  {
    id: "6",
    loanId: "LN-24680",
    loanSource: "Admin Platform",
    businessName: "Food & Beverage Ltd",
    entrepreneurId: "ent-006",
    businessId: "biz-006",
    applicant: {
      name: "Michael Brown",
      email: "michael.brown@gmail.com",
      phone: "+255712345683",
    },
    loanProduct: "Term Loan",
    loanRequested: 15000,
    loanTenure: 8,
    status: "disbursed",
    createdAt: "2024-12-20",
    createdBy: "Michael Brown",
    lastUpdated: "2025-01-15",
  },
  {
    id: "7",
    loanId: "LN-13579",
    loanSource: "SME Platform",
    businessName: "Retail Solutions",
    entrepreneurId: "ent-007",
    businessId: "biz-007",
    applicant: {
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "+255712345684",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 20000,
    loanTenure: 5,
    status: "cancelled",
    createdAt: "2024-12-15",
    createdBy: "Sarah Johnson",
    lastUpdated: "2025-01-10",
  },
  // Additional data for board view
  {
    id: "8",
    loanId: "LN-11111",
    loanSource: "Admin Platform",
    businessName: "Agribora Ventures Limited",
    entrepreneurId: "ent-008",
    businessId: "biz-008",
    applicant: {
      name: "Alice Johnson",
      email: "alice.johnson@agribora.com",
      phone: "+255712345689",
    },
    loanProduct: "Term Loan",
    loanRequested: 35000,
    loanTenure: 6,
    status: "kyc_kyb_verification",
    createdAt: "2025-01-25",
    createdBy: "Alice Johnson",
    lastUpdated: "2025-01-27",
  },
  {
    id: "9",
    loanId: "LN-22222",
    loanSource: "SME Platform",
    businessName: "TechStart Innovations",
    entrepreneurId: "ent-009",
    businessId: "biz-009",
    applicant: {
      name: "David Kim",
      email: "david.kim@techstart.com",
      phone: "+255712345690",
    },
    loanProduct: "Asset Financing",
    loanRequested: 45000,
    loanTenure: 8,
    status: "credit_analysis",
    createdAt: "2025-01-20",
    createdBy: "David Kim",
    lastUpdated: "2025-01-22",
  },
  {
    id: "10",
    loanId: "LN-33333",
    loanSource: "Admin Platform",
    businessName: "GreenFuture Enterprises",
    entrepreneurId: "ent-010",
    businessId: "biz-010",
    applicant: {
      name: "Emma Wilson",
      email: "emma.wilson@greenfuture.com",
      phone: "+255712345691",
    },
    loanProduct: "Term Loan",
    loanRequested: 40000,
    loanTenure: 12,
    status: "head_of_credit_review",
    createdAt: "2025-01-10",
    createdBy: "Emma Wilson",
    lastUpdated: "2025-01-15",
  },
  {
    id: "11",
    loanId: "LN-44444",
    loanSource: "SME Platform",
    businessName: "Agribora Ventures Limited",
    entrepreneurId: "ent-011",
    businessId: "biz-011",
    applicant: {
      name: "Michael Brown",
      email: "michael.brown@agribora.com",
      phone: "+255712345692",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 28000,
    loanTenure: 5,
    status: "approved",
    createdAt: "2025-01-12",
    createdBy: "Michael Brown",
    lastUpdated: "2025-01-25",
  },
  {
    id: "12",
    loanId: "LN-55555",
    loanSource: "SME Platform",
    businessName: "GreenFuture Enterprises",
    entrepreneurId: "ent-012",
    businessId: "biz-012",
    applicant: {
      name: "Sarah Johnson",
      email: "sarah.johnson@greenfuture.com",
      phone: "+255712345693",
    },
    loanProduct: "Term Loan",
    loanRequested: 15000,
    loanTenure: 6,
    status: "rejected",
    createdAt: "2025-01-08",
    createdBy: "Sarah Johnson",
    lastUpdated: "2025-01-12",
  },
  {
    id: "13",
    loanId: "LN-66666",
    loanSource: "SME Platform",
    businessName: "Kokari Ventures Limited",
    entrepreneurId: "ent-013",
    businessId: "biz-013",
    applicant: {
      name: "Lisa Chen",
      email: "lisa.chen@kokari.com",
      phone: "+255712345694",
    },
    loanProduct: "LPO Financing",
    loanRequested: 32000,
    loanTenure: 4,
    status: "disbursed",
    createdAt: "2024-12-18",
    createdBy: "Lisa Chen",
    lastUpdated: "2025-01-10",
  },
  {
    id: "14",
    loanId: "LN-77777",
    loanSource: "Admin Platform",
    businessName: "InnovateHub Solutions",
    entrepreneurId: "ent-014",
    businessId: "biz-014",
    applicant: {
      name: "James Taylor",
      email: "james.taylor@innovatehub.com",
      phone: "+255712345695",
    },
    loanProduct: "Asset Financing",
    loanRequested: 60000,
    loanTenure: 10,
    status: "disbursed",
    createdAt: "2024-12-15",
    createdBy: "James Taylor",
    lastUpdated: "2025-01-05",
  },
];

// Map tab values to status values
function getStatusFromTab(tab: LoanApplicationTab): LoanApplicationStatus | null {
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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...dummyData];

    // Apply tab filter (status)
    const tabStatus = getStatusFromTab(activeTab);
    if (tabStatus) {
      filtered = filtered.filter((app) => app.status === tabStatus);
    }

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.loanId.toLowerCase().includes(searchLower) ||
          app.businessName.toLowerCase().includes(searchLower) ||
          app.applicant.name.toLowerCase().includes(searchLower) ||
          app.applicant.email.toLowerCase().includes(searchLower) ||
          app.loanProduct.toLowerCase().includes(searchLower) ||
          app.loanSource.toLowerCase().includes(searchLower),
      );
    }

    // Apply filters
    if (filters.status && filters.status !== "all") {
      const statusMap: Record<string, LoanApplicationStatus> = {
        approved: "approved",
        pending_approval: "kyc_kyb_verification",
        rejected: "rejected",
        disbursed: "disbursed",
        cancelled: "cancelled",
      };
      const filterStatus = statusMap[filters.status];
      if (filterStatus) {
        filtered = filtered.filter((app) => app.status === filterStatus);
      }
    }

    if (filters.loanProduct && filters.loanProduct !== "all") {
      filtered = filtered.filter((app) =>
        app.loanProduct.toLowerCase() === filters.loanProduct!.toLowerCase(),
      );
    }

    if (filters.loanSource && filters.loanSource !== "all") {
      filtered = filtered.filter((app) =>
        app.loanSource.toLowerCase() === filters.loanSource!.toLowerCase(),
      );
    }

    // Apply date filter
    if (filters.applicationDate && filters.applicationDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.createdAt);
        switch (filters.applicationDate) {
          case "today":
            return appDate >= today;
          case "this_week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return appDate >= weekAgo;
          case "this_month":
            return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
          case "last_month":
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            return appDate >= lastMonth && appDate <= lastMonthEnd;
          case "this_year":
            return appDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sort.sortBy) {
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "applicationNumber":
          comparison = a.loanId.localeCompare(b.loanId);
          break;
        case "applicantName":
          comparison = a.applicant.name.localeCompare(b.applicant.name);
          break;
        case "amount":
          comparison = a.loanRequested - b.loanRequested;
          break;
      }
      return sort.sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [dummyData, activeTab, searchValue, filters, sort]);

  const total = filteredAndSortedData.length;

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

        {filteredAndSortedData.length === 0 ? (
          <LoanApplicationsEmptyState
            onNewApplication={() => {
              setIsCreateModalOpen(true);
            }}
          />
        ) : viewMode === "table" ? (
          <LoanApplicationsTable
            data={filteredAndSortedData}
            onRowClick={(application) => {
              router.push(
                `/loan-applications/${application.id}?entrepreneurId=${application.entrepreneurId}&businessId=${application.businessId}`
              );
            }}
          />
        ) : (
          <LoanApplicationsBoard
            data={filteredAndSortedData}
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
          // TODO: Refresh loan applications list
          console.log("Loan application created");
        }}
      />
    </div>
  );
}