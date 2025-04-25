"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
}

export function GradientButton({
  className,
  children,
  size = "default",
  ...props
}: GradientButtonProps) {
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-md font-medium text-white transition-all",
        "border-0 shadow-sm",
        "bg-gradient-to-r from-emerald-400/90 to-pink-500/90",
        "hover:from-emerald-500/90 hover:to-pink-600/90",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
