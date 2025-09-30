"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import type { LoanProductsFilters } from "@/lib/api/types";

interface LoanProductsFiltersProps {
  filters: LoanProductsFilters;
  onFiltersChange: (filters: Partial<LoanProductsFilters>) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  uniqueCurrencies: string[];
  onSearchChange: (search: string) => void;
}

export function LoanProductsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
  uniqueCurrencies,
  onSearchChange,
}: LoanProductsFiltersProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Partial<LoanProductsFilters>>({});
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  // Initialize local filters when filters change
  useEffect(() => {
    setLocalFilters({
      status: filters.status,
      currency: filters.currency,
      interestType: filters.interestType,
      termUnit: filters.termUnit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  }, [filters]);

  const handleApplyFilters = () => {
    // Filter out undefined values and 'all' values
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => 
        value !== undefined && value !== 'all' && value !== ''
      )
    );
    onFiltersChange(cleanedFilters);
    setIsFilterPanelOpen(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setSearchInput('');
    onClearFilters();
    setIsFilterPanelOpen(false);
  };

  const handleStatusChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value as any }));
  };

  const handleCurrencyChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, currency: value === 'all' ? undefined : value }));
  };

  const handleInterestTypeChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, interestType: value === 'all' ? undefined : value as any }));
  };

  const handleTermUnitChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, termUnit: value === 'all' ? undefined : value as any }));
  };


  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setLocalFilters(prev => ({ 
      ...prev,
      sortBy: sortBy as any, 
      sortOrder: sortOrder as 'asc' | 'desc' 
    }));
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primaryGrey-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="text-primaryGrey-400 hover:text-primaryGrey-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          {isFilterPanelOpen ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
      </div>

      {/* Collapsible Filter Panel */}
      {isFilterPanelOpen && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-midnight-blue">
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter Controls */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-primaryGrey-400 mb-2 block">
                  Status
                </label>
                <Select
                  value={localFilters.status || 'all'}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-primaryGrey-400 mb-2 block">
                  Currency
                </label>
                <Select
                  value={localFilters.currency || 'all'}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    {uniqueCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-primaryGrey-400 mb-2 block">
                  Interest Type
                </label>
                <Select
                  value={localFilters.interestType || 'all'}
                  onValueChange={handleInterestTypeChange}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Interest Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-primaryGrey-400 mb-2 block">
                  Term Unit
                </label>
                <Select
                  value={localFilters.termUnit || 'all'}
                  onValueChange={handleTermUnitChange}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Term Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="quarters">Quarters</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-primaryGrey-400 mb-2 block">
                  Sort By
                </label>
                <Select
                  value={`${localFilters.sortBy || 'createdAt'}-${localFilters.sortOrder || 'desc'}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="interestRate-asc">Interest Rate Low-High</SelectItem>
                    <SelectItem value="interestRate-desc">Interest Rate High-Low</SelectItem>
                    <SelectItem value="minAmount-asc">Amount Low-High</SelectItem>
                    <SelectItem value="minAmount-desc">Amount High-Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-primaryGrey-50">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-primaryGrey-400 hover:text-primaryGrey-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterPanelOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyFilters}
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="text-xs">
              Search: {filters.search}
            </Badge>
          )}
          {filters.status && (
            <Badge variant="outline" className="text-xs">
              Status: {filters.status}
            </Badge>
          )}
          {filters.currency && (
            <Badge variant="outline" className="text-xs">
              Currency: {filters.currency}
            </Badge>
          )}
          {filters.interestType && (
            <Badge variant="outline" className="text-xs">
              Interest: {filters.interestType}
            </Badge>
          )}
          {filters.termUnit && (
            <Badge variant="outline" className="text-xs">
              Term: {filters.termUnit}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}