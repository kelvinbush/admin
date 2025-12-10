"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LoanProductsHeader,
  type LoanProductSort,
} from "./_components/loan-products-header";
import { LoanProductsEmptyState } from "./_components/loan-products-empty-state";
import { LoanProductsTable, type LoanProductTableItem } from "./_components/loan-products-table";
import { useLoanProducts, useUpdateLoanProductStatusMutation } from "@/lib/api/hooks/loan-products";
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
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  // Build filters for API
  const apiFilters = useMemo(() => {
    return {
      search: searchValue || undefined,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };
  }, [searchValue, sort]);

  // Fetch loan products
  const { data: loanProductsData, isLoading } = useLoanProducts(apiFilters, { page, limit });
  
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
    if (!loanProductsData?.items) return [];
    
    return loanProductsData.items.map((product) => {
      const organizationName = organizationsMap.get(product.organizationId) || product.organizationId;
      const userGroupNames = product.userGroupIds
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
        linkedSmes: 0, // TODO: Get from API when available
        linkedLoans: 0, // TODO: Get from API when available
        status: tableStatus,
      };
    });
  }, [loanProductsData, organizationsMap, userGroupsMap]);

  const total = loanProductsData?.total || 0;
  const hasLoanProducts = total > 0;

  // Status update mutation (accepts ID in variables)
  const updateStatusMutation = useUpdateLoanProductStatusMutation();

  const handleEdit = (id: string) => {
    router.push(`/loan-products/${id}/edit`);
  };

  const handleToggleStatus = async (id: string, newStatus: "active" | "inactive") => {
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
      
      toast.success(`Loan product ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      console.error("Failed to toggle status:", error);
      toast.error(error?.response?.data?.message || "Failed to update loan product status");
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

        {!hasLoanProducts ? (
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
            isLoading={isLoading}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            actionBusyId={actionBusyId}
          />
        )}
      </section>
    </div>
  );
}