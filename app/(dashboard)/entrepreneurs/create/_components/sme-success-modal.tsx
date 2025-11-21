"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SMESuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

const SuccessIcon = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M35.8125 6C33.75 6 31.875 6.75 30.5625 8.0625L8.0625 30.5625C6.75 31.875 6 33.75 6 35.8125V60C6 62.0625 6.75 63.9375 8.0625 65.25L3.9375 69.5625C1.3125 66.9375 0 63.5625 0 60V35.8125C0 32.25 1.3125 28.875 3.9375 26.25L26.25 3.9375C28.875 1.3125 32.25 0 35.8125 0H60C63.5625 0 66.9375 1.3125 69.5625 3.9375L91.875 26.25C94.5 28.875 95.8125 32.25 95.8125 35.8125V60C95.8125 63.5625 94.5 66.9375 91.875 69.5625L69.5625 91.875C66.9375 94.5 63.5625 95.8125 60 95.8125H35.8125C32.25 95.8125 28.875 94.5 26.25 91.875L3.9375 69.5625L8.0625 65.25L30.5625 87.75C31.875 89.0625 33.75 89.8125 35.8125 89.8125H60C62.0625 89.8125 63.9375 89.0625 65.25 87.75L87.75 65.25C89.0625 63.9375 89.8125 62.0625 89.8125 60V35.8125C89.8125 33.75 89.0625 31.875 87.75 30.5625L65.25 8.0625C63.9375 6.75 62.0625 6 60 6H35.8125ZM44.0625 62.0625C42.9375 63.1875 40.875 63.1875 39.75 62.0625L27.75 50.0625C26.625 48.9375 26.625 46.875 27.75 45.75C28.875 44.625 30.9375 44.625 32.0625 45.75L42 55.6875L63.75 33.75C64.875 32.625 66.9375 32.625 68.0625 33.75C69.1875 34.875 69.1875 36.9375 68.0625 38.0625L44.0625 62.0625Z" fill="#00CC99"/>
  </svg>
);

export function SMESuccessModal({
  open,
  onOpenChange,
  email,
}: SMESuccessModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        overlayRef.current &&
        overlayRef.current === e.target
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={contentRef}
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-[800px] translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95"
      >
        <div className="px-8 py-16 flex flex-col items-center text-center">
          <div className="w-full mb-4">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <SuccessIcon />
            </div>
          </div>

          <h2 className="text-2xl font-medium text-midnight-blue mb-3">
            SME added successfully!
          </h2>

          <p className="text-primaryGrey-400 mb-6">
            An email has been sent to{" "}
            <span className="text-blue-600 font-medium">{email}</span>. Please advise the user to check their inbox and follow the instructions to set a new secure password.
          </p>

          <div className="mt-6 w-full flex justify-center">
            <Button
              size="lg"
              onClick={() => onOpenChange(false)}
              className="text-white border-0 font-normal"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


