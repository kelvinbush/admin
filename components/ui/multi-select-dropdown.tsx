"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  error?: boolean;
  searchable?: boolean;
  maxDisplay?: number;
}

export function MultiSelectDropdown({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options",
  disabled = false,
  className,
  triggerClassName,
  error = false,
  searchable = true,
  maxDisplay = 2,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const selectRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });

  const selectedOptions = React.useMemo(() => {
    return options.filter((opt) => value.includes(opt.value));
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.description?.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const updatePosition = () => {
        if (selectRef.current) {
          const rect = selectRef.current.getBoundingClientRect();
          // For fixed positioning, use viewport coordinates directly
          setPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
          });
        }
      };
      
      // Update position immediately
      updatePosition();
      
      // Update on scroll and resize
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
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
        setSearchTerm("");
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
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  };

  const displayText = React.useMemo(() => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    if (selectedOptions.length <= maxDisplay) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primaryGrey-100 text-primaryGrey-700 text-xs rounded-md"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemoveTag(opt.value, e)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      );
    }
    return (
      <span className="text-sm">
        {selectedOptions.length} selected
      </span>
    );
  }, [selectedOptions, placeholder, maxDisplay]);

  return (
    <div className="relative" ref={selectRef}>
      {/* Select Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "border-gray-300",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          triggerClassName
        )}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="multi-select-dropdown"
      >
        <div className="flex-1 min-w-0">{displayText}</div>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform flex-shrink-0 ml-2",
            isOpen && "transform rotate-180"
          )}
        />
      </div>

      {/* Dropdown - Rendered via Portal */}
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            id="multi-select-dropdown"
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
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primaryGrey-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-primaryGrey-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-green"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto p-0">
              {filteredOptions.length === 0 ? (
                <div className="py-4 px-6 text-sm text-primaryGrey-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleToggle(option.value)}
                      className={cn(
                        "relative flex items-center cursor-pointer select-none py-2 px-6 text-sm outline-none",
                        "hover:bg-gray-50",
                        isSelected && "bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-4 h-4 border-2 rounded mr-3 flex items-center justify-center",
                          isSelected
                            ? "bg-primary-green border-primary-green"
                            : "border-primaryGrey-300"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-primaryGrey-400 mt-0.5">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

