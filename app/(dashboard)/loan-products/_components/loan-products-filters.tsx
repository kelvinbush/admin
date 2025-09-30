"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Search, X } from "lucide-react";

interface LoanProductsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  currencyFilter: string;
  setCurrencyFilter: (value: string) => void;
  interestRateFilter: string;
  setInterestRateFilter: (value: string) => void;
  termFilter: string;
  setTermFilter: (value: string) => void;
  amountFilter: string;
  setAmountFilter: (value: string) => void;
  uniqueCurrencies: string[];
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function LoanProductsFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currencyFilter,
  setCurrencyFilter,
  interestRateFilter,
  setInterestRateFilter,
  termFilter,
  setTermFilter,
  amountFilter,
  setAmountFilter,
  uniqueCurrencies,
  onClearFilters,
  activeFiltersCount,
}: LoanProductsFiltersProps) {
  return (
    <Card className={"shadow-none border-none"}>
      <CardHeader className={"px-0"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
               <Badge
                 variant="secondary"
                 className="bg-primary-green/10 text-primary-green border-primary-green/20"
               >
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
             <Button
               variant="ghost"
               size="sm"
               onClick={onClearFilters}
               className="text-primaryGrey-400 hover:text-primaryGrey-500"
             >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={"px-0"}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primaryGrey-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Currency Filter */}
          <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
            <SelectTrigger>
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

          {/* Interest Rate Filter */}
          <Select
            value={interestRateFilter}
            onValueChange={setInterestRateFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Interest Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rates</SelectItem>
              <SelectItem value="0-5">0% - 5%</SelectItem>
              <SelectItem value="5-10">5% - 10%</SelectItem>
              <SelectItem value="10-15">10% - 15%</SelectItem>
              <SelectItem value="15-20">15% - 20%</SelectItem>
              <SelectItem value="20+">20%+</SelectItem>
            </SelectContent>
          </Select>

          {/* Term Filter */}
          <Select value={termFilter} onValueChange={setTermFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Term Length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="short">Short (&lt; 1 year)</SelectItem>
              <SelectItem value="medium">Medium (1-3 years)</SelectItem>
              <SelectItem value="long">Long (3+ years)</SelectItem>
            </SelectContent>
          </Select>

          {/* Amount Filter */}
          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Loan Amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="micro">Micro (&lt; $1K)</SelectItem>
              <SelectItem value="small">Small ($1K-$10K)</SelectItem>
              <SelectItem value="medium">Medium ($10K-$100K)</SelectItem>
              <SelectItem value="large">Large ($100K+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
