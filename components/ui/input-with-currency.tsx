"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface CurrencyOption {
  code: string;
  value: string;
  flag: string;
}

const currencies: CurrencyOption[] = [
  // Major World Currencies
  { code: "USD", value: "USD", flag: "🇺🇸" },
  { code: "EUR", value: "EUR", flag: "🇪🇺" },
  { code: "GBP", value: "GBP", flag: "🇬🇧" },
  { code: "JPY", value: "JPY", flag: "🇯🇵" },
  { code: "CNY", value: "CNY", flag: "🇨🇳" },
  { code: "INR", value: "INR", flag: "🇮🇳" },
  { code: "AUD", value: "AUD", flag: "🇦🇺" },
  { code: "CAD", value: "CAD", flag: "🇨🇦" },
  { code: "CHF", value: "CHF", flag: "🇨🇭" },
  { code: "NZD", value: "NZD", flag: "🇳🇿" },
  { code: "SGD", value: "SGD", flag: "🇸🇬" },
  { code: "HKD", value: "HKD", flag: "🇭🇰" },
  { code: "AED", value: "AED", flag: "🇦🇪" },
  { code: "SAR", value: "SAR", flag: "🇸🇦" },
  // East African Currencies
  { code: "KES", value: "KES", flag: "🇰🇪" },
  { code: "UGX", value: "UGX", flag: "🇺🇬" },
  { code: "TZS", value: "TZS", flag: "🇹🇿" },
  { code: "ETB", value: "ETB", flag: "🇪🇹" },
  { code: "RWF", value: "RWF", flag: "🇷🇼" },
  { code: "BIF", value: "BIF", flag: "🇧🇮" },
  { code: "DJF", value: "DJF", flag: "🇩🇯" },
  { code: "SSP", value: "SSP", flag: "🇸🇸" },
  // West African Currencies
  { code: "NGN", value: "NGN", flag: "🇳🇬" },
  { code: "GHS", value: "GHS", flag: "🇬🇭" },
  { code: "XOF", value: "XOF", flag: "🌍" }, // West African CFA franc
  { code: "GMD", value: "GMD", flag: "🇬🇲" },
  { code: "GNF", value: "GNF", flag: "🇬🇳" },
  { code: "LRD", value: "LRD", flag: "🇱🇷" },
  { code: "SLL", value: "SLL", flag: "🇸🇱" },
  // Central & Southern African Currencies
  { code: "ZAR", value: "ZAR", flag: "🇿🇦" },
  { code: "XAF", value: "XAF", flag: "🌍" }, // Central African CFA franc
  { code: "AOA", value: "AOA", flag: "🇦🇴" },
  { code: "BWP", value: "BWP", flag: "🇧🇼" },
  { code: "CDF", value: "CDF", flag: "🇨🇩" },
  { code: "MZN", value: "MZN", flag: "🇲🇿" },
  { code: "MWK", value: "MWK", flag: "🇲🇼" },
  { code: "ZMW", value: "ZMW", flag: "🇿🇲" },
  { code: "MGA", value: "MGA", flag: "🇲🇬" },
  { code: "MUR", value: "MUR", flag: "🇲🇺" },
  { code: "SCR", value: "SCR", flag: "🇸🇨" },
  { code: "SZL", value: "SZL", flag: "🇸🇿" },
  { code: "LSL", value: "LSL", flag: "🇱🇸" },
  { code: "NAD", value: "NAD", flag: "🇳🇦" },
  // North African & Middle East
  { code: "EGP", value: "EGP", flag: "🇪🇬" },
  { code: "MAD", value: "MAD", flag: "🇲🇦" },
  { code: "TND", value: "TND", flag: "🇹🇳" },
  { code: "DZD", value: "DZD", flag: "🇩🇿" },
  { code: "LYD", value: "LYD", flag: "🇱🇾" },
  { code: "SDG", value: "SDG", flag: "🇸🇩" },
  // Other Major Currencies
  { code: "BRL", value: "BRL", flag: "🇧🇷" },
  { code: "MXN", value: "MXN", flag: "🇲🇽" },
  { code: "ARS", value: "ARS", flag: "🇦🇷" },
  { code: "CLP", value: "CLP", flag: "🇨🇱" },
  { code: "COP", value: "COP", flag: "🇨🇴" },
  { code: "PEN", value: "PEN", flag: "🇵🇪" },
  { code: "KRW", value: "KRW", flag: "🇰🇷" },
  { code: "THB", value: "THB", flag: "🇹🇭" },
  { code: "MYR", value: "MYR", flag: "🇲🇾" },
  { code: "IDR", value: "IDR", flag: "🇮🇩" },
  { code: "PHP", value: "PHP", flag: "🇵🇭" },
  { code: "VND", value: "VND", flag: "🇻🇳" },
  { code: "TRY", value: "TRY", flag: "🇹🇷" },
  { code: "ILS", value: "ILS", flag: "🇮🇱" },
  { code: "PLN", value: "PLN", flag: "🇵🇱" },
  { code: "SEK", value: "SEK", flag: "🇸🇪" },
  { code: "NOK", value: "NOK", flag: "🇳🇴" },
  { code: "DKK", value: "DKK", flag: "🇩🇰" },
];

interface InputWithCurrencyProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyValue: string;
  onCurrencyValueChange: (value: string) => void;
  currencyPlaceholder?: string;
  className?: string;
  error?: boolean;
}

const InputWithCurrency = React.forwardRef<
  HTMLInputElement,
  InputWithCurrencyProps
>(
  (
    {
      className,
      currencyValue = "USD", // Default to USD if undefined
      onCurrencyValueChange,
      currencyPlaceholder = "Currency",
      error,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0, openAbove: false });

    // Calculate dropdown position
    React.useEffect(() => {
      if (isOpen && triggerRef.current) {
        const updatePosition = () => {
          if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const dropdownMaxHeight = 240;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            const openAbove = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;
            
            if (openAbove) {
              const calculatedTop = rect.top - dropdownMaxHeight - 4;
              const finalTop = Math.max(4, calculatedTop);
              setPosition({
                top: finalTop,
                left: rect.left,
                width: rect.width,
                openAbove: true,
              });
            } else {
              setPosition({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                openAbove: false,
              });
            }
          }
        };
        
        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        
        return () => {
          window.removeEventListener("scroll", updatePosition, true);
          window.removeEventListener("resize", updatePosition);
        };
      }
    }, [isOpen]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // Find the selected currency
    const selectedCurrency = currencies.find(
      (currency) => currency.value === currencyValue,
    );

    const filteredCurrencies = currencies.filter((currency) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    
    return (
      <div className={cn("flex w-full", className)}>
        <div className="relative flex-grow">
          <input
            className={cn(
              "flex h-10 w-full px-3 py-1 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-ring text-sm shadow-sm transition-colors",
              error ? "border-red-500 focus:ring-red-500" : "border-input",
              "rounded-r-none border-r-0"
            )}
            ref={ref}
            {...props}
          />
        </div>
        <div className="w-[120px] relative">
          <button
            type="button"
            ref={triggerRef}
            className={cn(
              "w-full h-10 flex items-center justify-between px-3 py-1 border rounded-r-md",
              error ? "border-red-500" : "border-input",
              "rounded-l-none border-l-0 bg-primaryGrey-50 text-sm cursor-pointer hover:bg-primaryGrey-100 transition-colors"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedCurrency ? (
              <span className="flex items-center">
                <span className="mr-2 text-base">{selectedCurrency.flag}</span>
                <span>{selectedCurrency.code}</span>
              </span>
            ) : (
              <span>{currencyPlaceholder}</span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-4 w-4 transition-transform opacity-50", isOpen ? "rotate-180" : "")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                ref={dropdownRef}
                className="fixed z-[9999] overflow-hidden rounded-md border bg-white shadow-lg animate-in fade-in-80"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  width: `${position.width}px`,
                  maxHeight: position.openAbove ? `${position.top - 4}px` : '240px',
                }}
              >
                <div className="max-h-60 overflow-y-auto p-0">
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-3 py-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search currency..."
                      className="w-full h-8 px-2 text-sm border rounded-md border-primaryGrey-200 focus:outline-none focus:ring-1 focus:ring-primary-green"
                    />
                  </div>
                  {filteredCurrencies.map((currency) => (
                    <div
                      key={currency.code}
                      className="px-3 py-2 cursor-pointer hover:bg-primaryGrey-50 text-sm border-b last:border-b-0 border-gray-100"
                      onClick={() => {
                        onCurrencyValueChange(currency.value);
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex items-center">
                        <span className="mr-2 text-base">{currency.flag}</span>
                        <span>{currency.code}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>
    );
  }
);

InputWithCurrency.displayName = "InputWithCurrency";

export { InputWithCurrency, currencies };
