import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { Roles } from '@/lib/types/global'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/accept-invite(.*)', '/forgot-password(.*)'])

const ALLOWED_ROLES: Roles[] = ['admin', 'member', 'super-admin']

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  const { sessionClaims } = await auth.protect()

  const userRole = sessionClaims?.metadata?.role as Roles | undefined

  if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}