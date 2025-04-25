"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputWithDropdownProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: { label: string; value: string }[];
  dropdownValue: string;
  onDropdownValueChange: (value: string) => void;
  dropdownPlaceholder?: string;
  className?: string;
  error?: boolean;
}

const InputWithDropdown = React.forwardRef<
  HTMLInputElement,
  InputWithDropdownProps
>(
  (
    {
      className,
      options,
      dropdownValue = options[0]?.value || "", // Default to first option if undefined
      onDropdownValueChange,
      dropdownPlaceholder = "Select",
      error,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Find the selected option label
    const selectedOption = options.find(option => option.value === dropdownValue);
    const displayValue = selectedOption ? selectedOption.label : dropdownPlaceholder;

    return (
      <div className={cn("flex w-full", className)}>
        <div className="relative flex-grow">
          <input
            className={cn(
              "flex h-9 w-full px-3 py-1 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-ring text-base shadow-sm transition-colors",
              error ? "border-red-500" : "border-input",
              "rounded-r-none border-r-0"
            )}
            ref={ref}
            {...props}
          />
        </div>
        <div className="w-[100px] relative" ref={dropdownRef}>
          <button
            type="button"
            className={cn(
              "w-full h-9 flex items-center justify-between px-3 py-1 border rounded-r-md",
              error ? "border-red-500" : "border-input",
              "rounded-l-none border-l-0 bg-primaryGrey-50 text-sm"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{displayValue}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="px-3 py-2 cursor-pointer hover:bg-primaryGrey-50 text-sm"
                  onClick={() => {
                    onDropdownValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputWithDropdown.displayName = "InputWithDropdown";

export { InputWithDropdown };
