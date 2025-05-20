"use client";

import {
  ChevronDown,
  Download,
  Loader2,
  Pencil,
  Plus,
  Power,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllLoanProductsQuery,
  useDeleteLoanProductMutation,
  useUpdateLoanProductStatusMutation,
} from "@/lib/redux/services/loan-product";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { LoanProduct } from "@/lib/types/loan-product";
import EmptyState from "./_components/empty-state";
import { DeleteLoanProductModal } from "./_components/delete-loan-product-modal";
import { DisableLoanProductModal } from "./_components/disable-loan-product-modal";
import { EnableLoanProductModal } from "./_components/enable-loan-product-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LoanProductsPage() {
  const router = useRouter();
  const guid = useAppSelector(selectCurrentToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct] = useState<LoanProduct | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<LoanProduct | null>(
    null,
  );
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [productToToggle, setProductToToggle] = useState<LoanProduct | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string>("");
  const [filters, setFilters] = useState<{
    loanProduct: string;
    loanProvider: string;
    visibility: string;
    status: string;
  }>({
    loanProduct: "all",
    loanProvider: "all",
    visibility: "all",
    status: "all",
  });
  const itemsPerPage = 10;

  const { data: loanProducts = [], isLoading } = useGetAllLoanProductsQuery(
    guid as string,
    { skip: !guid },
  );

  const [deleteLoanProduct] = useDeleteLoanProductMutation();
  const [updateLoanProductStatus] = useUpdateLoanProductStatusMutation();

  // Extract unique loan types and partner names for filters
  useMemo(() => {
    if (!loanProducts) return [];
    return Array.from(
      new Set(
        loanProducts.map((product) =>
          product.loanProductType === 0 ? "Secured" : "Unsecured",
        ),
      ),
    );
  }, [loanProducts]);

  const partnerNames = useMemo(() => {
    if (!loanProducts) return [];
    return Array.from(
      new Set(loanProducts.map((product) => product.partnerName)),
    );
  }, [loanProducts]);

  // Filter products based on search query and filter options
  const filteredProducts = useMemo(() => {
    if (!loanProducts) return [];

    let result = [...loanProducts];

    // Apply filters
    if (filters.loanProduct !== "all") {
      const loanProductType = filters.loanProduct === "Secured" ? 0 : 1;
      result = result.filter(
        (product) => product.loanProductType === loanProductType,
      );
    }

    if (filters.loanProvider !== "all") {
      result = result.filter(
        (product) => product.partnerName === filters.loanProvider,
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter(
        (product) => product.status.toString() === filters.status,
      );
    }

    // Apply search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.loanName.toLowerCase().includes(lowercasedQuery) ||
          product.partnerName.toLowerCase().includes(lowercasedQuery) ||
          product.description.toLowerCase().includes(lowercasedQuery),
      );
    }

    // Filter by active tab
    if (activeTab === "mk") {
      // Filter for MK loan products (could be based on a specific partner name or property)
      result = result.filter(
        (product) =>
          !product.partnerName || product.partnerName === "Melanin Kapital",
      );
    } else if (activeTab === "partner") {
      // Filter for partner loan products
      result = result.filter(
        (product) =>
          product.partnerName && product.partnerName !== "Melanin Kapital",
      );
    }

    // Sort products based on current sort order
    if (sortBy) {
      const [field, direction] = sortBy.split("-");
      result.sort((a: any, b: any) => {
        if (direction === "asc") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }

    return result;
  }, [loanProducts, searchQuery, filters, sortBy, activeTab]);

  Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Partner filter data is now handled in the useMemo above

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };
  const handleCreateClick = () => {
    router.push("/loan-products/create?type=partner");
  };

  const handleViewDetails = (product: LoanProduct) => {
    // For edit functionality, navigate to the edit page
    router.push(`/loan-products/edit?id=${product.id}`);
  };

  const handleDeleteClick = (product: LoanProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete && guid) {
      try {
        await deleteLoanProduct({
          productId: productToDelete.id,
          guid: guid as string,
        }).unwrap();
        // Success notification could be added here
      } catch (error) {
        console.error("Failed to delete loan product:", error);
        // Error notification could be added here
      }
    }
  };

  const handleToggleStatus = (product: LoanProduct) => {
    setProductToToggle(product);
    if (product.status === 1) {
      // Active to Inactive
      setIsDisableModalOpen(true);
    } else if (product.status === 2) {
      // Inactive to Active
      setIsEnableModalOpen(true);
    } else {
      // Draft to Active - no confirmation needed
      handleConfirmToggleStatus();
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (productToToggle && guid) {
      try {
        const newStatus = productToToggle.status === 1 ? 2 : 1; // Toggle between Active (1) and Inactive (2)
        await updateLoanProductStatus({
          productId: productToToggle.id,
          guid: guid as string,
          status: newStatus,
        }).unwrap();
        // Success notification could be added here
      } catch (error) {
        console.error("Failed to update loan product status:", error);
        // Error notification could be added here
      }
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Draft
          </Badge>
        );
      case 1:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case 2:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Unknown
          </Badge>
        );
    }
  };

  // Use only data from the API without placeholders
  const enhancedProducts = paginatedProducts.map((product) => ({
    ...product,
    loanType: product.loanProductType === 0 ? "Secured" : "Unsecured",
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-medium">
            Loan Products ({loanProducts.length || 20})
          </h1>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-8 py-2 w-64 border rounded-md bg-white"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <Button
              variant="outline"
              className="flex items-center gap-1 bg-white"
              onClick={() => {}}
            >
              <span className="text-sm font-normal">Sort by</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Hide/Show Filters */}
            <Button
              variant="outline"
              className="flex items-center gap-1 bg-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="text-sm font-normal">
                {showFilters ? "Hide" : "Show"} Filters
              </span>
              <SlidersHorizontal className="h-4 w-4" />
            </Button>

            {/* Download */}
            <Button variant="outline" className="bg-white p-2">
              <Download className="h-4 w-4" />
            </Button>

            {/* New Loan Product */}
            <Button
              className="flex items-center gap-1 bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleCreateClick}
            >
              <span>New Loan Product</span>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {/* Loan Product Type Filter */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="bg-white flex items-center gap-1"
                    onClick={() =>
                      setActiveFilterDropdown(
                        activeFilterDropdown === "loanType" ? "" : "loanType",
                      )
                    }
                  >
                    <span className="text-xs uppercase font-medium">
                      Loan Type
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {activeFilterDropdown === "loanType" && (
                    <div className="absolute top-10 left-0 z-10 bg-white border rounded-md shadow-lg p-2 min-w-[200px]">
                      <div className="flex flex-col">
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.loanProduct === "all" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, loanProduct: "all" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          All Types
                        </button>
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.loanProduct === "Secured" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, loanProduct: "Secured" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          Secured
                        </button>
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.loanProduct === "Unsecured" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              loanProduct: "Unsecured",
                            });
                            setActiveFilterDropdown("");
                          }}
                        >
                          Unsecured
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Loan Provider Filter */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="bg-white flex items-center gap-1"
                    onClick={() =>
                      setActiveFilterDropdown(
                        activeFilterDropdown === "provider" ? "" : "provider",
                      )
                    }
                  >
                    <span className="text-xs uppercase font-medium">
                      Loan Provider
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {activeFilterDropdown === "provider" && (
                    <div className="absolute top-10 left-0 z-10 bg-white border rounded-md shadow-lg p-2 min-w-[200px] max-h-[300px] overflow-y-auto">
                      <div className="flex flex-col">
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.loanProvider === "all" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, loanProvider: "all" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          All Providers
                        </button>
                        {partnerNames.map((partner) => (
                          <button
                            key={partner}
                            className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.loanProvider === partner ? "text-primary-green font-medium" : ""}`}
                            onClick={() => {
                              setFilters({ ...filters, loanProvider: partner });
                              setActiveFilterDropdown("");
                            }}
                          >
                            {partner}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="bg-white flex items-center gap-1"
                    onClick={() =>
                      setActiveFilterDropdown(
                        activeFilterDropdown === "status" ? "" : "status",
                      )
                    }
                  >
                    <span className="text-xs uppercase font-medium">
                      Status
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {activeFilterDropdown === "status" && (
                    <div className="absolute top-10 left-0 z-10 bg-white border rounded-md shadow-lg p-2 min-w-[200px]">
                      <div className="flex flex-col">
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.status === "all" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, status: "all" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          All Statuses
                        </button>
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.status === "1" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, status: "1" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          Active
                        </button>
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.status === "0" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, status: "0" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          Draft
                        </button>
                        <button
                          className={`text-left px-3 py-2 hover:bg-gray-100 ${filters.status === "2" ? "text-primary-green font-medium" : ""}`}
                          onClick={() => {
                            setFilters({ ...filters, status: "2" });
                            setActiveFilterDropdown("");
                          }}
                        >
                          Inactive
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset button */}
                <Button
                  className="text-white bg-primary-green hover:bg-primary-green px-4 py-2 text-xs font-medium"
                  onClick={() => {
                    setFilters({
                      loanProduct: "all",
                      loanProvider: "all",
                      visibility: "all",
                      status: "all",
                    });
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  RESET FILTERS
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-6">
                <button
                  className={`py-2 text-sm font-medium ${activeTab === "all" ? "text-primary-green border-b-2 border-primary-green" : "text-gray-600"}`}
                  onClick={() => setActiveTab("all")}
                >
                  All Loan Products
                </button>
                <button
                  className={`py-2 text-sm font-medium ${activeTab === "mk" ? "text-primary-green border-b-2 border-primary-green" : "text-gray-600"}`}
                  onClick={() => setActiveTab("mk")}
                >
                  MK Loan Products
                </button>
                <button
                  className={`py-2 text-sm font-medium ${activeTab === "partner" ? "text-primary-green border-b-2 border-primary-green" : "text-gray-600"}`}
                  onClick={() => setActiveTab("partner")}
                >
                  Partner Loan Products
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px] bg-white rounded-lg shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          searchQuery ||
          filters.loanProvider !== "all" ||
          filters.status !== "all" ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">
                No loan products match your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    loanProduct: "all",
                    loanProvider: "all",
                    visibility: "all",
                    status: "all",
                  });
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Loan Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Loan Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Loan Provider
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Maximum Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Interest Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-700 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enhancedProducts
                    .map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.loanName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.loanType}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.partnerName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.currency}{" "}
                          {product.loanPriceMax.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.loanInterest}%
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {product.status === 1 ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary-green bg-opacity-20 text-primary-green">
                              Active
                            </span>
                          ) : product.status === 0 ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800">
                              Draft
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary-red bg-opacity-20 text-primary-red">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex space-x-2">
                            <button
                              className="text-primary-green hover:text-primary-green"
                              onClick={() => handleViewDetails(product)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              className="text-primary-red hover:text-primary-red"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </button>
                            {product.status === 1 ? (
                              <button
                                className="text-amber-600 hover:text-amber-800"
                                onClick={() => handleToggleStatus(product)}
                              >
                                <Power className="h-4 w-4" />
                                <span className="sr-only">Disable</span>
                              </button>
                            ) : (
                              <button
                                className="text-primary-green hover:text-primary-green"
                                onClick={() => handleToggleStatus(product)}
                              >
                                <Power className="h-4 w-4" />
                                <span className="sr-only">Enable</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                    .slice(0, itemsPerPage)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                {selectedProduct?.loanName}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDetailsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Loan product details and configuration
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Product ID
                  </h3>
                  <p className="mt-1">
                    {selectedProduct.reference || selectedProduct.id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Partner</h3>
                  <p className="mt-1">{selectedProduct.partnerName}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="mt-1">{selectedProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Maximum Loan Amount
                  </h3>
                  <p className="mt-1">
                    {selectedProduct.currency}{" "}
                    {selectedProduct.loanPriceMax.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Interest Rate
                  </h3>
                  <p className="mt-1">{selectedProduct.loanInterest}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Integration Type
                  </h3>
                  <p className="mt-1">
                    {selectedProduct.integrationType === 0
                      ? "Basic"
                      : selectedProduct.integrationType === 1
                        ? "Advanced"
                        : selectedProduct.integrationType === 2
                          ? "Premium"
                          : "Custom"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Product Type
                  </h3>
                  <p className="mt-1">
                    {selectedProduct.loanProductType === 0
                      ? "Standard Loan"
                      : selectedProduct.loanProductType === 1
                        ? "Business Loan"
                        : selectedProduct.loanProductType === 2
                          ? "Mortgage"
                          : "Special"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">
                    {getStatusBadge(selectedProduct.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(
                        `/loan-products/${selectedProduct.reference || selectedProduct.id}/edit`,
                      )
                    }
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <DeleteLoanProductModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          productName={productToDelete.loanName}
        />
      )}

      {/* Disable Confirmation Modal */}
      {productToToggle && productToToggle.status === 1 && (
        <DisableLoanProductModal
          open={isDisableModalOpen}
          onClose={() => setIsDisableModalOpen(false)}
          onConfirm={handleConfirmToggleStatus}
          productName={productToToggle.loanName}
        />
      )}

      {/* Enable Confirmation Modal */}
      {productToToggle && productToToggle.status === 2 && (
        <EnableLoanProductModal
          open={isEnableModalOpen}
          onClose={() => setIsEnableModalOpen(false)}
          onConfirm={handleConfirmToggleStatus}
          productName={productToToggle.loanName}
        />
      )}
    </div>
  );
}
