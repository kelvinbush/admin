"use client";
import { useState } from "react";
import {
  LoanProductsHeader,
  type LoanProductSort,
} from "./_components/loan-products-header";
import { LoanProductsEmptyState } from "./_components/loan-products-empty-state";

export default function LoanProductsPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<LoanProductSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // TODO: Wire up real data + actions when API is ready
  const total = 0;
  const hasLoanProducts = total > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        <LoanProductsHeader
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
          onAddLoanProduct={() => {
            /* TODO: navigate to create loan product */
          }}
        />

        {!hasLoanProducts && (
          <div className="flex-1 min-h-[320px] rounded-xl border border-dashed border-primaryGrey-200 bg-primaryGrey-25">
            <LoanProductsEmptyState
              onAddLoanProduct={() => {
                /* TODO: navigate to create loan product */
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}