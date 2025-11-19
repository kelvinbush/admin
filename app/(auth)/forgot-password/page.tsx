"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { EmailStep } from "./_components/email-step";
import { CodeStep } from "./_components/code-step";
import { PasswordStep } from "./_components/password-step";

type Step = "email" | "code" | "password";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      toast.success("Password reset code sent to your email!");
      setStep("code");
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Failed to send reset code. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      if (result.status === "needs_new_password") {
        setStep("password");
      } else {
        setError("Invalid or expired code. Please try again.");
        toast.error("Invalid or expired code. Please try again.");
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Invalid code. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Password reset successfully! You are now signed in.");
        router.push("/");
      } else {
        setError("Password reset incomplete. Please try again.");
        toast.error("Password reset incomplete. Please try again.");
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Failed to reset password. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeStepBack = () => {
    setStep("email");
    setCode("");
    setError(null);
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    setIsResending(true);
    setError(null);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      toast.success("Verification code resent to your email!");
      setCode("");
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Failed to resend code. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordStepBack = () => {
    setStep("code");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    router.push("/sign-in");
  };

  return (
    <Card className="w-full max-w-7xl bg-white p-8 md:p-10 shadow-lg md:min-w-[600px]">
      <div className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === "email" && (
          <EmailStep
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleRequestReset}
            isSubmitting={isSubmitting}
            isLoaded={isLoaded}
          />
        )}

        {step === "code" && (
          <CodeStep
            code={code}
            email={email}
            onCodeChange={setCode}
            onSubmit={handleVerifyCode}
            onBack={handleCodeStepBack}
            onResend={handleResendCode}
            isSubmitting={isSubmitting}
            isResending={isResending}
            isLoaded={isLoaded}
          />
        )}

        {step === "password" && (
          <PasswordStep
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleResetPassword}
            onBack={handlePasswordStepBack}
            isSubmitting={isSubmitting}
            isLoaded={isLoaded}
          />
        )}
      </div>
    </Card>
  );
}
