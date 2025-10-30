'use client'

import { useSignUp } from '@clerk/nextjs'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AcceptInviteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, signUp, setActive } = useSignUp()

  const ticket = useMemo(() => searchParams.get('__clerk_ticket') || '', [searchParams])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
  }, [firstName, lastName, password, ticket])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isLoaded) return
    if (!ticket) {
      setError('Invitation ticket is missing or invalid.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const attempt = await signUp.create({
        strategy: 'ticket',
        ticket,
        firstName,
        lastName,
        password,
      })

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/internal')
      } else {
        setError('Unable to complete sign-up. Please check your details and try again.')
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || err?.message || 'Something went wrong.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-2 text-2xl font-semibold">Accept your invite</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Complete your account to access the internal dashboard.
      </p>
      {!ticket && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Missing invitation ticket. Please use the invite link from your email.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input
              id="firstName"
              name="firstName"
              required
              className="w-full rounded-md border px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input
              id="lastName"
              name="lastName"
              required
              className="w-full rounded-md border px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={!isLoaded || !ticket || submitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">Loading…</div>}>
      <AcceptInviteForm />
    </Suspense>
  )
}


