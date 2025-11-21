"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
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
  searchable?: boolean;
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
  searchable = false,
}: SelectWithDescriptionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const selectRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0, openAbove: false });
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

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const updatePosition = () => {
        if (selectRef.current) {
          const rect = selectRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const dropdownMaxHeight = 240; // max-h-60 = 240px
          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;
          
          // Check if we should open above or below
          // Open above if there's not enough space below AND more space above
          const openAbove = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;
          
          // For fixed positioning, use viewport coordinates directly
          if (openAbove) {
            // Position above: calculate from top of trigger minus dropdown height
            const calculatedTop = rect.top - dropdownMaxHeight - 4;
            // Ensure it doesn't go above viewport
            const finalTop = Math.max(4, calculatedTop);
            setPosition({
              top: finalTop,
              left: rect.left,
              width: rect.width,
              openAbove: true,
            });
          } else {
            // Position below: normal behavior
            setPosition({
              top: rect.bottom + 4,
              left: rect.left,
              width: rect.width,
              openAbove: false,
            });
          }
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
    setSearchTerm("");
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
              maxHeight: position.openAbove ? `${position.top - 4}px` : '240px',
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
              ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
