"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { InputWithCurrency } from "@/components/ui/input-with-currency";
import { X, Building2, Info, ExternalLink } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  useCreateLoanApplication,
  useSearchLoanProducts,
  useSearchBusinesses,
  type LoanProductSearchItem,
  type BusinessSearchItem,
} from "@/lib/api/hooks/loan-applications";
import { useLoanProduct } from "@/lib/api/hooks/loan-products";

interface CreateLoanApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}


export function CreateLoanApplicationModal({
  open,
  onOpenChange,
  onCreated,
}: CreateLoanApplicationModalProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessSearchItem | null>(null);
  const [businessSearch, setBusinessSearch] = useState("");
  const [showBusinessSearch, setShowBusinessSearch] = useState(false);
  const [selectedLoanProduct, setSelectedLoanProduct] = useState<LoanProductSearchItem | null>(null);
  const [showLoanProductDropdown, setShowLoanProductDropdown] = useState(false);
  const [loanProductSearch, setLoanProductSearch] = useState("");
  const businessSearchRef = useRef<HTMLDivElement>(null);
  const loanProductRef = useRef<HTMLDivElement>(null);

  // Hooks
  const debouncedBusinessSearch = useDebounce(businessSearch, 300);
  const debouncedLoanProductSearch = useDebounce(loanProductSearch, 300);
  
  const { data: businessesData, isLoading: isLoadingBusinesses } = useSearchBusinesses(
    debouncedBusinessSearch || undefined,
    { page: 1, limit: 20 }
  );
  
  const { data: loanProductsData, isLoading: isLoadingLoanProducts } = useSearchLoanProducts(
    debouncedLoanProductSearch || undefined,
    { page: 1, limit: 20 },
    true
  );
  
  const createLoanApplicationMutation = useCreateLoanApplication();
  
  // Funding amount
  const [fundingAmount, setFundingAmount] = useState("10000.00");
  const [fundingCurrency, setFundingCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState("1500000.00");
  const [convertedCurrency, setConvertedCurrency] = useState("KES");
  const [exchangeRate,] = useState(150.90);
  const [sliderValue, setSliderValue] = useState(10000);
  
  // Repayment period
  const [repaymentPeriod, setRepaymentPeriod] = useState("3");
  const [repaymentSliderValue, setRepaymentSliderValue] = useState(3);
  
  // Intended use of funds
  const [intendedUse, setIntendedUse] = useState("");

  // Interest rate (loaded from selected loan product details)
  const [interestRate, setInterestRate] = useState("");

  // Get businesses and loan products from API
  const businesses = businessesData?.data || [];
  const loanProducts = loanProductsData?.data || [];

  // Load full loan product details for the selected product (interest rate, periods, etc.)
  const { data: loanProductDetails } = useLoanProduct(selectedLoanProduct?.id ?? "");

  // Get loan product constraints
  const loanProductConstraints = useMemo(() => {
    if (!selectedLoanProduct) return null;
    
    // Convert term to months if needed
    let minTermMonths = selectedLoanProduct.minTerm;
    let maxTermMonths = selectedLoanProduct.maxTerm;
    
    if (selectedLoanProduct.termUnit !== "months") {
      const conversionFactors: Record<string, number> = {
        days: 1 / 30,
        weeks: 1 / 4.33,
        months: 1,
        quarters: 3,
        years: 12,
      };
      const factor = conversionFactors[selectedLoanProduct.termUnit] || 1;
      minTermMonths = Math.ceil(selectedLoanProduct.minTerm * factor);
      maxTermMonths = Math.floor(selectedLoanProduct.maxTerm * factor);
    }
    
    return {
      minAmount: selectedLoanProduct.minAmount,
      maxAmount: selectedLoanProduct.maxAmount,
      minTerm: minTermMonths,
      maxTerm: maxTermMonths,
      currency: selectedLoanProduct.currency,
    };
  }, [selectedLoanProduct]);

  // Update currency and reset values when loan product changes
  useEffect(() => {
    if (selectedLoanProduct && loanProductConstraints) {
      // Update currency to match loan product
      setFundingCurrency(selectedLoanProduct.currency);
      
      // Reset funding amount to min amount (or keep current if within range)
      const currentAmount = parseFloat(fundingAmount) || 0;
      const newAmount = Math.max(
        loanProductConstraints.minAmount,
        Math.min(currentAmount, loanProductConstraints.maxAmount)
      );
      setFundingAmount(newAmount.toFixed(2));
      setSliderValue(newAmount);
      
      // Reset repayment period to min term (or keep current if within range)
      const currentPeriod = parseInt(repaymentPeriod) || loanProductConstraints.minTerm;
      const newPeriod = Math.max(
        loanProductConstraints.minTerm,
        Math.min(currentPeriod, loanProductConstraints.maxTerm)
      );
      setRepaymentPeriod(newPeriod.toString());
      setRepaymentSliderValue(newPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLoanProduct?.id]); // Only run when loan product ID changes

  // Calculate converted amount when funding amount, currency, or exchange rate changes
  useEffect(() => {
    const amount = parseFloat(fundingAmount) || 0;
    const converted = amount * exchangeRate;
    setConvertedAmount(converted.toFixed(2));
  }, [fundingAmount, exchangeRate, fundingCurrency, convertedCurrency]);

  // Update slider when funding amount changes manually
  useEffect(() => {
    if (loanProductConstraints) {
      const amount = parseFloat(fundingAmount) || 0;
      const clampedAmount = Math.max(
        loanProductConstraints.minAmount,
        Math.min(amount, loanProductConstraints.maxAmount)
      );
      setSliderValue(clampedAmount);
    }
  }, [fundingAmount, loanProductConstraints]);

  // Update repayment slider when repayment period changes manually
  useEffect(() => {
    if (loanProductConstraints) {
      const period = parseInt(repaymentPeriod) || loanProductConstraints.minTerm;
      const clampedPeriod = Math.max(
        loanProductConstraints.minTerm,
        Math.min(period, loanProductConstraints.maxTerm)
      );
      setRepaymentSliderValue(clampedPeriod);
    }
  }, [repaymentPeriod, loanProductConstraints]);

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
  const handleFundingSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    setFundingAmount(value.toFixed(2));
  };

  // Update repayment period when slider changes
  const handleRepaymentSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRepaymentSliderValue(value);
    setRepaymentPeriod(value.toString());
  };

  // Validation helpers
  const fundingAmountError = useMemo(() => {
    if (!selectedLoanProduct || !loanProductConstraints) return null;
    const amount = parseFloat(fundingAmount) || 0;
    if (amount < loanProductConstraints.minAmount) {
      return `Minimum amount is ${loanProductConstraints.currency} ${loanProductConstraints.minAmount.toLocaleString()}`;
    }
    if (amount > loanProductConstraints.maxAmount) {
      return `Maximum amount is ${loanProductConstraints.currency} ${loanProductConstraints.maxAmount.toLocaleString()}`;
    }
    return null;
  }, [fundingAmount, loanProductConstraints, selectedLoanProduct]);

  const repaymentPeriodError = useMemo(() => {
    if (!selectedLoanProduct || !loanProductConstraints) return null;
    const period = parseInt(repaymentPeriod) || 0;
    if (period < loanProductConstraints.minTerm) {
      return `Minimum term is ${loanProductConstraints.minTerm} months`;
    }
    if (period > loanProductConstraints.maxTerm) {
      return `Maximum term is ${loanProductConstraints.maxTerm} months`;
    }
    return null;
  }, [repaymentPeriod, loanProductConstraints, selectedLoanProduct]);

  const getOwnerName = (business: BusinessSearchItem) => {
    if (business.owner.firstName && business.owner.lastName) {
      return `${business.owner.firstName} ${business.owner.lastName}`;
    }
    return business.owner.email;
  };

  const handleNewLoanProduct = () => {
    window.open("/loan-products/create", "_blank");
  };

  const handleSubmit = async () => {
    if (!selectedBusiness || !selectedLoanProduct) return;

    const formData = {
      businessId: selectedBusiness.id,
      entrepreneurId: selectedBusiness.owner.id, // Use owner.id from API response
      loanProductId: selectedLoanProduct.id,
      fundingAmount: parseFloat(fundingAmount),
      fundingCurrency,
      convertedAmount: parseFloat(convertedAmount) || undefined,
      convertedCurrency: convertedCurrency || undefined,
      exchangeRate: exchangeRate || undefined,
      repaymentPeriod: parseInt(repaymentPeriod),
      intendedUseOfFunds: intendedUse,
      interestRate: parseFloat(interestRate),
      loanSource: "Admin Platform",
    };

    try {
      await createLoanApplicationMutation.mutateAsync(formData);
      resetForm();
      onOpenChange(false);
      if (onCreated) onCreated();
    } catch (error) {
      console.error("Error creating loan application:", error);
      // TODO: Show error toast/notification
    }
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
    setRepaymentSliderValue(3);
    setIntendedUse("");
    setInterestRate("");
    setFundingCurrency("EUR");
  };

  // Keep interest rate in sync with the selected loan product details
  useEffect(() => {
    if (loanProductDetails?.interestRate !== undefined && loanProductDetails?.interestRate !== null) {
      setInterestRate(loanProductDetails.interestRate.toString());
    } else if (!selectedLoanProduct) {
      setInterestRate("");
    }
  }, [loanProductDetails, selectedLoanProduct]);

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const isFormValid = 
    selectedBusiness && 
    selectedLoanProduct && 
    fundingAmount && 
    repaymentPeriod && 
    intendedUse && 
    interestRate &&
    !fundingAmountError &&
    !repaymentPeriodError;

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
                      {isLoadingBusinesses ? (
                        <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                          Loading businesses...
                        </div>
                      ) : businesses.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                          {businessSearch ? "No businesses found" : "Start typing to search"}
                        </div>
                      ) : (
                        businesses.map((business) => (
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
                        {isLoadingLoanProducts ? (
                          <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                            Loading loan products...
                          </div>
                        ) : loanProducts.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                            {loanProductSearch ? "No loan products found" : "Start typing to search"}
                          </div>
                        ) : (
                          loanProducts.map((product) => (
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
                {selectedLoanProduct && loanProductConstraints && (
                  <span className="ml-2 text-xs font-normal text-primaryGrey-500">
                    (Range: {loanProductConstraints.currency}{" "}
                    {loanProductConstraints.minAmount.toLocaleString()} -{" "}
                    {loanProductConstraints.maxAmount.toLocaleString()})
                  </span>
                )}
              </Label>
              {!selectedLoanProduct ? (
                <p className="text-xs text-primaryGrey-500">
                  Select a loan product first to configure the funding amount.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <InputWithCurrency
                        type="text"
                        value={fundingAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFundingAmount(value);
                        }}
                        currencyValue={fundingCurrency}
                        onCurrencyValueChange={setFundingCurrency}
                        className={cn("h-10", fundingAmountError && "border-red-500")}
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
                  {fundingAmountError && (
                    <p className="text-xs text-red-500">{fundingAmountError}</p>
                  )}
                  <p className="text-xs text-primaryGrey-500">
                    Exchange rate: 1 {fundingCurrency} = {exchangeRate.toFixed(2)}{" "}
                    {convertedCurrency}
                  </p>
                  {loanProductConstraints && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={loanProductConstraints.minAmount}
                        max={loanProductConstraints.maxAmount}
                        step={Math.max(
                          1,
                          (loanProductConstraints.maxAmount -
                            loanProductConstraints.minAmount) / 100,
                        )}
                        value={sliderValue}
                        onChange={handleFundingSliderChange}
                        className="w-full h-2 bg-primaryGrey-200 rounded-lg appearance-none cursor-pointer accent-primary-green"
                      />
                      <div className="flex justify-between text-xs text-primaryGrey-500">
                        <span>
                          {loanProductConstraints.currency}{" "}
                          {loanProductConstraints.minAmount.toLocaleString()}
                        </span>
                        <span>
                          {loanProductConstraints.currency}{" "}
                          {loanProductConstraints.maxAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Repayment Period */}
            <div className="space-y-2">
              <Label className="text-primaryGrey-400">
                What is the preferred repayment period?{" "}
                <span className="text-red-500">*</span>
                {selectedLoanProduct && loanProductConstraints && (
                  <span className="ml-2 text-xs font-normal text-primaryGrey-500">
                    (Range: {loanProductConstraints.minTerm} -{" "}
                    {loanProductConstraints.maxTerm} months
                    {loanProductConstraints.maxTerm >= 12 && (
                      <>
                        {" "}
                        (~
                        {(loanProductConstraints.minTerm / 12).toFixed(1)} -{" "}
                        {(loanProductConstraints.maxTerm / 12).toFixed(1)} years)
                      </>
                    )}
                    )
                  </span>
                )}
              </Label>
              {!selectedLoanProduct ? (
                <p className="text-xs text-primaryGrey-500">
                  Select a loan product first to configure the repayment period.
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={repaymentPeriod}
                      onChange={(e) => setRepaymentPeriod(e.target.value)}
                      className={cn(
                        "h-10 w-24",
                        repaymentPeriodError && "border-red-500",
                      )}
                      min={loanProductConstraints?.minTerm}
                      max={loanProductConstraints?.maxTerm}
                    />
                    <span className="text-sm text-primaryGrey-500">months</span>
                  </div>
                  {repaymentPeriodError && (
                    <p className="text-xs text-red-500">{repaymentPeriodError}</p>
                  )}
                  {repaymentPeriod && (
                    <p className="text-xs text-primaryGrey-500">
                      Selected: {repaymentPeriod} months
                      {Number(repaymentPeriod) >= 12 && (
                        <>
                          {" "}
                          (~{(Number(repaymentPeriod) / 12).toFixed(1)} years)
                        </>
                      )}
                    </p>
                  )}
                  {loanProductConstraints && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={loanProductConstraints.minTerm}
                        max={loanProductConstraints.maxTerm}
                        step={1}
                        value={repaymentSliderValue}
                        onChange={handleRepaymentSliderChange}
                        className="w-full h-2 bg-primaryGrey-200 rounded-lg appearance-none cursor-pointer accent-primary-green"
                      />
                      <div className="flex justify-between text-xs text-primaryGrey-500">
                        <span>{loanProductConstraints.minTerm} months</span>
                        <span>{loanProductConstraints.maxTerm} months</span>
                      </div>
                    </div>
                  )}
                </>
              )}
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
                Interest rate{" "}
                {(() => {
                  const period = loanProductDetails?.ratePeriod;
                  if (period === "per_day") return "(per day)";
                  if (period === "per_month") return "(per month)";
                  if (period === "per_quarter") return "(per quarter)";
                  if (period === "per_year") return "(per annum)";
                  return "";
                })()}{" "}
                <span className="text-red-500">*</span>
              </Label>
              {!selectedLoanProduct ? (
                <p className="text-xs text-primaryGrey-500">
                  Select a loan product first to view the applicable interest rate.
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="h-10"
                    readOnly
                  />
                  <span className="text-sm text-primaryGrey-500">%</span>
                </div>
              )}
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
            disabled={!isFormValid || createLoanApplicationMutation.isPending}
          >
            {createLoanApplicationMutation.isPending ? "Creating..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
