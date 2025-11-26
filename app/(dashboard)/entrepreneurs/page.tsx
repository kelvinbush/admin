"use client";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EntrepreneursHeader, type EntrepreneurSort } from "./_components/entrepreneurs-header";
import {
  EntrepreneursFilters,
  type EntrepreneurFiltersState,
} from "./_components/entrepreneurs-filters";
import { EntrepreneursTabs, type EntrepreneurTab } from "./_components/entrepreneurs-tabs";
import { EntrepreneursTable } from "./_components/entrepreneurs-table";
import { useEntrepreneurs } from "@/lib/api/hooks/sme";
import type { SMEOnboardingStatus } from "@/lib/api/types";

const statCards = [
  { label: "Total SMEs", value: "0", delta: "0%" },
  { label: "Complete Profiles", value: "0", delta: "0%" },
  { label: "Incomplete Profiles", value: "0", delta: "0%" },
  { label: "Pending Activation", value: "0", delta: "0%" },
  { label: "SMEs with Loans", value: "0", delta: "0%" },
];

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

    return {
      page,
      limit,
      onboardingStatus,
      search: searchValue || undefined,
    };
  }, [activeTab, page, limit, searchValue]);

  const { data, isLoading } = useEntrepreneurs(apiFilters);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Apply status filter (tabs already mapped for API, but also consider local filters.status)
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

      // Apply progress filter (client-side) using businessProfileProgress
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

      return true;
    });
  }, [items, filters.status, filters.progress]);

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
            <div className="mt-5 flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary-green/30 bg-primary-green">
                <ArrowUpRight className="h-3.5 w-3.5 text-black" />
              </span>
              <span className="text-primary-green font-medium">{card.delta}</span>
              <span className="text-primaryGrey-200">From last month</span>
            </div>
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
          onDownload={() => {
            /* TODO: hook up download */
          }}
          onAddEntrepreneur={handleAddEntrepreneur}
        />

        <EntrepreneursFilters
          values={filters}
          visible={filtersVisible}
          onValueChange={handleFilterChange}
          onApply={() => {
            /* Filters reactive */
          }}
        />

        <EntrepreneursTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 min-h-[320px]">
          <EntrepreneursTable
            items={filteredItems}
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