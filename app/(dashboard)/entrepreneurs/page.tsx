"use client";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EntrepreneursHeader,
  type EntrepreneurSort,
} from "./_components/entrepreneurs-header";
import {
  EntrepreneursFilters,
  type EntrepreneurFiltersState,
} from "./_components/entrepreneurs-filters";
import { EntrepreneursTabs, type EntrepreneurTab } from "./_components/entrepreneurs-tabs";
import { EntrepreneursTable } from "./_components/entrepreneurs-table";
import { useEntrepreneurs, useEntrepreneursStats } from "@/lib/api/hooks/sme";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import type { SMEOnboardingStatus, UserGroup } from "@/lib/api/types";

export default function EntrepreneursPage() {
  const router = useRouter();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<EntrepreneurSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [filters, setFilters] = useState<EntrepreneurFiltersState>({});
  const [activeTab, setActiveTab] = useState<EntrepreneurTab>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Build filters for API
  const apiFilters = useMemo(() => {
    let onboardingStatus: SMEOnboardingStatus | undefined;
    if (activeTab === "pending") {
      onboardingStatus = "pending_invitation";
    } else if (activeTab === "complete") {
      onboardingStatus = "active";
    }

    // Fetch a large page once; all filtering, sorting & pagination are client-side
    return {
      page: 1,
      limit: 1000,
      onboardingStatus,
    };
  }, [activeTab]);

  const { data, isLoading } = useEntrepreneurs(apiFilters);
  const { data: stats } = useEntrepreneursStats();

  const items = data?.items ?? [];

  // User groups for dynamic filter options
  const { data: userGroupsData } = useUserGroups(undefined, {
    page: 1,
    limit: 1000,
  });

  const userGroupFilterOptions = useMemo(
    () => {
      const groups: UserGroup[] = userGroupsData?.data || [];
      return [
        { label: "All user groups", value: "all" as const },
        ...groups.map((group) => ({
          label: (group as any).name || group.id,
          value: group.id,
        })),
      ];
    },
    [userGroupsData],
  );

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.userGroup ||
          filters.sector ||
          filters.status ||
          filters.progress,
      ),
    [filters],
  );

  // Dynamic sector options based on data
  const sectorFilterOptions = useMemo(
    () => {
      const sectorSet = new Set<string>();
      items.forEach((item) => {
        item.business?.sectors?.forEach((sector) => {
          if (sector) {
            sectorSet.add(sector);
          }
        });
      });

      const sectors = Array.from(sectorSet).sort((a, b) =>
        a.localeCompare(b),
      );

      return [
        { label: "All sectors", value: "all" as const },
        ...sectors.map((sector) => ({
          label: sector,
          value: sector,
        })),
      ];
    },
    [items],
  );

  // Dynamic status options based on data (complete / incomplete / pending)
  const statusFilterOptions = useMemo(
    () => {
      const hasComplete = items.some((item) => item.hasCompleteProfile);
      const hasIncomplete = items.some((item) => !item.hasCompleteProfile);
      const hasPending = items.some((item) => item.hasPendingActivation);

      const options: Array<{
        label: string;
        value: EntrepreneurFiltersState["status"];
      }> = [{ label: "All status", value: "all" }];

      if (hasComplete) {
        options.push({ label: "Complete", value: "complete" });
      }
      if (hasIncomplete) {
        options.push({ label: "Incomplete", value: "incomplete" });
      }
      if (hasPending) {
        options.push({ label: "Pending", value: "pending" });
      }

      return options;
    },
    [items],
  );

  const filteredAndSortedItems = useMemo(() => {
    const term = searchValue.trim().toLowerCase();

    const filtered = items.filter((item) => {
      // Tab-based filters
      if (activeTab === "complete" && !item.hasCompleteProfile) return false;
      if (activeTab === "incomplete" && item.hasCompleteProfile) return false;
      if (activeTab === "pending" && !item.hasPendingActivation) return false;

      // Status filter
      if (filters.status && filters.status !== "all") {
        if (filters.status === "complete" && !item.hasCompleteProfile) {
          return false;
        }
        if (filters.status === "incomplete" && item.hasCompleteProfile) {
          return false;
        }
        if (filters.status === "pending" && !item.hasPendingActivation) {
          return false;
        }
      }

      // User group filter
      if (filters.userGroup && filters.userGroup !== "all") {
        const groups = item.userGroups || [];
        if (!groups.some((g) => g.id === filters.userGroup)) {
          return false;
        }
      }

      // Sector filter
      if (filters.sector && filters.sector !== "all") {
        const sectors = item.business?.sectors || [];
        const sectorTerm = filters.sector.toLowerCase();
        if (!sectors.some((s) => s.toLowerCase().includes(sectorTerm))) {
          return false;
        }
      }

      // Progress filter
      if (filters.progress && filters.progress !== "all") {
        const progress = item.businessProfileProgress ?? 0;
        switch (filters.progress) {
          case "0-25":
            if (!(progress >= 0 && progress < 25)) return false;
            break;
          case "25-50":
            if (!(progress >= 25 && progress < 50)) return false;
            break;
          case "50-75":
            if (!(progress >= 50 && progress < 75)) return false;
            break;
          case "75-100":
            if (!(progress >= 75)) return false;
            break;
        }
      }

      // Text search (registered user + business name)
      if (term) {
        const fullName = `${item.firstName ?? ""} ${item.lastName ?? ""}`
          .trim()
          .toLowerCase();
        const email = item.email.toLowerCase();
        const phone = (item.phone ?? "").toLowerCase();
        const businessName = (item.business?.name ?? "").toLowerCase();

        if (
          !fullName.includes(term) &&
          !email.includes(term) &&
          !phone.includes(term) &&
          !businessName.includes(term)
        ) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort.sortBy === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Sort by business name (fallback to user name)
      const nameA =
        (a.business?.name ||
          `${a.firstName ?? ""} ${a.lastName ?? ""}` ||
          "").toLowerCase();
      const nameB =
        (b.business?.name ||
          `${b.firstName ?? ""} ${b.lastName ?? ""}` ||
          "").toLowerCase();

      if (nameA === nameB) return 0;
      const dir = sort.sortOrder === "asc" ? 1 : -1;
      return nameA > nameB ? dir : -dir;
    });

    return sorted;
  }, [items, activeTab, filters, searchValue, sort]);

  const total = filteredAndSortedItems.length;

  const paginatedItems = useMemo(() => {
    if (total === 0) return [];
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredAndSortedItems.slice(start, end);
  }, [filteredAndSortedItems, page, limit, total]);

  const handleAddEntrepreneur = () => {
    router.push("/entrepreneurs/create");
  };

  const handleFilterChange = <K extends keyof EntrepreneurFiltersState>(
    key: K,
    value?: EntrepreneurFiltersState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const statCards = useMemo(
    () => [
      {
        label: "Total SMEs",
        value: stats ? stats.totalSMEs.value.toString() : "0",
      },
      {
        label: "Complete Profiles",
        value: stats ? stats.completeProfiles.value.toString() : "0",
      },
      {
        label: "Incomplete Profiles",
        value: stats ? stats.incompleteProfiles.value.toString() : "0",
      },
      {
        label: "Pending Activation",
        value: stats ? stats.pendingActivation.value.toString() : "0",
      },
      {
        label: "SMEs with Loans",
        value: stats ? stats.smesWithLoans.value.toString() : "0",
      },
    ],
    [stats],
  );

  const handleDownload = () => {
    if (!filteredAndSortedItems.length) return;

    const headers = [
      "Business Name",
      "Registered User Name",
      "Registered User Email",
      "Registered User Phone",
      "User Groups",
      "B/S Sector",
      "B/S Profile Progress",
      "Status",
      "Created At",
    ];

    const rows = filteredAndSortedItems.map((item) => {
      const businessName = item.business?.name ?? "";
      const registeredUserName = `${item.firstName ?? ""} ${
        item.lastName ?? ""
      }`.trim();
      const userGroups =
        item.userGroups && item.userGroups.length > 0
          ? item.userGroups.map((g) => g.name).join(", ")
          : "";
      const sectors =
        item.business?.sectors && item.business.sectors.length > 0
          ? item.business.sectors.join(", ")
          : "";
      const status = item.onboardingStatus;
      const createdAt = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "";

      return [
        businessName,
        registeredUserName,
        item.email,
        item.phone ?? "",
        userGroups,
        sectors,
        `${Math.round(item.businessProfileProgress ?? 0)}%`,
        status,
        createdAt,
      ];
    });

    const escapeCell = (cell: string) => {
      const s = String(cell);
      const needsEscaping =
        s.includes(",") || s.includes('"') || s.includes("\n");
      const sanitized = s.replace(/"/g, '""');
      return needsEscaping ? `"${sanitized}"` : sanitized;
    };

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `entrepreneurs-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-md bg-primaryGrey-500 text-white px-5 py-3.5 shadow-lg border border-white/5"
          >
            <p className="text-base tracking-tight">{card.label}</p>
            <p className="text-3xl font-semibold mt-4">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        <EntrepreneursHeader
          total={total}
          searchValue={searchValue}
          filtersVisible={filtersVisible}
          sort={sort}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onSortChange={setSort}
          onToggleFilters={() => setFiltersVisible((prev) => !prev)}
          onDownload={handleDownload}
          onAddEntrepreneur={handleAddEntrepreneur}
        />

        <EntrepreneursFilters
          values={filters}
          visible={filtersVisible}
          onValueChange={handleFilterChange}
          userGroupOptions={userGroupFilterOptions}
          sectorOptions={sectorFilterOptions}
          statusOptions={statusFilterOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <EntrepreneursTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 min-h-[320px]">
          <EntrepreneursTable
            items={paginatedItems}
            page={page}
            limit={limit}
            total={total}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}