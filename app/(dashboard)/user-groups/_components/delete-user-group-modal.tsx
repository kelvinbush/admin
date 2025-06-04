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
import { UserGroup } from "./user-groups-table";

interface DeleteUserGroupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userGroup: UserGroup | null;
}

export function DeleteUserGroupModal({
  open,
  onClose,
  onConfirm,
  userGroup,
}: DeleteUserGroupModalProps) {
  const [, setIsHovered] = useState(false);

  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  if (!userGroup) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="sm:text-center">
          <div className="mx-auto mb-4">
            <Icons.danger />
          </div>
          <DialogTitle className="text-4xl font-medium">
            Are you sure you want to delete this user group?
          </DialogTitle>
          <p className="text-center text-gray-500 mt-2">
            This will permanently delete the user group &quot;{userGroup.name}&quot; and cannot be undone.
          </p>
        </DialogHeader>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-32 h-11"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="w-32 h-11 bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
