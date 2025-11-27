"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";

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

interface PasswordRequirement {
  id: string;
  label: string;
  description: string;
  check: (password: string, confirmPassword: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "8 Char",
    description: "Must be at least 8 characters long",
    check: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "1 Uppercase",
    description: "Must have at least 1 uppercase letter",
    check: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "1 Lowercase",
    description: "Must have at least 1 lowercase letter",
    check: (password) => /[a-z]/.test(password),
  },
  {
    id: "digit",
    label: "1 Digit",
    description: "Must have at least 1 number",
    check: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "1 Special",
    description: "Must have at least 1 special character from !@#$%^&*",
    check: (password) => /[!@#$%^&*]/.test(password),
  },
  {
    id: "match",
    label: "*_*",
    description: "Passwords must match",
    check: (password, confirmPassword) => password === confirmPassword && password.length > 0,
  },
];

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

  const requirementStatuses = useMemo(() => {
    return requirements.map((req) => ({
      ...req,
      fulfilled: req.check(password, confirmPassword),
    }));
  }, [password, confirmPassword]);

  const allRequirementsMet = requirementStatuses.every((req) => req.fulfilled);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-midnight-blue mb-2">
          Create new password
        </h1>
        <p className="text-sm text-primaryGrey-500">
          Your password must be different from your previously used passwords
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-midnight-blue">
            New password <span className="text-red-500">*</span>
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
            Confirm password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter confirm password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              required
              className="h-11 pr-10"
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

        {/* Password Requirements Grid */}
        <div className="grid grid-cols-3 gap-2">
          {requirementStatuses.map((req) => (
            <div
              key={req.id}
              className={`relative px-2 py-3 rounded-md border transition-colors ${
                req.fulfilled
                  ? "border-primary-green bg-primary-green/5"
                  : "border-primaryGrey-200 bg-white"
              }`}
            >
              {req.fulfilled && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-green rounded-full flex items-center justify-center border-2 border-white">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-center font-medium text-midnight-blue">{req.label}</p>
                <p className="text-xs text-center text-primaryGrey-400 ">{req.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={!isLoaded || isSubmitting || !allRequirementsMet}
          className="w-full h-11 text-white border-0"
          style={{
            background:
              "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
            opacity: isSubmitting || !allRequirementsMet ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {/* Back link */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-midnight-blue hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </>
  );
}
