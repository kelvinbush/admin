"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InternalUserTableItem } from "./internal-users-table";

type ManageUserDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: InternalUserTableItem | null;
  canManage: boolean;
  isSaving?: boolean;
  onSave: (data: {
    name: string;
    email: string;
    phoneNumber?: string;
    role: "super-admin" | "admin" | "member";
  }) => Promise<void> | void;
};

const roleOptions: Array<{ label: string; value: "super-admin" | "admin" | "member" }> = [
  { label: "Super Admin", value: "super-admin" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
];

export function ManageUserDetailsModal({
  open,
  onOpenChange,
  user,
  canManage,
  isSaving = false,
  onSave,
}: ManageUserDetailsModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"super-admin" | "admin" | "member">("member");

  useEffect(() => {
    if (open && user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setRole((user.role as "super-admin" | "admin" | "member") || "member");
    }
  }, [open, user]);

  if (!open || !user) return null;

  const isPending = user.status === "pending";
  const canEditDetails = canManage && isPending;
  const canEditEmail = canEditDetails;
  const canEditRole = canManage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    await onSave({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      role,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onOpenChange(false);
        }
      }}
    >
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
        <div className="px-8 py-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-medium text-midnight-blue mb-1">
                Manage user details
              </h2>
              <p className="text-sm text-primaryGrey-400">
                View or update the user&apos;s details below
              </p>
            </div>
            <button
              onClick={() => !isSaving && onOpenChange(false)}
              className="rounded-sm opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
              disabled={isSaving}
            >
              <X className="h-4 w-4 text-primaryGrey-400" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-midnight-blue font-medium">
                  Full name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  disabled={!canEditDetails || isSaving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-midnight-blue font-medium">
                  Email address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  disabled={!canEditEmail || isSaving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-midnight-blue font-medium">
                  Phone number (Optional)
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  disabled={!canEditDetails || isSaving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-midnight-blue font-medium">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select
                  value={role}
                  onValueChange={(val) =>
                    setRole(val as "super-admin" | "admin" | "member")
                  }
                  disabled={!canEditRole || isSaving}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSaving || !canManage}
                className="text-white border-0"
                style={{
                  background:
                    "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                }}
              >
                {isSaving ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

