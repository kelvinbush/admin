"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ConfirmActionModalVariant = "orange" | "red";

interface ConfirmActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText: string;
  variant?: ConfirmActionModalVariant;
  isLoading?: boolean;
}

const WarningIcon = ({ color }: { color: string }) => (
  <svg width="80" height="80" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M48 23.8125C49.5 23.8125 51 25.3125 51 26.8125V50.8125C51 52.5 49.5 53.8125 48 53.8125C46.3125 53.8125 45 52.5 45 50.8125V26.8125C45 25.3125 46.3125 23.8125 48 23.8125ZM52.5 65.8125C52.5 68.4375 50.4375 70.3125 48 70.3125C45.375 70.3125 43.5 68.4375 43.5 65.8125C43.5 63.375 45.375 61.3125 48 61.3125C50.4375 61.3125 52.5 63.375 52.5 65.8125ZM0 35.8125C0 32.25 1.3125 28.875 3.9375 26.25L26.25 3.9375C28.875 1.3125 32.25 0 35.8125 0H60C63.5625 0 66.9375 1.3125 69.5625 3.9375L91.875 26.25C94.5 28.875 95.8125 32.25 95.8125 35.8125V60C95.8125 63.5625 94.5 66.9375 91.875 69.5625L69.5625 91.875C66.9375 94.5 63.5625 95.8125 60 95.8125H35.8125C32.25 95.8125 28.875 94.5 26.25 91.875L3.9375 69.5625C1.3125 66.9375 0 63.5625 0 60V35.8125ZM8.0625 30.5625C6.75 31.875 6 33.75 6 35.8125V60C6 62.0625 6.75 63.9375 8.0625 65.25L30.5625 87.75C31.875 89.0625 33.75 89.8125 35.8125 89.8125H60C62.0625 89.8125 63.9375 89.0625 65.25 87.75L87.75 65.25C89.0625 63.9375 89.8125 62.0625 89.8125 60V35.8125C89.8125 33.75 89.0625 31.875 87.75 30.5625L65.25 8.0625C63.9375 6.75 62.0625 6 60 6H35.8125C33.75 6 31.875 6.75 30.5625 8.0625L8.0625 30.5625ZM8.0625 65.25L3.9375 69.5625L8.0625 65.25Z" fill={color}/>
  </svg>
);

export function ConfirmActionModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmButtonText,
  variant = "orange",
  isLoading = false,
}: ConfirmActionModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isRed = variant === "red";
  const buttonBgColor = isRed ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600";

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
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
        if (!isLoading) {
          onOpenChange(false);
        }
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
  }, [open, onOpenChange, isLoading]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isLoading) {
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
              onClick={() => !isLoading && onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <WarningIcon color={isRed ? "#A71525" : "#F97316"} />
            </div>
          </div>

          <h2 className="text-2xl font-medium text-midnight-blue mb-3">
            {title}
          </h2>

          <p className="text-primaryGrey-400 mb-6">
            {description}
          </p>

          <div className="mt-6 w-full flex flex-col sm:flex-row sm:justify-center gap-5">
            <Button
            size="lg"
              onClick={() => !isLoading && onOpenChange(false)}
              disabled={isLoading}
              variant="outline"
              className="bg-white border border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50 font-normal"
            >
              No, Cancel
            </Button>
            <Button
            size="lg"
              onClick={onConfirm}
              disabled={isLoading}
              className={`${buttonBgColor} text-white border-0 font-normal`}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

