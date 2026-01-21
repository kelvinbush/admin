"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, X, Download, ChevronDown, Filter } from "lucide-react";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import type { UserGroup } from "@/lib/api/types";
import { UserGroupsTable } from "./_components/user-groups-table";
import CreateUserGroupModal from "./_components/create-user-group-modal";
import EditUserGroupModal from "./[id]/_components/edit-user-group-modal";
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

  // Local filters and pagination
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"created_desc" | "created_asc" | "name_asc" | "name_desc">(
    "created_desc",
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch a large page once; all filtering/pagination is local
  const { data, isLoading, error } = useUserGroups(undefined, {
    page: 1,
    limit: 1000,
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);

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

  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group);
    setEditOpen(true);
  };

  const groups: UserGroup[] = data?.data || [];

  const filteredAndSorted = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = term
      ? groups.filter((group) => {
          const name = ((group as any).name || "").toLowerCase();
          const slug = ((group as any).slug || "").toLowerCase();
          return name.includes(term) || slug.includes(term);
        })
      : groups;

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "name_asc" || sort === "name_desc") {
        const dir = sort === "name_asc" ? 1 : -1;
        const nameA = ((a as any).name || "").toLowerCase();
        const nameB = ((b as any).name || "").toLowerCase();
        if (nameA === nameB) return 0;
        return nameA > nameB ? dir : -dir;
      }

      const dateA = (a as any).createdAt
        ? new Date((a as any).createdAt).getTime()
        : 0;
      const dateB = (b as any).createdAt
        ? new Date((b as any).createdAt).getTime()
        : 0;
      const dir = sort === "created_desc" ? -1 : 1;
      if (dateA === dateB) return 0;
      return dateA > dateB ? dir : -dir;
    });

    return sorted;
  }, [groups, search, sort]);

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalFiltered, currentPage * pageSize);

  const paginatedGroups = useMemo(
    () =>
      filteredAndSorted.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize,
      ),
    [filteredAndSorted, currentPage, pageSize],
  );

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
            {`User groups (${groups.length})`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded-md px-3 h-10 w-[260px]">
            <Search className="h-4 w-4 text-primaryGrey-400" />
            <Input
              className="h-9 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-400"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <button
              aria-label="Clear search"
              className="ml-auto text-primaryGrey-400 hover:text-midnight-blue"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
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
              <DropdownMenuItem onClick={() => { setSort("created_desc"); setPage(1); }}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSort("created_asc"); setPage(1); }}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSort("name_asc"); setPage(1); }}>
                Ascending (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSort("name_desc"); setPage(1); }}>
                Descending (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="h-10 w-10 p-0 justify-center"
            onClick={() => {
              if (!data?.data?.length) return;

              const rows = data.data;
              const headers = ["Group No", "Name", "Linked SMEs", "Created At", "Updated At"];

              const csvRows = rows.map((group) => {
                const slugOrId = (group as any).slug || group.id;
                const name = (group as any).name || "";
                const businessCount = (group as any).businessCount ?? 0;
                const createdAt = group.createdAt
                  ? new Date(group.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "-";
                const updatedAt = group.updatedAt
                  ? new Date(group.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "-";
                return [slugOrId, name, businessCount, createdAt, updatedAt];
              });

              const escapeCell = (cell: string | number) => {
                const s = String(cell);
                const needsEscaping = s.includes(",") || s.includes('"') || s.includes("\n");
                const sanitized = s.replace(/"/g, '""');
                return needsEscaping ? `"${sanitized}"` : sanitized;
              };

              const csvContent = [headers, ...csvRows]
                .map((row) => row.map((cell) => escapeCell(cell)).join(","))
                .join("\n");

              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `user-groups-${new Date().toISOString().slice(0, 10)}.csv`,
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            disabled={!data?.data?.length}
            aria-label="Download user groups"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button className="h-10 bg-black hover:bg-black/90 text-white" onClick={handleAddGroup}>
            <Plus className="h-4 w-4 mr-2" />
            New User Group
          </Button>
        </div>
      </div>

      <UserGroupsTable
        data={paginatedGroups}
        onRowClick={handleRowClick}
        onAddGroup={handleAddGroup}
        onViewGroup={handleViewGroup}
        onEditGroup={handleEditGroup}
        onDeleted={() => {
          // Refetch is handled by react-query; reset to first page to keep UX predictable
          setPage(1);
        }}
        isFiltered={search.trim().length > 0}
      />

      <CreateUserGroupModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          // react-query refetches automatically; ensure we show the first page
          setPage(1);
        }}
      />

      {editingGroup && (
        <EditUserGroupModal
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) {
              setEditingGroup(null);
            }
          }}
          groupId={editingGroup.id}
          initialName={(editingGroup as any)?.name || ""}
          initialSlug={(editingGroup as any)?.slug || ""}
          initialDescription={(editingGroup as any)?.description || ""}
          onUpdated={() => {
            router.refresh?.();
          }}
        />
      )}

      {totalFiltered > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-primaryGrey-400">
          <div>
            Showing{" "}
            <span className="font-medium text-midnight-blue">
              {startIndex}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-medium text-midnight-blue">
              {totalFiltered}
            </span>{" "}
            user groups
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                if (currentPage > 1) setPage(currentPage - 1);
              }}
            >
              Previous
            </Button>
            <span className="text-xs text-primaryGrey-400">
              Page{" "}
              <span className="font-medium text-midnight-blue">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-medium text-midnight-blue">
                {totalPages}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalFiltered === 0}
              onClick={() => {
                if (currentPage < totalPages) setPage(currentPage + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
