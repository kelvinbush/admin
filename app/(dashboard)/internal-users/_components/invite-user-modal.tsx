"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInternalInvite } from "@/lib/api/hooks/internal-users";
import InviteSuccessModal from "./invite-success-modal";

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: () => void;
}

const roleOptions = [
  { label: "Super Admin", value: "super-admin" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
];

export default function InviteUserModal({
  open,
  onOpenChange,
  onInvited,
}: InviteUserModalProps) {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"super-admin" | "admin" | "member">(
    "member",
  );
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [invitedEmail, setInvitedEmail] = React.useState("");

  const createInvite = useCreateInternalInvite();

  const reset = () => {
    setFullName("");
    setEmail("");
    setRole("member");
  };

  const onSubmit = async () => {
    if (!email.trim()) return;

    try {
      await createInvite.mutateAsync({ email: email.trim(), role });
      const emailToShow = email.trim();
      reset();
      onOpenChange(false);
      setInvitedEmail(emailToShow);
      setSuccessModalOpen(true);
      if (onInvited) onInvited();
    } catch (error) {
      // Error handling is done by the mutation
      console.error("Failed to invite user:", error);
    }
  };

  const disableSubmit = !email.trim() || createInvite.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!createInvite.isPending) onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-[600px] p-0 overflow-hidden">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">
              Invite new user
            </DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Fill in the details below to invite a new user
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">
                Full name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">
                Email address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-midnight-blue font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as "super-admin" | "admin" | "member")
              }
            >
              <SelectTrigger className="mt-2">
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

          <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createInvite.isPending}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                opacity: disableSubmit ? 0.7 : 1,
              }}
              onClick={onSubmit}
              disabled={disableSubmit}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>

      <InviteSuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        email={invitedEmail}
      />
    </Dialog>
  );
}

