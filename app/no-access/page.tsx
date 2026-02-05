import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default async function NoAccessPage() {
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-8 space-y-5">
        <h1 className="text-xl font-semibold text-midnight-blue">
          You don&apos;t have access to this admin portal
        </h1>
        <p className="text-sm text-primaryGrey-600">
          {email ? (
            <>
              The account <span className="font-medium text-midnight-blue">{email}</span>{" "}
              is signed in but doesn&apos;t have the required admin role.
            </>
          ) : (
            "You are signed in but your account doesn't have the required admin role."
          )}
        </p>
        <p className="text-sm text-primaryGrey-600">
          Please contact your platform administrator to request access, or log out and sign
          in with a different account that has admin permissions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-primaryGrey-300 px-4 text-sm font-medium text-midnight-blue hover:bg-primaryGrey-50 transition-colors"
          >
            Go to homepage
          </Link>
          <SignOutButton redirectUrl="/sign-in">
            <button className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
              Log out and switch account
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

