"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoanApplicationFiltersState = {
  loanProduct?: string;
  status?: string;
  loanProvider?: string;
  loanSource?: string;
  applicationDate?: string;
};

type LoanApplicationsFiltersProps = {
  values: LoanApplicationFiltersState;
  visible?: boolean;
  onValueChange: <K extends keyof LoanApplicationFiltersState>(
    key: K,
    value?: LoanApplicationFiltersState[K],
  ) => void;
  onApply?: () => void;
  onClear?: () => void;
};

// Dummy options - will be replaced with real data later
const loanProductOptions = [
  { label: "All loan products", value: "all" },
  { label: "Product A", value: "product-a" },
  { label: "Product B", value: "product-b" },
];

const statusOptions = [
  { label: "All status", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending Approval", value: "pending_approval" },
  { label: "Rejected", value: "rejected" },
  { label: "Disbursed", value: "disbursed" },
  { label: "Cancelled", value: "cancelled" },
];

const loanProviderOptions = [
  { label: "All providers", value: "all" },
  { label: "Provider A", value: "provider-a" },
  { label: "Provider B", value: "provider-b" },
];

const loanSourceOptions = [
  { label: "All sources", value: "all" },
  { label: "Source A", value: "source-a" },
  { label: "Source B", value: "source-b" },
];

const applicationDateOptions = [
  { label: "All dates", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "This Year", value: "this_year" },
];

export function LoanApplicationsFilters({
  values,
  visible = true,
  onValueChange,
  onApply,
  onClear,
}: LoanApplicationsFiltersProps) {
  if (!visible) return null;

  return (
    <div className="space-y-3 border-t pt-4">
      <div className="flex items-center gap-3 flex-wrap">
        <SlidersHorizontal className="h-5 w-5 text-primaryGrey-400" />
        <FilterSelect
          label="LOAN PRODUCT"
          placeholder="LOAN PRODUCT"
          value={values.loanProduct}
          options={loanProductOptions}
          onChange={(value) => onValueChange("loanProduct", value)}
        />
        <FilterSelect
          label="STATUS"
          placeholder="STATUS"
          value={values.status}
          options={statusOptions}
          onChange={(value) => onValueChange("status", value)}
        />
        <FilterSelect
          label="LOAN PROVIDER"
          placeholder="LOAN PROVIDER"
          value={values.loanProvider}
          options={loanProviderOptions}
          onChange={(value) => onValueChange("loanProvider", value)}
        />
        <FilterSelect
          label="LOAN SOURCE"
          placeholder="LOAN SOURCE"
          value={values.loanSource}
          options={loanSourceOptions}
          onChange={(value) => onValueChange("loanSource", value)}
        />
        <FilterSelect
          label="APPLICATION DATE"
          placeholder="APPLICATION DATE"
          value={values.applicationDate}
          options={applicationDateOptions}
          onChange={(value) => onValueChange("applicationDate", value)}
        />
        <div className="flex items-stretch gap-2">
          <Button
            type="button"
            className="h-10 px-8 bg-primary-green text-white hover:bg-primary-green/90 uppercase tracking-[0.08em]"
            onClick={onApply}
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-8 border-primaryGrey-300 text-midnight-blue uppercase tracking-[0.08em]"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

type FilterSelectProps<T extends string | undefined> = {
  label: string;
  placeholder: string;
  value?: T;
  options: Array<{ label: string; value: string }>;
  onChange: (value?: T) => void;
};

function FilterSelect<T extends string | undefined>({
  label,
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange((val === "all" ? undefined : val) as T)}
    >
      <SelectTrigger
        className={cn(
          "h-10 border-gray-300 text-left text-xs uppercase tracking-[0.08em] text-midnight-blue w-max min-w-[180px] px-5",
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value ? undefined : label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.label} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
