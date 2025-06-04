"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Organization } from "./organizations-table";

interface DeleteOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  organizationName: string;
}

export function DeleteOrganizationModal({
  open,
  onClose,
  onConfirm,
  organizationName,
}: DeleteOrganizationModalProps) {
  const [, setIsHovered] = useState(false);

  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="sm:text-center">
          <div className="mx-auto mb-4">
            <Icons.danger />
          </div>
          <DialogTitle className="text-4xl font-medium">
            Are you sure you want to delete this organization?
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 text-center">
          <p className="text-lg text-gray-600 mb-2">
            You are about to delete <span className="font-semibold">{organizationName}</span>
          </p>
          <p className="text-gray-500">
            This action cannot be undone. This will permanently delete the
            organization and remove all associated data.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-32 h-11"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-32 h-11 bg-red-600 hover:bg-red-700"
            size="lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
