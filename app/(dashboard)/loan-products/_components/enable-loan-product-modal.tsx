"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

interface EnableLoanProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export function EnableLoanProductModal({
  open,
  onClose,
  onConfirm,
  productName,
}: EnableLoanProductModalProps) {
  const [, setIsHovered] = useState(false);

  const handleEnable = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="sm:text-center">
          <div className="mx-auto mb-4">
            <AlertOctagon size={64} color="#FFAB00" />
          </div>
          <DialogTitle className="text-4xl font-medium">
            Are you sure you want to enable this loan product?
          </DialogTitle>
          <div
            className="text-center text-xl mt-10 text-primaryGrey-400"
            style={{
              marginTop: "50px",
              marginBottom: "20px",
            }}
          >
            Once enabled, users will be able to see and apply for it again.
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
            onClick={handleEnable}
            size={"lg"}
            style={{
              backgroundColor: "#FFAB00",
            }}
            className="px-9 hover:bg-amber-600"
          >
            Yes, Enable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
