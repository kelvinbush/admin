"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type InternalUserFiltersState = {
  role?: "super-admin" | "admin" | "member" | "all";
  status?: "pending" | "active" | "inactive" | "all";
  createdAt?: "24h" | "7d" | "30d" | "90d" | "year" | "all";
};

type InternalUsersFiltersProps = {
  values: InternalUserFiltersState;
  visible?: boolean;
  onValueChange: <K extends keyof InternalUserFiltersState>(
    key: K,
    value?: InternalUserFiltersState[K],
  ) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
};

const roleOptions: Array<{
  label: string;
  value: InternalUserFiltersState["role"];
}> = [
  { label: "All roles", value: "all" },
  { label: "Super admin", value: "super-admin" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
];

const statusOptions: Array<{
  label: string;
  value: InternalUserFiltersState["status"];
}> = [
  { label: "All status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

const createdAtOptions: Array<{
  label: string;
  value: InternalUserFiltersState["createdAt"];
}> = [
  { label: "Any time", value: "all" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This year", value: "year" },
];

export function InternalUsersFilters({
  values,
  visible = true,
  onValueChange,
  hasActiveFilters = false,
  onClearFilters,
}: InternalUsersFiltersProps) {
  if (!visible) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-3 items-start border-t pt-4">
        <FilterSelect
          label="ROLE"
          placeholder="ROLE"
          value={values.role}
          options={roleOptions}
          onChange={(value) => onValueChange("role", value)}
        />
        <FilterSelect
          label="STATUS"
          placeholder="STATUS"
          value={values.status}
          options={statusOptions}
          onChange={(value) => onValueChange("status", value)}
        />
        <FilterSelect
          label="CREATED AT"
          placeholder="CREATED AT"
          value={values.createdAt}
          options={createdAtOptions}
          onChange={(value) => onValueChange("createdAt", value)}
        />
        {hasActiveFilters && onClearFilters && (
        <div className="flex items-stretch">
          <Button
            type="button"
              variant="outline"
              className="w-full h-10 border-primaryGrey-300 text-midnight-blue uppercase tracking-[0.08em]"
              onClick={onClearFilters}
          >
              Clear filters
          </Button>
        </div>
        )}
      </div>
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
  label,
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as T)}>
      <SelectTrigger
        className={cn(
          "h-10 border-gray-300 text-left text-sm uppercase tracking-[0.08em] text-midnight-blue w-max px-8",
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value ? undefined : label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.label} value={option.value as string}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
