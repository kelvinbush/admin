"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isLoaded: boolean;
}

export function EmailStep({
  email,
  onEmailChange,
  onSubmit,
  isSubmitting,
  isLoaded,
}: EmailStepProps) {
  return (
    <>
      {/* Icon/Image at top */}
      <div className="flex justify-center mb-6">
        <Image
          src="/forgot-password.gif"
          alt="Forgot password"
          width={200}
          height={200}
          className="w-auto h-32"
          unoptimized
        />
      </div>

      {/* Heading and Description - Centered */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-midnight-blue mb-2">
          Forgot your password?
        </h1>
        <p className="text-sm text-primaryGrey-500">
          Please enter your email address and we'll send you a verification code
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col items-center">
        <form onSubmit={onSubmit} className="w-full space-y-5">
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="h-11"
          />

          <Button
            type="submit"
            disabled={!isLoaded || isSubmitting}
            className="w-full h-11 text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Sending..." : "Send Password Reset Instructions"}
          </Button>
        </form>
      </div>

      {/* Back to Sign in link at bottom - Centered */}
      <div className="flex justify-center pt-4">
        <Link
          href="/sign-in"
          className="text-sm text-primary-green underline"
        >
          Back to Sign in
        </Link>
      </div>
    </>
  );
}

