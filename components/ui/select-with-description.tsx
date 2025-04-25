"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectWithDescriptionProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function SelectWithDescription({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  triggerClassName,
}: SelectWithDescriptionProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "h-12 border-gray-300",
          triggerClassName
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {value ? options.find(option => option.value === value)?.label || placeholder : placeholder}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
            "w-[var(--radix-select-trigger-width)]",
            className
          )}
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="p-0 max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex flex-col cursor-default select-none items-start py-2.5 px-6 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  "focus:bg-gray-100 hover:bg-gray-50 data-[state=checked]:bg-gray-100",
                  "border-b last:border-b-0 border-gray-100"
                )}
              >
                <div className="flex items-center w-full">
                  <span className="text-base">{option.label}</span>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <Check className="h-5 w-5" />
                  </SelectPrimitive.ItemIndicator>
                </div>
                {option.description && (
                  <span className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </span>
                )}
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
