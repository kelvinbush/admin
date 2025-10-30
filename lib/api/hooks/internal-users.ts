"use client";

import { useClientApiMutation, useClientApiPost, useClientApiQuery } from "../hooks";
import { queryKeys } from "../query-keys";

export type InternalUserItem = {
  name?: string;
  imageUrl?: string;
  phoneNumber?: string;
  email: string;
  role?: "super-admin" | "admin" | "member";
  status: "pending" | "active" | "inactive";
  clerkId?: string;
  invitationId?: string;
};

export type InternalUsersResponse = {
  items: InternalUserItem[];
};

export function useInternalUsers(filters?: Record<string, any>) {
  return useClientApiQuery<InternalUsersResponse>(
    queryKeys.internalUsers.list(filters),
    "/admin/internal-users",
  );
}

export function useCreateInternalInvite() {
  return useClientApiPost<{ id: string }, { email: string; role: "super-admin" | "admin" | "member" }>(
    "/admin/internal-users/invitations",
  );
}

export function useResendInternalInvitation() {
  return useClientApiMutation<void, { invitationId: string }>(
    async (api, { invitationId }) => {
      return api.post<void>(`/admin/internal-users/invitations/${invitationId}/resend`);
    },
  );
}

export function useRevokeInternalInvitation() {
  return useClientApiMutation<void, { invitationId: string }>(
    async (api, { invitationId }) => {
      return api.post<void>(`/admin/internal-users/invitations/${invitationId}/revoke`);
    },
  );
}

export function useDeactivateInternalUser() {
  return useClientApiMutation<void, { clerkId: string }>(
    async (api, { clerkId }) => {
      return api.post<void>(`/admin/internal-users/${clerkId}/deactivate`);
    },
  );
}

export function useRemoveInternalUser() {
  return useClientApiMutation<void, { clerkId: string }>(
    async (api, { clerkId }) => {
      return api.delete<void>(`/admin/internal-users/${clerkId}`);
    },
  );
}


