"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface ModalSelectProps {
  options: ModalSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  searchable?: boolean;
}

export function ModalSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  error = false,
  searchable = false,
}: ModalSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const selectRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm || !searchable) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.description?.toLowerCase().includes(term)
    );
  }, [options, searchTerm, searchable]);

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
        setSearchTerm("");
      }
    };

    if (isOpen) {
      // Use capture phase to catch events before they reach the dialog overlay
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [isOpen]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (option: ModalSelectOption) => {
    onValueChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={selectRef}>
      {/* Select Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "border-gray-300",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={!selectedOption ? "text-muted-foreground" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "transform rotate-180")} />
      </div>

      {/* Dropdown - Rendered inline (not via portal) to avoid z-index issues */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          className={cn(
            "absolute z-[100] mt-1 w-full overflow-hidden rounded-md border bg-white text-popover-foreground shadow-lg",
            className
          )}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primaryGrey-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearchTerm(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  placeholder="Search"
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-primaryGrey-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-green"
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-0">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-6 text-sm text-primaryGrey-400 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}








