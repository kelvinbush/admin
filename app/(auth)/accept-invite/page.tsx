"use client";

import { useSignUp } from "@clerk/nextjs";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

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

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signUp, setActive } = useSignUp();

  const ticket = useMemo(() => searchParams.get("__clerk_ticket") || "", [searchParams]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requirementStatuses = useMemo(() => {
    return requirements.map((req) => ({
      ...req,
      fulfilled: req.check(password, confirmPassword),
    }));
  }, [password, confirmPassword]);

  const allRequirementsMet = requirementStatuses.every((req) => req.fulfilled);

  const validatePassword = (pwd: string, confirm: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(pwd)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      return "Password must contain at least one special character (!@#$%^&*).";
    }
    if (pwd !== confirm) {
      return "Passwords do not match.";
    }
    return null;
  };

  useEffect(() => {
    setError(null);
  }, [firstName, lastName, password, confirmPassword, ticket]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;
    if (!ticket) {
      const errorMessage = "Invitation ticket is missing or invalid.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const attempt = await signUp.create({
        strategy: "ticket",
        ticket,
        firstName,
        lastName,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        toast.success("Account created successfully! You are now signed in.");
        router.replace("/");
      } else {
        const errorMessage = "Unable to complete sign-up. Please check your details and try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message || err?.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-7xl bg-white p-8 md:p-10 shadow-lg md:min-w-[600px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-midnight-blue mb-2">
            Accept your invite
          </h1>
          <p className="text-sm text-primaryGrey-500">
            Complete your account to access the internal dashboard.
          </p>
        </div>

        {!ticket && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Missing invitation ticket. Please use the invite link from your email.
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-midnight-blue">
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-midnight-blue">
                Last name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-midnight-blue">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <p className="text-xs text-center text-primaryGrey-400">{req.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={!isLoaded || !ticket || submitting || !allRequirementsMet}
            className="w-full h-11 text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              opacity: submitting || !allRequirementsMet ? 0.7 : 1,
            }}
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">Loading…</div>}>
      <AcceptInviteForm />
    </Suspense>
  );
}

