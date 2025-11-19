"use client";

import { useMemo, useState } from "react";
import {
  useInternalUsers,
  useCreateInternalInvite,
  useDeactivateInternalUser,
  useRemoveInternalUser,
  useResendInternalInvitation,
  useRevokeInternalInvitation,
  useActivateInternalUser,
} from "@/lib/api/hooks/internal-users";
import { InternalUsersHeader, type InternalUsersSort } from "./_components/internal-users-header";
import {
  InternalUsersFilters,
  type InternalUserFiltersState,
} from "./_components/internal-users-filters";
import { InternalUsersTable, type InternalUserTableItem } from "./_components/internal-users-table";
import InviteUserModal from "./_components/invite-user-modal";

type InternalUsersFilterValues = InternalUserFiltersState & {
  search?: string;
};

export default function InternalUsersPage() {
  const [filters, setFilters] = useState<InternalUsersFilterValues>({});
  const [sort, setSort] = useState<InternalUsersSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { data, isLoading, error } = useInternalUsers();

  const resendInvitation = useResendInternalInvitation();
  const revokeInvitation = useRevokeInternalInvitation();
  const deactivateUser = useDeactivateInternalUser();
  const removeUser = useRemoveInternalUser();
  const activateUser = useActivateInternalUser();

  // Fallbacks using custom mutation per-user because we need dynamic URLs
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const users = useMemo<InternalUserTableItem[]>(() => (data?.items || []) as InternalUserTableItem[], [data]);

  const totalUsers = users.length;

  const filteredUsers = useMemo<InternalUserTableItem[]>(() => {
    const searchTerm = filters.search?.toLowerCase().trim();
    const roleFilter = filters.role && filters.role !== "all" ? filters.role : undefined;
    const statusFilter = filters.status && filters.status !== "all" ? filters.status : undefined;
    const createdFilter = filters.createdAt && filters.createdAt !== "all" ? filters.createdAt : undefined;

    const now = Date.now();
    const durationMap: Record<string, number> = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    };

    const createdThreshold =
      createdFilter && createdFilter !== "year" ? now - durationMap[createdFilter] : null;
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
          const haystack = `${user.name ?? ""} ${user.email ?? ""} ${user.phoneNumber ?? ""}`.toLowerCase();
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

  const setFilterValue = <K extends keyof InternalUsersFilterValues,>(
    key: K,
    value: InternalUsersFilterValues[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, search: undefined }));
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
    const headers = ["Name", "Email", "Phone", "Role", "Status", "Created At", "Updated At"];
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
      const needsEscaping = cell.includes(",") || cell.includes("\"") || cell.includes("\n");
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
    link.setAttribute("download", `internal-users-${new Date().toISOString().slice(0, 10)}.csv`);
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
      />

      <InternalUsersFilters
        values={filters}
        visible={filtersVisible}
        onValueChange={(key, value) => setFilterValue(key, value)}
        onApply={() => {
          // Filters already reactive; button exists to match UI
        }}
      />

      <InternalUsersTable
        data={filteredUsers}
        isLoading={isLoading}
        onAddUser={() => setInviteModalOpen(true)}
        onResendInvitation={onResend}
        onRevokeInvitation={onRevoke}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        onRemove={onRemove}
        actionBusyId={actionBusyId}
      />

      <InviteUserModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onInvited={() => {
          // Data will refresh automatically via react-query
        }}
      />
    </div>
  );
}
