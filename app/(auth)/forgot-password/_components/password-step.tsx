"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface PasswordStepProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  isSubmitting: boolean;
  isLoaded: boolean;
}

export function PasswordStep({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBack,
  isSubmitting,
  isLoaded,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-primaryGrey-500 hover:text-midnight-blue mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
        <h1 className="text-2xl font-semibold text-midnight-blue mb-2">
          Create new password
        </h1>
        <p className="text-sm text-primaryGrey-500">
          Please enter your new password. Make sure it's at least 8 characters long.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-midnight-blue">
            New Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              className="h-11 pr-10"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primaryGrey-400 hover:text-midnight-blue transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-midnight-blue">
            Confirm New Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              required
              className="h-11 pr-10"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primaryGrey-400 hover:text-midnight-blue transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 h-11"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isLoaded || isSubmitting}
            className="flex-1 h-11 text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </>
  );
}

