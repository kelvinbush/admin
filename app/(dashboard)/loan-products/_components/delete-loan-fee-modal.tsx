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

interface DeleteLoanFeeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feeName: string;
}

export function DeleteLoanFeeModal({
  open,
  onClose,
  onConfirm,
  feeName,
}: DeleteLoanFeeModalProps) {
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
            Are you sure you want to delete this loan fee?
          </DialogTitle>
          <div
            className="text-center text-xl mt-10 text-primaryGrey-400"
            style={{
              marginTop: "50px",
              marginBottom: "20px",
            }}
          >
            The <span className={"font-medium"}>“{feeName}”</span> will no
            longer be applied to this loan product
          </div>
        </DialogHeader>
        <div className="flex justify-center mt-4 gap-8 items-center">
          <Button
            onClick={onClose}
            size={"lg"}
            variant={"outline"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="hover:bg-gray-800 px-9 hover:text-white"
          >
            No, Cancel
          </Button>
          <Button
            onClick={handleDelete}
            size={"lg"}
            style={{
              backgroundColor: "#A71525",
            }}
            className="px-9 hover:bg-gray-800"
          >
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
