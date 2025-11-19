"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil } from "lucide-react";

interface CodeStepProps {
  code: string;
  email: string;
  onCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onResend: () => void;
  isSubmitting: boolean;
  isResending: boolean;
  isLoaded: boolean;
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  
  if (localPart.length <= 3) {
    return `${localPart[0]}***@${domain}`;
  }
  
  const visibleChars = localPart.slice(0, 3);
  return `${visibleChars}***@${domain}`;
}

export function CodeStep({
  code,
  email,
  onCodeChange,
  onSubmit,
  onBack,
  onResend,
  isSubmitting,
  isResending,
  isLoaded,
}: CodeStepProps) {
  const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync codeDigits with code prop
  useEffect(() => {
    const digits = code.split("").slice(0, 6);
    const newDigits = [...digits];
    while (newDigits.length < 6) {
      newDigits.push("");
    }
    setCodeDigits(newDigits);
  }, [code]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    const newDigits = [...codeDigits];
    newDigits[index] = value.replace(/\D/g, "");
    setCodeDigits(newDigits);
    
    // Update parent code state
    const newCode = newDigits.join("");
    onCodeChange(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = pastedData.split("").slice(0, 6);
    const paddedDigits = [...newDigits];
    while (paddedDigits.length < 6) {
      paddedDigits.push("");
    }
    setCodeDigits(paddedDigits);
    onCodeChange(pastedData);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      {/* Icon/Image at top */}
      <div className="flex justify-center mb-6">
        <Image
          src="/chek-mail.gif"
          alt="Check your mail"
          width={200}
          height={200}
          className="w-auto h-32"
          unoptimized
        />
      </div>

      {/* Heading and Description - Centered */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-midnight-blue mb-2">
          Check your mail
        </h1>
        <p className="text-sm text-primaryGrey-500">
          Please enter the verification code that was sent to your email
        </p>
      </div>

      {/* Email display with edit button */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-primary-green font-medium">
          {maskEmail(email)}
        </span>
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-primaryGrey-50 rounded transition-colors"
          aria-label="Edit email"
        >
          <Pencil className="h-4 w-4 text-midnight-blue" />
        </button>
      </div>

      {/* Code input fields */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex justify-center gap-2">
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg font-medium border border-primaryGrey-200 rounded-md bg-primaryGrey-50 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
              required
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={!isLoaded || isSubmitting || code.length !== 6}
          className="w-full h-11 text-white border-0"
          style={{
            background:
              "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
            opacity: isSubmitting || code.length !== 6 ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
      </form>

      {/* Resend code link */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="text-sm text-primaryGrey-500"
        >
          Didn't receive the code?{" "}
          <span className="text-primary-green hover:underline">
            {isResending ? "Sending..." : "Resend Code"}
          </span>
        </button>
      </div>
    </>
  );
}
