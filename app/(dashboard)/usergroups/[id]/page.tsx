"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTitle } from "@/context/title-context";
import { useUserGroup, useDeleteUserGroupMutation } from "@/lib/api/hooks/useUserGroups";
import { useSearchUserGroupBusinesses, useRemoveBusinessFromGroup } from "@/lib/api/hooks/user-groups-businesses";
import BusinessesTable from "./_components/businesses-table";
import AddSmeModal from "./_components/add-sme-modal";
import EditUserGroupModal from "./_components/edit-user-group-modal";
import { ArrowLeft, Search, X, Filter as FilterIcon, ChevronDown, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function UserGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { setTitle } = useTitle();
  const id = params?.id as string;

  const { data: group, error: groupError } = useUserGroup(id);
  const deleteMutation = useDeleteUserGroupMutation();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [businessSort, setBusinessSort] = useState<"created_desc" | "created_asc" | "name_asc" | "name_desc">("created_desc");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "pending_activation">("all");
  const [progressFilter, setProgressFilter] = useState<"all" | "0-25" | "25-50" | "50-75" | "75-100">("all");
  const limit = 20;

  // Debounce search
  const debouncedSearch = useDebounce(searchValue, 300);

  // Fetch businesses in the group
  const { data: businessesData, isLoading: isLoadingBusinesses } = useSearchUserGroupBusinesses(
    id,
    debouncedSearch || undefined,
    { page, limit }
  );

  const removeBusinessMutation = useRemoveBusinessFromGroup();

  // Filter to only show businesses already in group
  const businessesInGroup = useMemo(() => {
    if (!businessesData?.data) return [];
    const inGroup = businessesData.data.filter((b) => b.isAlreadyInGroup);

    const withSearch =
      debouncedSearch && debouncedSearch.trim()
        ? inGroup.filter((b) => {
            const term = debouncedSearch.toLowerCase();
            const name = b.name?.toLowerCase() || "";
            const ownerName = `${b.owner.firstName || ""} ${b.owner.lastName || ""}`.toLowerCase();
            const ownerEmail = b.owner.email.toLowerCase();
            return (
              name.includes(term) ||
              ownerName.includes(term) ||
              ownerEmail.includes(term)
            );
          })
        : inGroup;

    const withSector =
      sectorFilter === "all"
        ? withSearch
        : withSearch.filter((b) =>
            (b.sector || "").toLowerCase().includes(sectorFilter.toLowerCase()),
          );

    const withStatus =
      statusFilter === "all"
        ? withSector
        : withSector.filter((b) => {
            const status = b.onboardingStatus || "draft";
            if (statusFilter === "pending_activation") {
              return status === "pending_activation" || status === "pending_invitation";
            }
            return status === statusFilter;
          });

    const withProgress =
      progressFilter === "all"
        ? withStatus
        : withStatus.filter((b) => {
            const value = Math.round(b.businessProfileProgress ?? 0);
            switch (progressFilter) {
              case "0-25":
                return value >= 0 && value < 25;
              case "25-50":
                return value >= 25 && value < 50;
              case "50-75":
                return value >= 50 && value < 75;
              case "75-100":
                return value >= 75;
              default:
                return true;
            }
          });

    const sorted = [...withProgress].sort((a, b) => {
      if (businessSort === "name_asc" || businessSort === "name_desc") {
        const dir = businessSort === "name_asc" ? 1 : -1;
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        if (nameA === nameB) return 0;
        return nameA > nameB ? dir : -dir;
      }

      // created_* fallback: rely on optional createdAt if present, otherwise stable
      const dateA = (a as any).createdAt
        ? new Date((a as any).createdAt).getTime()
        : 0;
      const dateB = (b as any).createdAt
        ? new Date((b as any).createdAt).getTime()
        : 0;
      const dir = businessSort === "created_desc" ? -1 : 1;
      if (dateA === dateB) return 0;
      return dateA > dateB ? dir : -dir;
    });

    return sorted;
  }, [businessesData, debouncedSearch, businessSort, sectorFilter, statusFilter, progressFilter]);

  const totalBusinesses = (group as any)?.businessCount ?? 0;
  const totalResults = businessesData?.pagination?.total ?? 0;
  const totalPages = Math.max(
    1,
    (businessesData?.pagination?.totalPages ??
      Math.ceil(totalResults / limit)) || 1,
  );
  const startIndex = totalResults === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(totalResults, page * limit);

  const hasActiveFilters =
    sectorFilter !== "all" ||
    statusFilter !== "all" ||
    progressFilter !== "all" ||
    !!(debouncedSearch && debouncedSearch.trim().length > 0);

  const handleClearFilters = () => {
    setSectorFilter("all");
    setStatusFilter("all");
    setProgressFilter("all");
    setSearchValue("");
    setPage(1);
  };

  React.useEffect(() => {
    setTitle("User Management");
  }, [setTitle]);

  const onDelete = async () => {
    const ok = window.confirm("Delete this group?");
    if (!ok) return;
    await deleteMutation.mutateAsync({ id });
    router.push("/usergroups");
  };

  const createdAt = group && (group as any).createdAt ? new Date((group as any).createdAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "-";
  const updatedAt = group && (group as any).updatedAt ? new Date((group as any).updatedAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "-";

  if (!group && !groupError) {
    return (
      <div className="space-y-6 bg-white p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-56" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <Card className="shadow-none">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-transparent px-6 pt-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-primaryGrey-500">
        <button className="inline-flex items-center gap-2 hover:underline" onClick={() => router.push("/usergroups")}> 
          <ArrowLeft className="h-4 w-4" /> All Users Groups
        </button>
        <span>•</span>
        <span className="text-emerald-500">{(group as any)?.name || id}</span>
      </div>

      {/* Header Card */}
      <Card className="shadow-none">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-medium text-midnight-blue">{(group as any)?.name || id}</h1>
            <div className="flex items-center gap-3">
              <Button onClick={() => setEditOpen(true)} className="bg-primary-green">Edit Group</Button>
              <Button variant="outline" className="text-red-600 border-red-300" onClick={onDelete} disabled={deleteMutation.isPending}>
                Delete Group
              </Button>
            </div>
          </div>
          <div className="my-4 border-b" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-primaryGrey-500 mb-1">Group no</div>
              <div className="text-sm text-midnight-blue">{(group as any)?.slug || id}</div>
            </div>
            <div>
              <div className="text-xs text-primaryGrey-500 mb-1">Created At</div>
              <div className="text-sm text-midnight-blue">{createdAt}</div>
            </div>
            <div>
              <div className="text-xs text-primaryGrey-500 mb-1">Updated At</div>
              <div className="text-sm text-midnight-blue">{updatedAt}</div>
            </div>
            <div className="md:col-span-4">
              <div className="text-xs text-primaryGrey-500 mb-1">Description</div>
              <div className="text-sm text-primaryGrey-600">{(group as any)?.description || "-"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
<div className="bg-white rounded">
      {/* Linked SMEs Header Card */}
      <Card className="shadow-none border-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-midnight-blue">{`Linked Businesses (${totalBusinesses})`}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border rounded-md px-3 h-10 w-[260px]">
                <Search className="h-4 w-4 text-primaryGrey-400" />
                <Input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setPage(1); // Reset to first page on new search
                  }}
                  className="h-9 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-400"
                  placeholder="Search business"
                />
                {searchValue && (
                  <button
                    className="ml-auto text-primaryGrey-400 hover:text-midnight-blue"
                    aria-label="Clear"
                    onClick={() => {
                      setSearchValue("");
                      setPage(1);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2">
                    <FilterIcon className="h-4 w-4" />
                    Sort by
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setBusinessSort("created_desc")}>
                    Newest first
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBusinessSort("created_asc")}>
                    Oldest first
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBusinessSort("name_asc")}>
                    Ascending (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBusinessSort("name_desc")}>
                    Descending (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="h-10 w-10 p-0"
                aria-label="Export"
                disabled={!businessesInGroup.length}
                onClick={() => {
                  if (!businessesInGroup.length) return;

                  const headers = ["Business Name", "Sector", "Location", "Owner Name", "Owner Email"];
                  const rows = businessesInGroup.map((b) => {
                    const ownerName = `${b.owner.firstName || ""} ${b.owner.lastName || ""}`.trim() ||
                      b.owner.email;
                    const location = b.city && b.country
                      ? `${b.city}, ${b.country}`
                      : b.city || b.country || "—";
                    return [
                      b.name,
                      b.sector || "",
                      location,
                      ownerName,
                      b.owner.email,
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
                    `user-group-${id}-businesses-${new Date()
                      .toISOString()
                      .slice(0, 10)}.csv`,
                  );
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button className="h-10 bg-black hover:bg-black/90 text-white" onClick={() => setAddOpen(true)}>Add SME</Button>
            </div>
          </div>

          {/* Filters row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Select
              value={sectorFilter}
              onValueChange={(val) => {
                setSectorFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 min-w-[180px] border-gray-300 text-xs uppercase tracking-[0.08em] text-midnight-blue px-4">
                <SelectValue placeholder="SECTOR">
                  {sectorFilter === "all" ? "SECTOR" : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val: any) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 min-w-[180px] border-gray-300 text-xs uppercase tracking-[0.08em] text-midnight-blue px-4">
                <SelectValue placeholder="STATUS">
                  {statusFilter === "all" ? "STATUS" : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_activation">Pending activation</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={progressFilter}
              onValueChange={(val: any) => {
                setProgressFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 min-w-[220px] border-gray-300 text-xs uppercase tracking-[0.08em] text-midnight-blue px-4">
                <SelectValue placeholder="B/S PROFILE PROGRESS">
                  {progressFilter === "all" ? "B/S PROFILE PROGRESS" : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All progress</SelectItem>
                <SelectItem value="0-25">Minimal progress (0 - 25%)</SelectItem>
                <SelectItem value="25-50">Partial progress (26 - 50%)</SelectItem>
                <SelectItem value="50-75">Moderate progress (51 - 75%)</SelectItem>
                <SelectItem value="75-100">Almost completed (76 - 99%)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-10 px-4 text-xs uppercase tracking-[0.08em]",
                !hasActiveFilters && "text-primaryGrey-300 border-primaryGrey-100 cursor-not-allowed",
              )}
              disabled={!hasActiveFilters}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Businesses table */}
      <BusinessesTable
        data={businessesInGroup}
        isLoading={isLoadingBusinesses}
        onAdd={() => setAddOpen(true)}
        onRemove={async (businessId: string) => {
          if (!window.confirm("Are you sure you want to remove this business from the group?")) {
            return;
          }

          try {
            setActionBusyId(businessId);
            await removeBusinessMutation.mutateAsync({ groupId: id, businessId });
            toast.success("Business removed from group successfully");
          } catch (error: any) {
            console.error("Failed to remove business:", error);
            toast.error(error?.response?.data?.message || "Failed to remove business");
          } finally {
            setActionBusyId(null);
          }
        }}
        actionBusyId={actionBusyId}
        onViewDetails={(business) => {
          if (business.owner?.id) {
            router.push(`/entrepreneurs/${business.owner.id}`);
          }
        }}
        isFiltered={hasActiveFilters}
        hasAnyBusinesses={totalBusinesses > 0}
      />

      {/* Pagination footer for linked businesses */}
      {totalResults > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primaryGrey-500 px-1 pb-4">
          <div>
            <span>
              Showing{" "}
              <span className="font-medium text-midnight-blue">
                {startIndex} to {endIndex}
              </span>{" "}
              of{" "}
              <span className="font-medium text-midnight-blue">
                {totalResults}
              </span>{" "}
              results
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={cn(
                  "h-8 w-8 flex items-center justify-center border rounded-sm text-xs",
                  page === 1
                    ? "text-primaryGrey-300 border-primaryGrey-100 cursor-not-allowed"
                    : "text-primaryGrey-600 border-primaryGrey-200 hover:bg-primaryGrey-50",
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={cn(
                      "h-8 min-w-[32px] px-2 flex items-center justify-center border rounded-sm text-xs",
                      pageNumber === page
                        ? "bg-midnight-blue text-white border-midnight-blue"
                        : "text-primaryGrey-600 border-primaryGrey-200 hover:bg-primaryGrey-50",
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className={cn(
                  "h-8 w-8 flex items-center justify-center border rounded-sm text-xs",
                  page === totalPages
                    ? "text-primaryGrey-300 border-primaryGrey-100 cursor-not-allowed"
                    : "text-primaryGrey-600 border-primaryGrey-200 hover:bg-primaryGrey-50",
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
</div>
      <AddSmeModal
        open={addOpen}
        onOpenChange={setAddOpen}
        groupId={id}
        onAdded={() => {
          // Data will refresh automatically via query invalidation
        }}
      />
      <EditUserGroupModal
        open={editOpen}
        onOpenChange={setEditOpen}
        groupId={id}
        initialName={(group as any)?.name || ""}
        initialSlug={(group as any)?.slug || ""}
        initialDescription={(group as any)?.description || ""}
        onUpdated={() => {
          router.refresh?.();
        }}
      />
    </div>
  );
}
