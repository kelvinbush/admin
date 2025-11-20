"use client";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { EntrepreneursHeader, type EntrepreneurSort } from "./_components/entrepreneurs-header";
import {
  EntrepreneursFilters,
  type EntrepreneurFiltersState,
} from "./_components/entrepreneurs-filters";
import { EntrepreneursTabs, type EntrepreneurTab } from "./_components/entrepreneurs-tabs";
import { EntrepreneursEmptyState } from "./_components/entrepreneurs-empty-state";

const statCards = [
  { label: "Total SMEs", value: "0", delta: "0%" },
  { label: "Complete Profiles", value: "0", delta: "0%" },
  { label: "Incomplete Profiles", value: "0", delta: "0%" },
  { label: "Pending Activation", value: "0", delta: "0%" },
  { label: "SMEs with Loans", value: "0", delta: "0%" },
];

export default function EntrepreneursPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<EntrepreneurSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [filters, setFilters] = useState<EntrepreneurFiltersState>({});
  const [activeTab, setActiveTab] = useState<EntrepreneurTab>("all");

  const handleFilterChange = <K extends keyof EntrepreneurFiltersState>(
    key: K,
    value?: EntrepreneurFiltersState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
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

      <section className="rounded-2xl bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        <EntrepreneursHeader
          total={0}
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
          onAddEntrepreneur={() => {
            /* TODO: open create modal */
          }}
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
          <EntrepreneursEmptyState
            onAddEntrepreneur={() => {
              /* TODO: open create modal */
            }}
          />
        </div>
      </section>
    </div>
  );
}