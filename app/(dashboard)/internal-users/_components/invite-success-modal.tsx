"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface InviteSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export default function InviteSuccessModal({
  open,
  onOpenChange,
  email,
}: InviteSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden">
        <div className="px-8 py-8 flex flex-col items-center text-center">
          <DialogHeader className="w-full">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle2 className="h-20 w-20 text-primary-green" strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
                      fill="#00CC99"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-medium text-midnight-blue mb-4">
              Invite Sent Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="w-full mb-6">
            <p className="text-sm text-primaryGrey-500">
              An email has been sent to{" "}
              <span className="text-blue-600 font-medium">{email}</span>.
              Please advise the user to check their inbox and follow the
              instructions to set a new secure password.
            </p>
          </div>

          <Button
            size="lg"
            className="text-white border-0 w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
            }}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

