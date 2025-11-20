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

export type EntrepreneurFiltersState = {
  userGroup?: "all" | "preferred" | "standard";
  sector?: "all" | "agriculture" | "manufacturing" | "services";
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
  onApply?: () => void;
};

const userGroupOptions: Array<{
  label: string;
  value: EntrepreneurFiltersState["userGroup"];
}> = [
  { label: "All user groups", value: "all" },
  { label: "Preferred", value: "preferred" },
  { label: "Standard", value: "standard" },
];

const sectorOptions: Array<{
  label: string;
  value: EntrepreneurFiltersState["sector"];
}> = [
  { label: "All sectors", value: "all" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Services", value: "services" },
];

const statusOptions: Array<{
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
  onApply,
}: EntrepreneursFiltersProps) {
  if (!visible) return null;

  return (
    <div className="space-y-3 border-t pt-4">
      <div className="flex flex-wrap gap-3">
        <FilterSelect
          label="USER GROUP"
          placeholder="USER GROUP"
          value={values.userGroup}
          options={userGroupOptions}
          onChange={(value) => onValueChange("userGroup", value)}
        />
        <FilterSelect
          label="SECTOR"
          placeholder="SECTOR"
          value={values.sector}
          options={sectorOptions}
          onChange={(value) => onValueChange("sector", value)}
        />
        <FilterSelect
          label="STATUS"
          placeholder="STATUS"
          value={values.status}
          options={statusOptions}
          onChange={(value) => onValueChange("status", value)}
        />
        <FilterSelect
          label="B/S PROFILE PROGRESS"
          placeholder="B/S PROFILE PROGRESS"
          value={values.progress}
          options={progressOptions}
          onChange={(value) => onValueChange("progress", value)}
        />
        <div className="flex items-stretch">
          <Button
            type="button"
            className="h-10 px-8 bg-primary-green text-white hover:bg-primary-green/90 uppercase tracking-[0.08em]"
            onClick={onApply}
          >
            Apply
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
          "h-10 border-gray-300 text-left text-xs uppercase tracking-[0.08em] text-midnight-blue w-max min-w-[180px] px-5",
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value ? undefined : label}
        </SelectValue>
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

