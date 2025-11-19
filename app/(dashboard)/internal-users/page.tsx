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
  type InternalUserItem,
} from "@/lib/api/hooks/internal-users";
import { InternalUsersHeader, type InternalUsersSort } from "./_components/internal-users-header";
import {
  InternalUsersFilters,
  type InternalUserFiltersState,
} from "./_components/internal-users-filters";

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

  const queryFilters = useMemo(() => {
    const payload: Record<string, string> = {};
    if (filters.search) {
      payload.search = filters.search;
    }
    if (filters.role && filters.role !== "all") {
      payload.role = filters.role;
    }
    if (filters.status && filters.status !== "all") {
      payload.status = filters.status;
    }
    if (filters.createdAt && filters.createdAt !== "all") {
      payload.createdAt = filters.createdAt;
    }
    payload.sortBy = sort.sortBy;
    payload.sortOrder = sort.sortOrder;
    return payload;
  }, [filters, sort]);

  const { data, isLoading, error } = useInternalUsers(queryFilters);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"super-admin" | "admin" | "member">(
    "member",
  );

  const createInvite = useCreateInternalInvite();
  const resendInvitation = useResendInternalInvitation();
  const revokeInvitation = useRevokeInternalInvitation();
  const deactivateUser = useDeactivateInternalUser();
  const removeUser = useRemoveInternalUser();
  const activateUser = useActivateInternalUser();

  // Fallbacks using custom mutation per-user because we need dynamic URLs
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const users = useMemo<InternalUserItem[]>(() => data?.items || [], [data]);

  const totalUsers = users.length;

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

  const handleDownload = () => {
    // TODO: wire up export action
    console.info("Download internal users");
  };

  async function onCreateInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    await createInvite.mutateAsync({ email, role });
    setEmail("");
    setRole("member");
  }

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
        onAddUser={() => {
          // placeholder action until invite modal is wired up
          console.info("Open create user dialog");
        }}
      />

      <InternalUsersFilters
        values={filters}
        visible={filtersVisible}
        onValueChange={(key, value) => setFilterValue(key, value)}
        onApply={() => {
          // Filters already reactive; button exists to match UI
        }}
      />

      <div>Table with empty state here</div>
      <div>Pagination here</div>
    </div>
  );
}
