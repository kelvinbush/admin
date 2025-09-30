"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLoanProducts } from "@/lib/api/hooks/loan-products";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { LoanProduct } from "@/lib/api/types";
import { LoanProductsTable } from "./_components/loan-products-table";
import { LoanProductsFilters } from "./_components/loan-products-filters";
import { LoanProductDetailsSheet } from "./_components/loan-product-details-sheet";
import { PaginationControls } from "./_components/pagination-controls";

export default function LoanProductsPage() {
  const router = useRouter();
  const { setTitle } = useTitle();
  const { data, isLoading, error } = useLoanProducts();

  // Local state for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [interestRateFilter, setInterestRateFilter] = useState<string>("all");
  const [termFilter, setTermFilter] = useState<string>("all");
  const [amountFilter, setAmountFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  React.useEffect(() => {
    setTitle("Loan Products");
  }, [setTitle]);

  // Helper functions for filtering
  const matchesInterestRate = (product: LoanProduct, filter: string) => {
    if (filter === "all") return true;
    const rate = product.interestRate;
    switch (filter) {
      case "0-5":
        return rate >= 0 && rate < 5;
      case "5-10":
        return rate >= 5 && rate < 10;
      case "10-15":
        return rate >= 10 && rate < 15;
      case "15-20":
        return rate >= 15 && rate < 20;
      case "20+":
        return rate >= 20;
      default:
        return true;
    }
  };

  const matchesTerm = (product: LoanProduct, filter: string) => {
    if (filter === "all") return true;
    const maxTermInYears =
      product.termUnit === "YEARS"
        ? product.maxTerm
        : product.termUnit === "MONTHS"
          ? product.maxTerm / 12
          : product.termUnit === "WEEKS"
            ? product.maxTerm / 52
            : product.maxTerm / 365;

    switch (filter) {
      case "short":
        return maxTermInYears < 1;
      case "medium":
        return maxTermInYears >= 1 && maxTermInYears <= 3;
      case "long":
        return maxTermInYears > 3;
      default:
        return true;
    }
  };

  const matchesAmount = (product: LoanProduct, filter: string) => {
    if (filter === "all") return true;
    const avgAmount = (product.minAmount + product.maxAmount) / 2;
    switch (filter) {
      case "micro":
        return avgAmount < 1000;
      case "small":
        return avgAmount >= 1000 && avgAmount < 10000;
      case "medium":
        return avgAmount >= 10000 && avgAmount < 100000;
      case "large":
        return avgAmount >= 100000;
      default:
        return true;
    }
  };

  // Filter and paginate data
  const filteredAndPaginatedData = useMemo(() => {
    if (!data?.data)
      return { filtered: [], paginated: [], totalPages: 0, totalItems: 0 };

    let filtered = data.data.filter((product: LoanProduct) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.isActive) ||
        (statusFilter === "inactive" && !product.isActive);

      const matchesCurrency =
        currencyFilter === "all" || product.currency === currencyFilter;
      const matchesInterest = matchesInterestRate(product, interestRateFilter);
      const matchesTermLength = matchesTerm(product, termFilter);
      const matchesAmountRange = matchesAmount(product, amountFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCurrency &&
        matchesInterest &&
        matchesTermLength &&
        matchesAmountRange
      );
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { filtered, paginated, totalPages, totalItems };
  }, [
    data?.data,
    searchTerm,
    statusFilter,
    currencyFilter,
    interestRateFilter,
    termFilter,
    amountFilter,
    currentPage,
    itemsPerPage,
  ]);

  // Get unique currencies for filter
  const uniqueCurrencies = useMemo(() => {
    if (!data?.data) return [];
    return Array.from(
      new Set(data.data.map((product: LoanProduct) => product.currency)),
    ).sort();
  }, [data?.data]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    currencyFilter,
    interestRateFilter,
    termFilter,
    amountFilter,
  ]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (currencyFilter !== "all") count++;
    if (interestRateFilter !== "all") count++;
    if (termFilter !== "all") count++;
    if (amountFilter !== "all") count++;
    return count;
  }, [
    searchTerm,
    statusFilter,
    currencyFilter,
    interestRateFilter,
    termFilter,
    amountFilter,
  ]);

  const handleRowClick = (product: LoanProduct) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleAddProduct = () => {
    router.push("/loan-products/create");
  };

  const handleEditProduct = (product: LoanProduct) => {
    // TODO: Implement edit product functionality
    console.log("Edit product clicked", product);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrencyFilter("all");
    setInterestRateFilter("all");
    setTermFilter("all");
    setAmountFilter("all");
  };

  if (isLoading) {
        return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
        return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load loan products.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { paginated, totalPages, totalItems } = filteredAndPaginatedData;

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-midnight-blue">
              Loan Products
          </h1>
            <p className="text-primaryGrey-400 mt-1">
              Manage your loan products and their configurations
            </p>
            </div>
            <Button
            className="bg-primary-green hover:bg-primary-green/90"
            onClick={handleAddProduct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
            </Button>
        </div>

        {/* Filters */}
        <LoanProductsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          currencyFilter={currencyFilter}
          setCurrencyFilter={setCurrencyFilter}
          interestRateFilter={interestRateFilter}
          setInterestRateFilter={setInterestRateFilter}
          termFilter={termFilter}
          setTermFilter={setTermFilter}
          amountFilter={amountFilter}
          setAmountFilter={setAmountFilter}
          uniqueCurrencies={uniqueCurrencies}
          onClearFilters={clearAllFilters}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      {/* Table */}
      <LoanProductsTable
        data={paginated}
        onRowClick={handleRowClick}
        onAddProduct={handleAddProduct}
      />

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Product Details Side Sheet */}
          <LoanProductDetailsSheet
            product={selectedProduct}
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onEdit={handleEditProduct}
          />
        </div>
      );
    }
