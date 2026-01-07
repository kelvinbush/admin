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
import {
  useLoanProduct,
  useLoanProducts,
  useUpdateLoanProductStatusMutation,
} from "@/lib/api/hooks/loan-products";
import { useOrganizations } from "@/lib/api/hooks/organizations";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import { toast } from "sonner";

export default function LoanProductsPage() {
  const router = useRouter();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<LoanProductSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [page] = useState(1);
  const [limit] = useState(20);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  // Build filters for API
  const apiFilters = useMemo(() => {
    return {
      search: searchValue || undefined,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };
  }, [searchValue, sort]);

  // Fetch loan products
  const { data: loanProductsData, isLoading } = useLoanProducts(apiFilters, {
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
  const hasLoanProducts = total > 0;

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

  return (
    <div className="space-y-6">
      <section className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        <LoanProductsHeader
          total={total}
          searchValue={searchValue}
          filtersVisible={filtersVisible}
          sort={sort}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onSortChange={setSort}
          onToggleFilters={() => setFiltersVisible((prev) => !prev)}
          onDownload={() => {
            /* TODO: hook up download */
          }}
          onAddLoanProduct={() => {
            router.push("/loan-products/create");
          }}
        />

        {isLoading ? (
          <LoanProductsTable
            data={[]}
            isLoading={true}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewDetails={handleViewDetails}
            actionBusyId={actionBusyId}
          />
        ) : !hasLoanProducts ? (
          <div className="flex-1 min-h-[320px] rounded-xl border border-dashed border-primaryGrey-200 bg-primaryGrey-25">
            <LoanProductsEmptyState
              onAddLoanProduct={() => {
                router.push("/loan-products/create");
              }}
            />
          </div>
        ) : (
          <LoanProductsTable
            data={tableData}
            isLoading={false}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewDetails={handleViewDetails}
            actionBusyId={actionBusyId}
          />
        )}
      </section>

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
