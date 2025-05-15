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

interface DeleteLoanProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export function DeleteLoanProductModal({
  open,
  onClose,
  onConfirm,
  productName,
}: DeleteLoanProductModalProps) {
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
            Are you sure you want to delete this loan product?
          </DialogTitle>
          <div
            className="text-center text-xl mt-10 text-primaryGrey-400"
            style={{
              marginTop: "50px",
              marginBottom: "20px",
            }}
          >
            <span className={"font-medium"}>{productName}</span> will be permanently removed. Any existing loan
            applications will remain in the system, but users will no longer have access to
            this loan product.
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
