"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type EntrepreneurFiltersState = {
  userGroup?: string | "all";
  sector?: string | "all";
  status?: "all" | "complete" | "incomplete" | "pending";
  progress?: "all" | "0-25" | "25-50" | "50-75" | "75-100";
};

type EntrepreneursFiltersProps = {
  values: EntrepreneurFiltersState;
  visible?: boolean;
  onValueChange: <K extends keyof EntrepreneurFiltersState>(
    key: K,
    value?: EntrepreneurFiltersState[K],
  ) => void;
  userGroupOptions?: Array<{
    label: string;
    value: string | "all";
  }>;
  sectorOptions?: Array<{
    label: string;
    value: string | "all";
  }>;
  statusOptions?: Array<{
    label: string;
    value: EntrepreneurFiltersState["status"];
  }>;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
};

const defaultUserGroupOptions: Array<{
  label: string;
  value: EntrepreneurFiltersState["userGroup"];
}> = [{ label: "All user groups", value: "all" }];

const defaultSectorOptions: Array<{
  label: string;
  value: EntrepreneurFiltersState["sector"];
}> = [{ label: "All sectors", value: "all" }];

const defaultStatusOptions: Array<{
  label: string;
  value: EntrepreneurFiltersState["status"];
}> = [
  { label: "All status", value: "all" },
  { label: "Complete", value: "complete" },
  { label: "Incomplete", value: "incomplete" },
  { label: "Pending", value: "pending" },
];

const progressOptions: Array<{
  label: string;
  value: EntrepreneurFiltersState["progress"];
}> = [
  { label: "All progress", value: "all" },
  { label: "0 - 25%", value: "0-25" },
  { label: "25 - 50%", value: "25-50" },
  { label: "50 - 75%", value: "50-75" },
  { label: "75 - 100%", value: "75-100" },
];

export function EntrepreneursFilters({
  values,
  visible = true,
  onValueChange,
  userGroupOptions,
  sectorOptions,
  statusOptions,
  hasActiveFilters,
  onClearFilters,
}: EntrepreneursFiltersProps) {
  if (!visible) return null;

  const effectiveUserGroupOptions =
    userGroupOptions && userGroupOptions.length > 0
      ? userGroupOptions
      : defaultUserGroupOptions;

  const effectiveSectorOptions =
    sectorOptions && sectorOptions.length > 0
      ? sectorOptions
      : defaultSectorOptions;

  const effectiveStatusOptions =
    statusOptions && statusOptions.length > 0
      ? statusOptions
      : defaultStatusOptions;

  return (
    <div className="space-y-3 border-t pt-4">
      <div className="flex flex-wrap gap-3">
        <FilterSelect
          label="USER GROUP"
          placeholder="USER GROUP"
          value={values.userGroup}
          options={effectiveUserGroupOptions}
          onChange={(value) => onValueChange("userGroup", value)}
        />
        <FilterSelect
          label="SECTOR"
          placeholder="SECTOR"
          value={values.sector}
          options={effectiveSectorOptions}
          onChange={(value) => onValueChange("sector", value)}
        />
        <FilterSelect
          label="STATUS"
          placeholder="STATUS"
          value={values.status}
          options={effectiveStatusOptions}
          onChange={(value) => onValueChange("status", value)}
        />
        <FilterSelect
          label="B/S PROFILE PROGRESS"
          placeholder="B/S PROFILE PROGRESS"
          value={values.progress}
          options={progressOptions}
          onChange={(value) => onValueChange("progress", value)}
        />
      </div>
      {onClearFilters && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasActiveFilters}
            onClick={onClearFilters}
            className="text-xs uppercase tracking-[0.08em]"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

type FilterSelectProps<T extends string | undefined> = {
  label: string;
  placeholder: string;
  value?: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value?: T) => void;
};

function FilterSelect<T extends string | undefined>({
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as T)}>
      <SelectTrigger
        className={cn(
          "h-10 border-gray-300 text-left text-xs uppercase tracking-[0.08em] text-midnight-blue w-max min-w-[180px] px-5",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.label} value={option.value ?? ""}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
