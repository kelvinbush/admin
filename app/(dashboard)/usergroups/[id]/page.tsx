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
import { ArrowLeft, Search, X, Filter as FilterIcon, ChevronDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
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
    return businessesData.data.filter((b) => b.isAlreadyInGroup);
  }, [businessesData]);

  const totalBusinesses = businessesData?.pagination?.total || 0;

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
                  placeholder="Search business or owner..."
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
                  <DropdownMenuItem>Newest first</DropdownMenuItem>
                  <DropdownMenuItem>Oldest first</DropdownMenuItem>
                  <DropdownMenuItem>Ascending (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem>Descending (Z-A)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="h-10 w-10 p-0" aria-label="Export">
                <Download className="h-4 w-4" />
              </Button>
              <Button className="h-10 bg-black hover:bg-black/90 text-white" onClick={() => setAddOpen(true)}>Add SME</Button>
            </div>
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
      />
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
