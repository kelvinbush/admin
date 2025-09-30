"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInForm() {
  return (
    <div className="w-full p-6">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-midnight-blue">
          Sign in to your account
        </h2>
        <p className="mt-2 text-2xl text-midnight-blue">
          Welcome! Please provide the following to continue
        </p>
      </div>
      <div className="flex justify-center">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#00B67C] hover:bg-[#00B67C]/90",
              card: "shadow-none",
            }
          }}
        />
      </div>
    </div>
  );
}
