"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
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
  error?: boolean;
}

export function SelectWithDescription({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  triggerClassName,
  error = false,
}: SelectWithDescriptionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const selectedOption = options.find(option => option.value === value);

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (option: SelectOption) => {
    onValueChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      {/* Select Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "border-gray-300",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          triggerClassName
        )}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="select-dropdown"
      >
        <span className={!selectedOption ? "text-muted-foreground" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "transform rotate-180")} />
      </div>

      {/* Dropdown - Rendered via Portal */}
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            id="select-dropdown"
            role="listbox"
            className={cn(
              "fixed z-[9999] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-lg animate-in fade-in-80",
              className
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
          >
            <div className="max-h-60 overflow-y-auto p-0">
              {options.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "relative flex flex-col cursor-pointer select-none items-start py-2 px-6 text-sm outline-none",
                    "hover:bg-gray-50",
                    option.value === value && "bg-gray-100",
                    "border-b last:border-b-0 border-gray-100"
                  )}
                >
                  <div className="flex items-center w-full">
                    <span className="text-sm">{option.label}</span>
                    {option.value === value && (
                      <span className="ml-auto">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <span className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
