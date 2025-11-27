"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { AuditTrailHeader } from "./_components/audit-trail-header";
import { AuditTrailTable, type AuditLogEntry } from "./_components/audit-trail-table";
import { AuditTrailPagination } from "./_components/audit-trail-pagination";
import { useSMEAuditTrail } from "@/lib/api/hooks/sme";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "date-asc" | "date-desc";
type FilterUser = "all" | string;

export default function AuditLogsPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;

  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterUser, setFilterUser] = useState<FilterUser>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Fetch audit trail from API
  const { data, isLoading, error } = useSMEAuditTrail(
    userId,
    {
      page: currentPage,
      limit: itemsPerPage,
    },
    { enabled: !!userId }
  );

  // Map API response to component format
  const allEntries: AuditLogEntry[] = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((entry) => {
      // Generate change summary from description or action details
      let changeSummary = entry.description || "";
      
      if (!changeSummary && entry.action) {
        // Format action name
        changeSummary = entry.action
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        
        // Add details if available
        if (entry.details) {
          const detailsStr = Object.entries(entry.details)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          if (detailsStr) {
            changeSummary += ` - ${detailsStr}`;
          }
        }
      }

      // Get admin user name
      const adminName = entry.adminUser.firstName && entry.adminUser.lastName
        ? `${entry.adminUser.firstName} ${entry.adminUser.lastName}`
        : entry.adminUser.email || "Unknown User";

      return {
        id: entry.id,
        changeSummary,
        initiatedBy: {
          id: entry.adminUser.id,
          name: adminName,
          email: entry.adminUser.email,
        },
        timestamp: entry.createdAt,
      };
    });
  }, [data]);

  // Extract unique users for filter dropdown
  const availableUsers = useMemo(() => {
    const userMap = new Map<string, { id: string; name: string; email: string }>();
    allEntries.forEach((entry) => {
      if (!userMap.has(entry.initiatedBy.id)) {
        userMap.set(entry.initiatedBy.id, {
          id: entry.initiatedBy.id,
          name: entry.initiatedBy.name,
          email: entry.initiatedBy.email,
        });
      }
    });
    return Array.from(userMap.values());
  }, [allEntries]);

  // Filter entries by user and search (client-side filtering)
  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      if (filterUser !== "all" && entry.initiatedBy.id !== filterUser) return false;
      if (searchValue && !entry.changeSummary.toLowerCase().includes(searchValue.toLowerCase())) return false;
      return true;
    });
  }, [allEntries, filterUser, searchValue]);

  // Sort entries (client-side sorting)
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (sort === "date-asc") {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      // date-desc (default)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [filteredEntries, sort]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-midnight-blue">Audit Trail</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load audit trail</p>
          <p className="text-red-500 text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.total || 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-midnight-blue">Audit Trail</h1>

      {/* Header with Filters */}
      <AuditTrailHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onClearSearch={() => setSearchValue("")}
        sort={sort}
        onSortChange={setSort}
        filterUser={filterUser}
        onFilterChange={setFilterUser}
        availableUsers={availableUsers}
      />

      {/* Table */}
      <AuditTrailTable entries={sortedEntries} />

      {/* Pagination */}
      {totalPages > 1 && (
        <AuditTrailPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
