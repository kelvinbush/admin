"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useActivateInternalUser,
  useDeactivateInternalUser,
  useInternalUsers,
  useRemoveInternalUser,
  useResendInternalInvitation,
  useRevokeInternalInvitation,
} from "@/lib/api/hooks/internal-users";
import {
  useUpdateInternalInvitation,
  useUpdateInternalUserRole,
  type UpdateInvitationBody,
  type UpdateUserRoleBody,
} from "@/lib/api/hooks";
import { useUser } from "@clerk/nextjs";
import {
  InternalUsersHeader,
  type InternalUsersSort,
} from "./_components/internal-users-header";
import {
  type InternalUserFiltersState,
  InternalUsersFilters,
} from "./_components/internal-users-filters";
import {
  InternalUsersTable,
  type InternalUserTableItem,
} from "./_components/internal-users-table";
import InviteUserModal from "./_components/invite-user-modal";
import { ManageUserDetailsModal } from "./_components/manage-user-details-modal";

type InternalUsersFilterValues = InternalUserFiltersState & {
  search?: string;
};

export default function InternalUsersPage() {
  const { user } = useUser();
  const [filters, setFilters] = useState<InternalUsersFilterValues>({});
  const [sort, setSort] = useState<InternalUsersSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useInternalUsers();

  const resendInvitation = useResendInternalInvitation();
  const revokeInvitation = useRevokeInternalInvitation();
  const deactivateUser = useDeactivateInternalUser();
  const removeUser = useRemoveInternalUser();
  const activateUser = useActivateInternalUser();
  const updateInternalInvitation = useUpdateInternalInvitation();
  const updateInternalUserRole = useUpdateInternalUserRole();

  // Fallbacks using custom mutation per-user because we need dynamic URLs
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<InternalUserTableItem | null>(null);

  const users = useMemo<InternalUserTableItem[]>(
    () => (data?.items || []) as InternalUserTableItem[],
    [data],
  );

  const canManage =
    user?.publicMetadata?.role === "super-admin" ||
    user?.publicMetadata?.role === "super_admin";

  const totalUsers = users.length;

  const filteredUsers = useMemo<InternalUserTableItem[]>(() => {
    const searchTerm = filters.search?.toLowerCase().trim();
    const roleFilter =
      filters.role && filters.role !== "all" ? filters.role : undefined;
    const statusFilter =
      filters.status && filters.status !== "all" ? filters.status : undefined;
    const createdFilter =
      filters.createdAt && filters.createdAt !== "all"
        ? filters.createdAt
        : undefined;

    const now = Date.now();
    const durationMap: Record<string, number> = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    };

    const createdThreshold =
      createdFilter && createdFilter !== "year"
        ? now - durationMap[createdFilter]
        : null;
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();

    const matchesCreatedAt = (user: InternalUserTableItem) => {
      if (!createdFilter) return true;
      if (!user.createdAt) return false;
      const createdTime = new Date(user.createdAt).getTime();
      if (Number.isNaN(createdTime)) return false;
      if (createdFilter === "year") {
        return createdTime >= startOfYear;
      }
      if (!createdThreshold) return true;
      return createdTime >= createdThreshold;
    };

    const sorted = [...users]
      .filter((user) => {
        if (searchTerm) {
          const haystack =
            `${user.name ?? ""} ${user.email ?? ""} ${user.phoneNumber ?? ""}`.toLowerCase();
          if (!haystack.includes(searchTerm)) {
            return false;
          }
        }
        if (roleFilter && user.role !== roleFilter) {
          return false;
        }
        if (statusFilter && user.status !== statusFilter) {
          return false;
        }
        if (!matchesCreatedAt(user)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const direction = sort.sortOrder === "asc" ? 1 : -1;
        if (sort.sortBy === "name") {
          const nameA = (a.name ?? "").toLowerCase();
          const nameB = (b.name ?? "").toLowerCase();
          if (nameA === nameB) return 0;
          return nameA > nameB ? direction : -direction;
        }
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA === dateB) return 0;
        return dateA > dateB ? direction : -direction;
      });

    return sorted;
  }, [users, filters, sort]);

  const hasActiveFilters =
    !!filters.role || !!filters.status || !!filters.createdAt;
  const hasSearch = !!filters.search && filters.search.trim().length > 0;

  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalFiltered, currentPage * pageSize);

  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize,
      ),
    [filteredUsers, currentPage, pageSize],
  );

  const setFilterValue = <K extends keyof InternalUsersFilterValues>(
    key: K,
    value: InternalUsersFilterValues[K],
  ) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, search: undefined }));
    setPage(1);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleDownload = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Created At",
      "Updated At",
    ];
    const rows = filteredUsers.map((user) => [
      user.name ?? "",
      user.email ?? "",
      user.phoneNumber ?? "",
      user.role ?? "",
      user.status,
      formatDate(user.createdAt),
      formatDate(user.updatedAt),
    ]);

    const escapeCell = (cell: string) => {
      const needsEscaping =
        cell.includes(",") || cell.includes('"') || cell.includes("\n");
      const sanitized = cell.replace(/"/g, '""');
      return needsEscaping ? `"${sanitized}"` : sanitized;
    };

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCell(String(cell))).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `internal-users-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  async function onResend(invitationId?: string | null) {
    if (!invitationId) return;
    setActionBusyId(invitationId);
    try {
      await resendInvitation.mutateAsync({ invitationId });
      toast.success("Invitation resent successfully!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend invitation. Please try again.";
      toast.error(message);
    } finally {
      setActionBusyId(null);
    }
  }

  async function onRevoke(invitationId?: string | null) {
    if (!invitationId) return;
    setActionBusyId(invitationId);
    try {
      await revokeInvitation.mutateAsync({ invitationId });
    } finally {
      setActionBusyId(null);
    }
  }

  async function onDeactivate(clerkId?: string | null) {
    if (!clerkId) return;
    setActionBusyId(clerkId);
    try {
      await deactivateUser.mutateAsync({ clerkId });
    } finally {
      setActionBusyId(null);
    }
  }

  async function onRemove(clerkId?: string | null) {
    if (!clerkId) return;
    setActionBusyId(clerkId);
    try {
      await removeUser.mutateAsync({ clerkId });
    } finally {
      setActionBusyId(null);
    }
  }

  async function onActivate(clerkId?: string | null) {
    if (!clerkId) return;
    setActionBusyId(clerkId);
    try {
      await activateUser.mutateAsync({ clerkId });
    } finally {
      setActionBusyId(null);
    }
  }

  const handleManageUser = (user: InternalUserTableItem) => {
    if (!canManage) return;
    setSelectedUser(user);
    setManageModalOpen(true);
  };

  const handleSaveUser = async (payload: {
    email: string;
    role: "super-admin" | "admin" | "member";
  }) => {
    if (!selectedUser) return;

    const isPending = selectedUser.status === "pending";
    const hasInvitationId = !!selectedUser.invitationId;
    const hasClerkId = !!selectedUser.clerkId;

    if (isPending && !hasInvitationId) return;
    if (!isPending && !hasClerkId) return;

    const originalEmail = selectedUser.email;

    setActionBusyId(selectedUser.clerkId || selectedUser.invitationId || null);
    try {
      if (isPending && selectedUser.invitationId) {
        const body: UpdateInvitationBody = {
          email: payload.email,
          role: payload.role,
        };

        await updateInternalInvitation.mutateAsync({
          id: selectedUser.invitationId,
          data: body,
        });

        if (payload.email !== originalEmail) {
          await resendInvitation.mutateAsync({
            invitationId: selectedUser.invitationId,
          });
        }
      } else if (selectedUser.clerkId) {
        const body: UpdateUserRoleBody = {
          role: payload.role,
        };

        await updateInternalUserRole.mutateAsync({
          clerkUserId: selectedUser.clerkId,
          data: body,
        });
      }

      toast.success("User details updated successfully.");
      setManageModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update user details. Please try again.";
      toast.error(message);
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-md">
      <InternalUsersHeader
        total={totalUsers}
        searchValue={filters.search}
        filtersVisible={filtersVisible}
        sort={sort}
        onSearchChange={(value) => setFilterValue("search", value || undefined)}
        onClearSearch={handleClearSearch}
        onSortChange={setSort}
        onToggleFilters={() => setFiltersVisible((prev) => !prev)}
        onDownload={handleDownload}
        onAddUser={() => setInviteModalOpen(true)}
        canManage={canManage}
        hasData={filteredUsers.length > 0}
      />

      <InternalUsersFilters
        values={filters}
        visible={filtersVisible}
        onValueChange={(key, value) => setFilterValue(key, value)}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setFilters((prev) => ({
            ...prev,
            role: undefined,
            status: undefined,
            createdAt: undefined,
          }));
        }}
      />

      <InternalUsersTable
        data={paginatedUsers}
        isLoading={isLoading}
        onAddUser={() => setInviteModalOpen(true)}
        onManageUser={handleManageUser}
        onResendInvitation={onResend}
        onRevokeInvitation={onRevoke}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        onRemove={onRemove}
        actionBusyId={actionBusyId}
        canManage={canManage}
        currentUserId={user?.id}
        isFiltered={hasActiveFilters || hasSearch}
      />

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
            users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                if (currentPage > 1) {
                  setPage(currentPage - 1);
                }
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
                if (currentPage < totalPages) {
                  setPage(currentPage + 1);
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <InviteUserModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onInvited={() => {
          // Data will refresh automatically via react-query
        }}
      />

      <ManageUserDetailsModal
        open={manageModalOpen}
        onOpenChange={(open) => {
          setManageModalOpen(open);
          if (!open) {
            setSelectedUser(null);
          }
        }}
        user={selectedUser}
        canManage={canManage}
        isSaving={
          updateInternalInvitation.isPending || updateInternalUserRole.isPending
        }
        onSave={handleSaveUser}
      />
    </div>
  );
}
