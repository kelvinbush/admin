"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLoanProducts } from "@/lib/api/hooks/loan-products";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { LoanProduct, LoanProductsFilters } from "@/lib/api/types";
import { LoanProductsTable } from "./_components/loan-products-table";
import { LoanProductsFilters as LoanProductsFiltersComponent } from "./_components/loan-products-filters";
import { LoanProductDetailsSheet } from "./_components/loan-product-details-sheet";
import { PaginationControls } from "./_components/pagination-controls";

export default function LoanProductsPage() {
  const router = useRouter();
  const { setTitle } = useTitle();

  // Server-side filters and pagination state
  const [filters, setFilters] = useState<LoanProductsFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, error } = useLoanProducts(filters);

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  React.useEffect(() => {
    setTitle("Loan Products");
  }, [setTitle]);

  // Filter update handlers
  const updateFilters = (newFilters: Partial<LoanProductsFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const clearAllFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({
      ...prev,
      search: search || undefined,
      page: 1, // Reset to first page when search changes
    }));
  };

  // Get unique currencies for filter dropdown
  const uniqueCurrencies = useMemo(() => {
    if (!data?.data) return [];
    return Array.from(
      new Set(data.data.map((product: LoanProduct) => product.currency)),
    ).sort();
  }, [data?.data]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.currency) count++;
    if (filters.interestType) count++;
    if (filters.termUnit) count++;
    return count;
  }, [filters]);

  const handleRowClick = (product: LoanProduct) => {
    router.push(`/loan-products/${product.id}`);
  };

  const handleAddProduct = () => {
    router.push("/loan-products/create");
  };

  const handleEditProduct = (product: LoanProduct) => {
    router.push(`/loan-products/${product.id}/edit`);
  };

  const handleViewProduct = (product: LoanProduct) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
                      </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-12 w-full" />
                </div>
                        ))}
                      </div>
                    </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load loan products</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6">
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

      <LoanProductsFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        uniqueCurrencies={uniqueCurrencies}
        onSearchChange={handleSearchChange}
      />

      <LoanProductsTable
        data={data?.data || []}
        onRowClick={handleRowClick}
        onAddProduct={handleAddProduct}
        onViewProduct={handleViewProduct}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={data.pagination.page}
          setCurrentPage={handlePageChange}
          itemsPerPage={data.pagination.limit}
          setItemsPerPage={handleItemsPerPageChange}
          totalItems={data.pagination.total}
          totalPages={data.pagination.totalPages}
        />
      )}

      <LoanProductDetailsSheet
        product={selectedProduct}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onEdit={handleEditProduct}
      />
    </div>
  );
}
