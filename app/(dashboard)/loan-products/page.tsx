"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoanProductsHeader,
  type LoanProductSort,
} from "./_components/loan-products-header";
import { LoanProductsEmptyState } from "./_components/loan-products-empty-state";
import {
  LoanProductsTable,
  type LoanProductTableItem,
} from "./_components/loan-products-table";
import { LoanProductDetailsSheet } from "./_components/loan-product-details-sheet";
import { LoanProductsFilterEmptyState } from "./_components/loan-products-filter-empty-state";
import {
  useLoanProduct,
  useLoanProducts,
  useUpdateLoanProductStatusMutation,
} from "@/lib/api/hooks/loan-products";
import { useOrganizations } from "@/lib/api/hooks/organizations";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { AttachmentsPagination } from "@/app/(dashboard)/entrepreneurs/[id]/attachments/_components/attachments-pagination";

export default function LoanProductsPage() {
  const router = useRouter();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "active" | "archived">("all");
  const [loanProductFilter, setLoanProductFilter] = useState<"all" | string>("all");
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | string>("all");
  const [sort, setSort] = useState<LoanProductSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fetch loan products
  const { data: loanProductsData, isLoading } = useLoanProducts(undefined, {
    page,
    limit,
  });

  // Fetch organizations and user groups for display names
  const { data: organizationsData } = useOrganizations();
  const { data: userGroupsData } = useUserGroups();

  // Create lookup maps
  const organizationsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (organizationsData?.items) {
      organizationsData.items.forEach((org) => {
        map.set(org.id, org.name);
      });
    }
    return map;
  }, [organizationsData]);

  const userGroupsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (userGroupsData?.data) {
      userGroupsData.data.forEach((group: any) => {
        map.set(group.id, group.name);
      });
    }
    return map;
  }, [userGroupsData]);

  // Transform API data to table format
  const tableData: LoanProductTableItem[] = useMemo(() => {
    if (!loanProductsData?.data) return [];

    return loanProductsData.data.map((product) => {
      const organizationName =
        organizationsMap.get(product.organizationId) || product.organizationId;
      const userGroupNames =
        product.userGroupIds
          .map((id) => userGroupsMap.get(id) || id)
          .join(", ") || "All Users";

      // Map API status to table status
      // API has: "draft" | "active" | "archived" and isActive boolean
      // Table expects: "active" | "inactive"
      const tableStatus: "active" | "inactive" =
        product.status === "active" && product.isActive ? "active" : "inactive";

      return {
        id: product.id,
        code: product.slug || product.id.slice(0, 8).toUpperCase(),
        name: product.name,
        provider: organizationName,
        visibility: userGroupNames,
        linkedLoans: product.loansCount ?? 0,
        status: tableStatus, // Store full product data for the sheet
        product: product,
      };
    });
  }, [loanProductsData, organizationsMap, userGroupsMap]);

  // Get selected product details - only fetch when sheet is open and ID is set
  // useLoanProduct already has enabled: !!loanProductId, so we can pass empty string when not needed
  const { data: selectedProduct } = useLoanProduct(selectedProductId || "");

  // Get organization and user group names for selected product
  const selectedOrgName = useMemo(() => {
    if (!selectedProduct) return undefined;
    return (
      organizationsMap.get(selectedProduct.organizationId) ||
      selectedProduct.organizationId
    );
  }, [selectedProduct, organizationsMap]);

  const selectedUserGroupNames = useMemo(() => {
    if (!selectedProduct) return [];
    return selectedProduct.userGroupIds
      .map((id) => userGroupsMap.get(id) || id)
      .filter(Boolean);
  }, [selectedProduct, userGroupsMap]);

  const total = loanProductsData?.pagination?.total || 0;
  const totalPages = loanProductsData?.pagination?.totalPages || 1;
  const currentPage = loanProductsData?.pagination?.page || page;

  // Unique options for local filters
  const loanProductOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((item) => {
      if (item.name) set.add(item.name);
    });
    return Array.from(set);
  }, [tableData]);

  const providerOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((item) => {
      if (item.provider) set.add(item.provider);
    });
    return Array.from(set);
  }, [tableData]);

  const visibilityOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((item) => {
      if (item.visibility) set.add(item.visibility);
    });
    return Array.from(set);
  }, [tableData]);

  // Local filtering & sorting
  const filteredAndSortedData = useMemo(() => {
    let items = [...tableData];

    // Loan product name filter
    if (loanProductFilter !== "all") {
      items = items.filter((item) => item.name === loanProductFilter);
    }

    // Provider filter
    if (providerFilter !== "all") {
      items = items.filter((item) => item.provider === providerFilter);
    }

    // Visibility filter
    if (visibilityFilter !== "all") {
      items = items.filter((item) => item.visibility === visibilityFilter);
    }

    // Status filter (local)
    if (statusFilter !== "all") {
      items = items.filter((item) => {
        const apiStatus = item.product?.status;
        return apiStatus === statusFilter;
      });
    }

    // Text search (local) - name, code, provider, visibility
    const term = searchValue.trim().toLowerCase();
    if (term) {
      items = items.filter((item) => {
        const code = (item.code ?? "").toLowerCase();
        const name = (item.name ?? "").toLowerCase();
        const provider = (item.provider ?? "").toLowerCase();
        const visibility = (item.visibility ?? "").toLowerCase();

        return (
          code.includes(term) ||
          name.includes(term) ||
          provider.includes(term) ||
          visibility.includes(term)
        );
      });
    }

    // Sorting (local)
    const sorted = [...items].sort((a, b) => {
      if (sort.sortBy === "createdAt") {
        const dateA = a.product?.createdAt
          ? new Date(a.product.createdAt).getTime()
          : 0;
        const dateB = b.product?.createdAt
          ? new Date(b.product.createdAt).getTime()
          : 0;
        return sort.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      // sort by name
      const nameA = (a.name ?? "").toLowerCase();
      const nameB = (b.name ?? "").toLowerCase();
      if (nameA === nameB) return 0;
      const dir = sort.sortOrder === "asc" ? 1 : -1;
      return nameA > nameB ? dir : -dir;
    });

    return sorted;
  }, [
    tableData,
    loanProductFilter,
    providerFilter,
    visibilityFilter,
    statusFilter,
    searchValue,
    sort,
  ]);

  const hasAnyFromApi = total > 0;
  const hasFilteredRows = filteredAndSortedData.length > 0;
  const hasSearchOrFilters = !!searchValue || statusFilter !== "all";

  // Status update mutation (accepts ID in variables)
  const updateStatusMutation = useUpdateLoanProductStatusMutation();

  const handleEdit = (id: string) => {
    router.push(`/loan-products/${id}/edit`);
  };

  const handleViewDetails = (id: string) => {
    setSelectedProductId(id);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    // Don't clear selectedProductId immediately to avoid flicker
    setTimeout(() => setSelectedProductId(null), 300);
  };

  const handleToggleStatus = async (
    id: string,
    newStatus: "active" | "inactive",
  ) => {
    try {
      setActionBusyId(id);

      // Map table status to API status
      const apiStatus = newStatus === "active" ? "active" : "archived";

      await updateStatusMutation.mutateAsync({
        id,
        data: {
          status: apiStatus,
          changeReason: `Status changed to ${apiStatus}`,
          approvedBy: "current-user-id", // TODO: Get from auth context
        },
      });

      toast.success(
        `Loan product ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      );
    } catch (error: any) {
      console.error("Failed to toggle status:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update loan product status",
      );
    } finally {
      setActionBusyId(null);
    }
  };

  const handleDownload = () => {
    if (!filteredAndSortedData.length) return;

    const headers = [
      "Code",
      "Loan Name",
      "Loan Provider",
      "Loan Visibility",
      "Linked Loans",
      "Status",
      "Created At",
    ];

    const rows = filteredAndSortedData.map((item) => {
      const createdAt = item.product?.createdAt
        ? new Date(item.product.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "";

      const statusLabel =
        item.product?.status === "active" && item.product?.isActive
          ? "Active"
          : item.product?.status === "draft"
            ? "Draft"
            : "Archived";

      return [
        item.code,
        item.name,
        item.provider,
        item.visibility,
        item.linkedLoans.toString(),
        statusLabel,
        createdAt,
      ];
    });

    const escapeCell = (cell: string) => {
      const s = String(cell);
      const needsEscaping =
        s.includes(",") || s.includes('"') || s.includes("\n");
      const sanitized = s.replace(/"/g, '""');
      return needsEscaping ? `"${sanitized}"` : sanitized;
    };

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `loan-products-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 bg-white min-h-screen rounded-md p-6">
      <section className="bg-white flex flex-col gap-6">
        <LoanProductsHeader
          total={total}
          searchValue={searchValue}
          filtersVisible={filtersVisible}
          sort={sort}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onSortChange={setSort}
          onToggleFilters={() => setFiltersVisible((prev) => !prev)}
          onDownload={handleDownload}
          onAddLoanProduct={() => {
            router.push("/loan-products/create");
          }}
        />

        {filtersVisible && (
          <div className="flex flex-wrap items-center gap-3 border-t border-primaryGrey-100 pt-4">
            <div className="flex items-center justify-center h-11 w-11 rounded-md border border-primaryGrey-200 text-primaryGrey-500">
              <Filter className="h-4 w-4" />
            </div>

            <Select
              value={loanProductFilter}
              onValueChange={(value) =>
                setLoanProductFilter(value as "all" | string)
              }
            >
              <SelectTrigger className="h-11 w-[180px] text-xs font-medium text-primaryGrey-500">
                <SelectValue placeholder="LOAN PRODUCT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">LOAN PRODUCT</SelectItem>
                {loanProductOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={providerFilter}
              onValueChange={(value) =>
                setProviderFilter(value as "all" | string)
              }
            >
              <SelectTrigger className="h-11 w-[200px] text-xs font-medium text-primaryGrey-500">
                <SelectValue placeholder="LOAN PROVIDER" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">LOAN PROVIDER</SelectItem>
                {providerOptions.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={visibilityFilter}
              onValueChange={(value) =>
                setVisibilityFilter(value as "all" | string)
              }
            >
              <SelectTrigger className="h-11 w-[180px] text-xs font-medium text-primaryGrey-500">
                <SelectValue placeholder="VISIBILITY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">VISIBILITY</SelectItem>
                {visibilityOptions.map((visibility) => (
                  <SelectItem key={visibility} value={visibility}>
                    {visibility}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "draft" | "active" | "archived")
              }
            >
              <SelectTrigger className="h-11 w-[160px] text-xs font-medium text-primaryGrey-500">
                <SelectValue placeholder="STATUS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">STATUS</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {isLoading ? (
          <LoanProductsTable
            data={[]}
            isLoading={true}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewDetails={handleViewDetails}
            actionBusyId={actionBusyId}
          />
        ) : !hasAnyFromApi ? (
          <div className="flex-1 min-h-[320px] rounded-xl border border-dashed border-primaryGrey-200 bg-primaryGrey-25">
            <LoanProductsEmptyState
              onAddLoanProduct={() => {
                router.push("/loan-products/create");
              }}
            />
          </div>
        ) : !hasFilteredRows && hasSearchOrFilters ? (
          <div className="flex-1 min-h-[320px] rounded-xl border border-dashed border-primaryGrey-200 bg-primaryGrey-25">
            <LoanProductsFilterEmptyState />
          </div>
        ) : (
          <LoanProductsTable
            data={filteredAndSortedData}
            isLoading={false}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewDetails={handleViewDetails}
            actionBusyId={actionBusyId}
          />
        )}
      </section>

      {hasAnyFromApi && (
        <AttachmentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={(newPage) => {
            if (newPage < 1 || newPage > totalPages) return;
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* Loan Product Details Sheet */}
      {selectedProduct && (
        <LoanProductDetailsSheet
          product={selectedProduct}
          open={sheetOpen}
          onOpenChange={handleCloseSheet}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          actionBusyId={actionBusyId}
          organizationName={selectedOrgName}
          userGroupNames={selectedUserGroupNames}
        />
      )}
    </div>
  );
}
