"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CurrencyOption {
  value: string;
  label: string;
  description: string;
  flag: string;
}

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: CurrencyOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CurrencySelect({
  value,
  onValueChange,
  options,
  placeholder = "Select currency",
  error = false,
  disabled = false,
  className,
}: CurrencySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-9 text-sm",
          error ? "border-red-500" : "",
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value && options.find(option => option.value === value) ? (
            <div className="flex items-center">
              <span className="mr-2">{options.find(option => option.value === value)?.flag}</span>
              <span>{value}</span>
            </div>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="flex items-center py-2"
          >
            <div className="flex items-center">
              <span className="mr-2 text-base">{option.flag}</span>
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
