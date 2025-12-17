"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { InputWithCurrency, currencies } from "@/components/ui/input-with-currency";
import { X, Check, Building2, Info, ExternalLink } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface CreateLoanApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

// Dummy business data type (similar to BusinessSearchItem)
interface BusinessItem {
  id: string;
  name: string;
  description?: string;
  sector?: string;
  city?: string;
  country?: string;
  owner: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

// Dummy loan product type
interface LoanProduct {
  id: string;
  name: string;
}

// Dummy data for businesses
const dummyBusinesses: BusinessItem[] = [
  {
    id: "biz-001",
    name: "DMA Solutions Limited",
    description: "Technology solutions provider",
    sector: "Technology",
    city: "Nairobi",
    country: "Kenya",
    owner: {
      firstName: "Robert",
      lastName: "Mugabe",
      email: "robert.mugabe@dma.com",
    },
  },
  {
    id: "biz-002",
    name: "Agribora Ventures Limited",
    description: "Agricultural products and services",
    sector: "Agriculture",
    city: "Kampala",
    country: "Uganda",
    owner: {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@agribora.com",
    },
  },
  {
    id: "biz-003",
    name: "TechStart Innovations",
    description: "Startup incubator and tech consulting",
    sector: "Technology",
    city: "Dar es Salaam",
    country: "Tanzania",
    owner: {
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@techstart.com",
    },
  },
  {
    id: "biz-004",
    name: "GreenFuture Enterprises",
    description: "Sustainable energy solutions",
    sector: "Energy",
    city: "Kigali",
    country: "Rwanda",
    owner: {
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma.wilson@greenfuture.com",
    },
  },
  {
    id: "biz-005",
    name: "Kokari Ventures Limited",
    description: "Trading and distribution",
    sector: "Trade",
    city: "Nairobi",
    country: "Kenya",
    owner: {
      firstName: "Lisa",
      lastName: "Chen",
      email: "lisa.chen@kokari.com",
    },
  },
];

// Dummy loan products
const dummyLoanProducts: LoanProduct[] = [
  { id: "lp-001", name: "Invoice Discount Facility" },
  { id: "lp-002", name: "Term Loan" },
  { id: "lp-003", name: "Asset Financing" },
  { id: "lp-004", name: "LPO Financing" },
  { id: "lp-005", name: "Working Capital Loan" },
];

export function CreateLoanApplicationModal({
  open,
  onOpenChange,
  onCreated,
}: CreateLoanApplicationModalProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(null);
  const [businessSearch, setBusinessSearch] = useState("");
  const [showBusinessSearch, setShowBusinessSearch] = useState(false);
  const [selectedLoanProduct, setSelectedLoanProduct] = useState<LoanProduct | null>(null);
  const [showLoanProductDropdown, setShowLoanProductDropdown] = useState(false);
  const [loanProductSearch, setLoanProductSearch] = useState("");
  const businessSearchRef = useRef<HTMLDivElement>(null);
  const loanProductRef = useRef<HTMLDivElement>(null);
  
  // Funding amount
  const [fundingAmount, setFundingAmount] = useState("10000.00");
  const [fundingCurrency, setFundingCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState("1500000.00");
  const [convertedCurrency, setConvertedCurrency] = useState("KES");
  const [exchangeRate, setExchangeRate] = useState(150.90);
  const [sliderValue, setSliderValue] = useState(10000);
  
  // Repayment period
  const [repaymentPeriod, setRepaymentPeriod] = useState("3");
  
  // Intended use of funds
  const [intendedUse, setIntendedUse] = useState("");
  
  // Interest rate
  const [interestRate, setInterestRate] = useState("10");

  const debouncedBusinessSearch = useDebounce(businessSearch, 300);
  const debouncedLoanProductSearch = useDebounce(loanProductSearch, 300);

  // Filter businesses
  const filteredBusinesses = useMemo(() => {
    if (!debouncedBusinessSearch) return [];
    const searchLower = debouncedBusinessSearch.toLowerCase();
    return dummyBusinesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchLower) ||
        business.owner.email.toLowerCase().includes(searchLower) ||
        (business.owner.firstName && business.owner.firstName.toLowerCase().includes(searchLower)) ||
        (business.owner.lastName && business.owner.lastName.toLowerCase().includes(searchLower))
    );
  }, [debouncedBusinessSearch]);

  // Filter loan products
  const filteredLoanProducts = useMemo(() => {
    if (!debouncedLoanProductSearch) return dummyLoanProducts;
    const searchLower = debouncedLoanProductSearch.toLowerCase();
    return dummyLoanProducts.filter((product) =>
      product.name.toLowerCase().includes(searchLower)
    );
  }, [debouncedLoanProductSearch]);

  // Calculate converted amount when funding amount, currency, or exchange rate changes
  useEffect(() => {
    const amount = parseFloat(fundingAmount) || 0;
    const converted = amount * exchangeRate;
    setConvertedAmount(converted.toFixed(2));
  }, [fundingAmount, exchangeRate, fundingCurrency, convertedCurrency]);

  // Update slider when funding amount changes manually
  useEffect(() => {
    const amount = parseFloat(fundingAmount) || 0;
    if (amount >= 10000 && amount <= 50000) {
      setSliderValue(amount);
    }
  }, [fundingAmount]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (businessSearchRef.current && !businessSearchRef.current.contains(event.target as Node)) {
        setShowBusinessSearch(false);
      }
      if (loanProductRef.current && !loanProductRef.current.contains(event.target as Node)) {
        setShowLoanProductDropdown(false);
      }
    };

    if (showBusinessSearch || showLoanProductDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBusinessSearch, showLoanProductDropdown]);

  // Update funding amount when slider changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setFundingAmount(value.toFixed(2));
  };

  const getOwnerName = (business: BusinessItem) => {
    if (business.owner.firstName && business.owner.lastName) {
      return `${business.owner.firstName} ${business.owner.lastName}`;
    }
    return business.owner.email;
  };

  const handleNewLoanProduct = () => {
    window.open("/loan-products/create", "_blank");
  };

  const handleSubmit = () => {
    const formData = {
      businessId: selectedBusiness?.id,
      businessName: selectedBusiness?.name,
      entrepreneurId: selectedBusiness?.id.replace("biz-", "ent-"), // Dummy mapping
      loanProductId: selectedLoanProduct?.id,
      loanProductName: selectedLoanProduct?.name,
      fundingAmount: parseFloat(fundingAmount),
      fundingCurrency,
      convertedAmount: parseFloat(convertedAmount),
      convertedCurrency,
      exchangeRate,
      repaymentPeriod: parseInt(repaymentPeriod),
      intendedUseOfFunds: intendedUse,
      interestRate: parseFloat(interestRate),
    };

    console.log("Loan Application Form Data:", formData);
    
    // TODO: Replace with actual API call
    // await createLoanApplication(formData);
    
    // Reset form
    resetForm();
    
    onOpenChange(false);
    if (onCreated) onCreated();
  };

  const resetForm = () => {
    setSelectedBusiness(null);
    setBusinessSearch("");
    setShowBusinessSearch(false);
    setSelectedLoanProduct(null);
    setLoanProductSearch("");
    setShowLoanProductDropdown(false);
    setFundingAmount("10000.00");
    setSliderValue(10000);
    setRepaymentPeriod("3");
    setIntendedUse("");
    setInterestRate("10");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const isFormValid = selectedBusiness && selectedLoanProduct && fundingAmount && repaymentPeriod && intendedUse && interestRate;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">
              Create loan application
            </DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Fill in the details below to create a new loan application.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Select SME */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                Select SME <span className="text-red-500">*</span>
              </Label>
              <div className="relative" ref={businessSearchRef}>
                <button
                  type="button"
                  onClick={() => setShowBusinessSearch(!showBusinessSearch)}
                  className="w-full h-10 px-3 text-left border rounded-md bg-white flex items-center justify-between text-sm"
                >
                  <span className={selectedBusiness ? "text-midnight-blue" : "text-primaryGrey-400"}>
                    {selectedBusiness ? selectedBusiness.name : "Select entrepreneur"}
                  </span>
                  {selectedBusiness ? (
                    <X
                      className="h-4 w-4 text-primaryGrey-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBusiness(null);
                      }}
                    />
                  ) : null}
                </button>

                {showBusinessSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-auto">
                    <div className="p-3 border-b">
                      <Input
                        value={businessSearch}
                        onChange={(e) => {
                          setBusinessSearch(e.target.value);
                        }}
                        placeholder="Search by business name or owner email..."
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {filteredBusinesses.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                          {businessSearch ? "No businesses found" : "Start typing to search"}
                        </div>
                      ) : (
                        filteredBusinesses.map((business) => (
                          <button
                            key={business.id}
                            type="button"
                            onClick={() => {
                              setSelectedBusiness(business);
                              setShowBusinessSearch(false);
                              setBusinessSearch("");
                            }}
                            className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-primaryGrey-50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Building2 className="h-4 w-4 text-primaryGrey-400 flex-shrink-0" />
                                  <span className="text-sm font-medium text-midnight-blue truncate">
                                    {business.name}
                                  </span>
                                </div>
                                {business.description && (
                                  <p className="text-xs text-primaryGrey-500 mb-2 line-clamp-1">
                                    {business.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 flex-wrap">
                                  {business.sector && (
                                    <Badge variant="outline" className="text-xs">
                                      {business.sector}
                                    </Badge>
                                  )}
                                  {business.city && business.country && (
                                    <span className="text-xs text-primaryGrey-500">
                                      {business.city}, {business.country}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2">
                                  <p className="text-xs text-primaryGrey-500">
                                    Owner: <span className="text-midnight-blue">{getOwnerName(business)}</span>
                                    {business.owner.email && (
                                      <span className="ml-2">({business.owner.email})</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Product */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                Loan product <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1" ref={loanProductRef}>
                  <button
                    type="button"
                    onClick={() => setShowLoanProductDropdown(!showLoanProductDropdown)}
                    className="w-full h-10 px-3 text-left border rounded-md bg-white flex items-center justify-between text-sm"
                  >
                    <span className={selectedLoanProduct ? "text-midnight-blue" : "text-primaryGrey-400"}>
                      {selectedLoanProduct ? selectedLoanProduct.name : "Select loan product"}
                    </span>
                    {selectedLoanProduct ? (
                      <X
                        className="h-4 w-4 text-primaryGrey-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLoanProduct(null);
                        }}
                      />
                    ) : null}
                  </button>

                  {showLoanProductDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-3 border-b">
                        <Input
                          value={loanProductSearch}
                          onChange={(e) => setLoanProductSearch(e.target.value)}
                          placeholder="Search loan products..."
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="max-h-48 overflow-auto">
                        {filteredLoanProducts.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                            No loan products found
                          </div>
                        ) : (
                          filteredLoanProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => {
                                setSelectedLoanProduct(product);
                                setShowLoanProductDropdown(false);
                                setLoanProductSearch("");
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-primaryGrey-50 border-b last:border-b-0 text-sm"
                            >
                              {product.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary-green whitespace-nowrap"
                  onClick={handleNewLoanProduct}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  + New loan product
                </Button>
              </div>
            </div>

            {/* Funding Amount */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                How much funding do they need? <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputWithCurrency
                      type="text"
                      value={fundingAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFundingAmount(value);
                        const numValue = parseFloat(value) || 0;
                        setSliderValue(Math.min(50000, Math.max(10000, numValue)));
                      }}
                      currencyValue={fundingCurrency}
                      onCurrencyValueChange={setFundingCurrency}
                      className="h-10"
                    />
                  </div>
                  <span className="text-primaryGrey-400">=</span>
                  <div className="flex-1">
                    <InputWithCurrency
                      type="text"
                      value={convertedAmount}
                      readOnly
                      currencyValue={convertedCurrency}
                      onCurrencyValueChange={setConvertedCurrency}
                      className="h-10"
                    />
                  </div>
                </div>
                <p className="text-xs text-primaryGrey-500">
                  Exchange rate: 1 {fundingCurrency} = {exchangeRate.toFixed(2)} {convertedCurrency}
                </p>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10000"
                    max="50000"
                    step="1000"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-primaryGrey-200 rounded-lg appearance-none cursor-pointer accent-primary-green"
                  />
                  <div className="flex justify-between text-xs text-primaryGrey-500">
                    <span>€10,000</span>
                    <span>€50,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Repayment Period */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                What is the preferred repayment period? <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={repaymentPeriod}
                  onChange={(e) => setRepaymentPeriod(e.target.value)}
                  className="h-10 w-24"
                />
                <span className="text-sm text-primaryGrey-500">months</span>
              </div>
              <div className="flex gap-2 mt-2">
                {["3", "6", "9", "12"].map((months) => (
                  <Button
                    key={months}
                    type="button"
                    variant={repaymentPeriod === months ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRepaymentPeriod(months)}
                    className={cn(
                      repaymentPeriod === months
                        ? "bg-primary-green text-white border-primary-green"
                        : ""
                    )}
                  >
                    {months} months
                  </Button>
                ))}
              </div>
            </div>

            {/* Intended Use of Funds */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                What is the intended use of funds? <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value)}
                  placeholder="Briefly describe their intended use of the funds."
                  rows={4}
                  maxLength={100}
                  className="pr-16"
                />
                <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
                  {intendedUse.length}/100
                </div>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                Interest rate (per annum) <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="h-10"
                />
                <span className="text-sm text-primaryGrey-500">%</span>
              </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Please review the above details before submitting. The SME will receive an email notification once this loan request is created.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-6 px-8 pb-6 flex items-center justify-end gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="text-white border-0"
            style={{
              background: "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              opacity: isFormValid ? 1 : 0.7,
            }}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
