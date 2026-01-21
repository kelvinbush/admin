"use client";

import { useClerk, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSignIn = async () => {
    if (!signIn) {
      throw new Error("Authentication not ready. Please try again.");
    }

    const result = await signIn.create({
      identifier: email,
      password,
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      toast.success("Signed in successfully!");
      router.push("/");
    } else {
      throw new Error("Sign in incomplete. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // First attempt
      await performSignIn();
    } catch (err: any) {
      const rawMessage =
        err?.errors?.[0]?.message || err?.message || "Invalid email or password.";
      const code = err?.errors?.[0]?.code;

      const sessionConflict =
        code === "session_exists" ||
        (/session/i.test(rawMessage) && /exist|already/i.test(rawMessage));

      if (sessionConflict) {
        try {
          // If a session already exists, sign out and retry once
          await signOut();
          await performSignIn();
          return;
        } catch (retryErr: any) {
          const retryMessage =
            retryErr?.errors?.[0]?.message ||
            retryErr?.message ||
            "Failed to sign in after resetting your session. Please try again.";
          setError(retryMessage);
          toast.error(retryMessage);
          return;
        }
      }

      const message = rawMessage;
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-7xl bg-white p-8 md:p-10 shadow-lg md:min-w-[600px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-midnight-blue mb-2">
            Sign in to your account
          </h1>
          <p className="text-sm text-primaryGrey-500">
            Welcome! Please provide the following to continue
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-midnight-blue">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-midnight-blue">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
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

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary-green hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </Card>
  );
}
