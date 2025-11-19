"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

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
  const isRed = variant === "red";
  const iconColor = isRed ? "text-red-500" : "text-orange-500";
  const iconBgColor = isRed ? "bg-red-500" : "bg-orange-500";
  const buttonBgColor = isRed ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[500px] p-0 overflow-hidden">
        <div className="px-8 py-8 flex flex-col items-center text-center">
          <AlertDialogHeader className="w-full">
            <div className="flex justify-center mb-4">
              <div className={`relative flex items-center justify-center w-20 h-20 ${iconBgColor}`} style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}>
                <AlertTriangle className="h-10 w-10 text-white" strokeWidth={2} fill="currentColor" />
              </div>
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-midnight-blue mb-2">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-primaryGrey-500">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 w-full sm:justify-center gap-3">
            <AlertDialogCancel
              disabled={isLoading}
              className="bg-white border border-primaryGrey-200 text-midnight-blue hover:bg-primaryGrey-50"
            >
              No, Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className={`${buttonBgColor} text-white border-0`}
            >
              {confirmButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

