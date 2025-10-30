'use client'

import { useMemo, useState } from 'react'
import {
  useInternalUsers,
  useCreateInternalInvite,
  useDeactivateInternalUser,
  useRemoveInternalUser,
  useResendInternalInvitation,
  useRevokeInternalInvitation,
  type InternalUserItem,
} from '@/lib/api/hooks/internal-users'

export default function InternalUsersPage() {
  const { data, isLoading, error } = useInternalUsers()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'super-admin' | 'admin' | 'member'>('member')

  const createInvite = useCreateInternalInvite()
  const resendInvitation = useResendInternalInvitation()
  const revokeInvitation = useRevokeInternalInvitation()
  const deactivateUser = useDeactivateInternalUser()
  const removeUser = useRemoveInternalUser()

  // Fallbacks using custom mutation per-user because we need dynamic URLs
  const [actionBusyId, setActionBusyId] = useState<string | null>(null)

  const users = useMemo<InternalUserItem[]>(() => data?.items || [], [data])

  async function onCreateInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    await createInvite.mutateAsync({ email, role })
    setEmail('')
    setRole('member')
  }

  async function onResend(invitationId?: string | null) {
    if (!invitationId) return
    setActionBusyId(invitationId)
    try {
      await resendInvitation.mutateAsync({ invitationId })
    } finally {
      setActionBusyId(null)
    }
  }

  async function onRevoke(invitationId?: string | null) {
    if (!invitationId) return
    setActionBusyId(invitationId)
    try {
      await revokeInvitation.mutateAsync({ invitationId })
    } finally {
      setActionBusyId(null)
    }
  }

  async function onDeactivate(clerkId?: string | null) {
    if (!clerkId) return
    setActionBusyId(clerkId)
    try {
      await deactivateUser.mutateAsync({ clerkId })
    } finally {
      setActionBusyId(null)
    }
  }

  async function onRemove(clerkId?: string | null) {
    if (!clerkId) return
    setActionBusyId(clerkId)
    try {
      await removeUser.mutateAsync({ clerkId })
    } finally {
      setActionBusyId(null)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-semibold">Internal users</h1>
      <p className="mb-6 text-sm text-muted-foreground">Create and manage internal user invitations and access.</p>

      <form onSubmit={onCreateInvite} className="mb-6 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium" htmlFor="invite-email">Email</label>
          <input
            id="invite-email"
            type="email"
            required
            className="w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="invite-role">Role</label>
          <select
            id="invite-role"
            className="w-full rounded-md border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="super-admin">Super admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white"
        >
          Create invite
        </button>
      </form>

      {isLoading && <div>Loading users…</div>}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">Failed to load users.</div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead>
              <tr className="text-left text-sm">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={`${u.clerkId || u.invitationId || u.email}`} className="text-sm">
                  <td className="py-2 pr-4">{u.name || '—'}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.role || '—'}</td>
                  <td className="py-2 pr-4 capitalize">{u.status}</td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-2">
                      {u.status === 'pending' && u.invitationId && (
                        <>
                          <button
                            onClick={() => onResend(u.invitationId)}
                            disabled={actionBusyId === u.invitationId}
                            className="rounded-md border px-3 py-1"
                          >
                            {actionBusyId === u.invitationId ? 'Resending…' : 'Resend'}
                          </button>
                          <button
                            onClick={() => onRevoke(u.invitationId)}
                            disabled={actionBusyId === u.invitationId}
                            className="rounded-md border px-3 py-1"
                          >
                            {actionBusyId === u.invitationId ? 'Revoking…' : 'Revoke'}
                          </button>
                        </>
                      )}
                      {u.status !== 'pending' && u.clerkId && (
                        <>
                          <button
                            onClick={() => onDeactivate(u.clerkId)}
                            disabled={actionBusyId === u.clerkId}
                            className="rounded-md border px-3 py-1"
                          >
                            {actionBusyId === u.clerkId ? 'Updating…' : 'Deactivate'}
                          </button>
                          <button
                            onClick={() => onRemove(u.clerkId)}
                            disabled={actionBusyId === u.clerkId}
                            className="rounded-md border px-3 py-1 text-red-600"
                          >
                            {actionBusyId === u.clerkId ? 'Removing…' : 'Remove'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


