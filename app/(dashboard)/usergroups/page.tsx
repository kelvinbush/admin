"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, X, Download, ChevronDown, Filter } from "lucide-react";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import type { UserGroup, UserGroupFilters, PaginationParams } from "@/lib/api/types";
import { UserGroupsTable } from "./_components/user-groups-table";
import CreateUserGroupModal from "./_components/create-user-group-modal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserGroupsPage() {
  const router = useRouter();
  const { setTitle } = useTitle();

  // Filters and pagination
  const [filters, setFilters] = useState<UserGroupFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });

  const { data, isLoading, error } = useUserGroups(filters, pagination);
  const [createOpen, setCreateOpen] = useState(false);

  React.useEffect(() => {
    setTitle("User Management");
  }, [setTitle]);

  const handleAddGroup = () => {
    setCreateOpen(true);
  };

  const handleRowClick = (group: UserGroup) => {
    router.push(`/usergroups/${group.id}`);
  };

  const handleViewGroup = (group: UserGroup) => {
    router.push(`/usergroups/${group.id}`);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
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
        <div className="w-full max-w-md text-center">
          <p className="text-red-500 mb-4">Failed to load user groups</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-midnight-blue">
            {`User groups (${data?.pagination?.total ?? 0})`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded-md px-3 h-10 w-[260px]">
            <Search className="h-4 w-4 text-primaryGrey-400" />
            <Input
              className="h-9 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-400"
              placeholder="Search..."
              onChange={(e) => {
                const q = e.target.value;
                setFilters((prev) => ({ ...prev, search: q || undefined } as any));
              }}
            />
            <button
              aria-label="Clear search"
              className="ml-auto text-primaryGrey-400 hover:text-midnight-blue"
              onClick={() => setFilters((prev) => ({ ...(prev as any), search: undefined }))}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                Sort by
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setPagination((p) => ({ ...p, sortBy: "createdAt", sortOrder: "desc" }))}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPagination((p) => ({ ...p, sortBy: "createdAt", sortOrder: "asc" }))}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPagination((p) => ({ ...p, sortBy: "name", sortOrder: "asc" }))}>
                Ascending (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPagination((p) => ({ ...p, sortBy: "name", sortOrder: "desc" }))}>
                Descending (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-10 w-10 p-0 justify-center">
            <Download className="h-4 w-4" />
          </Button>

          <Button className="h-10 bg-black hover:bg-black/90 text-white" onClick={handleAddGroup}>
            <Plus className="h-4 w-4 mr-2" />
            New User Group
          </Button>
        </div>
      </div>

      <UserGroupsTable
        data={data?.data || []}
        onRowClick={handleRowClick}
        onAddGroup={handleAddGroup}
        onViewGroup={handleViewGroup}
        onDeleted={() => setFilters((prev) => ({ ...prev }))}
      />

      <CreateUserGroupModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          // refresh list after creation
          // simplest approach: update filters state to trigger refetch
          setFilters((prev) => ({ ...prev }));
        }}
      />

      {/* Pagination controls can be added here if needed, matching the loan products page */}
    </div>
  );
}
