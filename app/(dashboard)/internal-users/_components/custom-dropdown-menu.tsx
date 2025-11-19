"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
  disabled,
}: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  const triggerRef = useRef<HTMLElement>(null);

  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  useEffect(() => {
    if (triggerRef.current) {
      triggerRefs.set(context, triggerRef.current);
    }
  }, [context]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    context.setOpen(!context.open);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      disabled,
      className: cn(className, childProps.className),
    } as any);
  }

  return (
    <button
      ref={triggerRef as any}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}

const triggerRefs = new WeakMap<DropdownMenuContextValue, HTMLElement>();

export function DropdownMenuContent({
  children,
  align = "start",
  className,
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

  useEffect(() => {
    if (!context.open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const trigger = triggerRefs.get(context);
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        trigger &&
        !trigger.contains(event.target as Node)
      ) {
        context.setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [context.open, context]);

  useEffect(() => {
    if (!context.open || !contentRef.current) return;

    const content = contentRef.current;
    const trigger = triggerRefs.get(context);
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = triggerRect.bottom + 4;
    let left = triggerRect.left;

    if (align === "end") {
      left = triggerRect.right - contentRect.width;
    } else if (align === "center") {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    }

    // Adjust if content goes off screen
    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - 8;
    }
    if (left < 8) {
      left = 8;
    }
    if (top + contentRect.height > viewportHeight) {
      top = triggerRect.top - contentRect.height - 4;
    }

    content.style.top = `${top}px`;
    content.style.left = `${left}px`;
  }, [context.open, align, context]);

  if (!context.open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-midnight-blue shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{ position: "fixed" }}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled,
  className,
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuItem must be used within DropdownMenu");

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    context.setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-primaryGrey-50 focus:bg-primaryGrey-50",
        disabled && "pointer-events-none opacity-50",
        "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return <div className={cn("-mx-1 my-1 h-px bg-primaryGrey-100", className)} />;
}

