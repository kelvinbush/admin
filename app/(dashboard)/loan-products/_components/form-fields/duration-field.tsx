import * as React from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputWithDropdown } from "@/components/ui/input-with-dropdown";

interface DurationFieldProps {
  durationName: string;
  periodName: string;
  label: string;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  onPeriodChange?: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function DurationField({
  durationName,
  periodName,
  label,
  control,
  setValue,
  watch,
  onPeriodChange,
  required = false,
  placeholder = "Enter value",
}: DurationFieldProps) {
  // Watch the period field to ensure it's always up to date
  const periodValue = watch(periodName) || "days";
  return (
    <FormField
      control={control as any}
      name={durationName}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <InputWithDropdown
              placeholder={placeholder}
              {...field}
              options={[
                { label: "days", value: "days" },
                { label: "weeks", value: "weeks" },
                { label: "months", value: "months" },
                { label: "years", value: "years" },
              ]}
              dropdownValue={periodValue}
              onDropdownValueChange={onPeriodChange || ((value) => {
                // Use the setValue function passed as prop
                setValue(periodName, value);
              })}
              error={!!fieldState.error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
