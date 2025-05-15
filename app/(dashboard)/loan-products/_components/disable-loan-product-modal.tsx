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

interface DisableLoanProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export function DisableLoanProductModal({
  open,
  onClose,
  onConfirm,
  productName,
}: DisableLoanProductModalProps) {
  const [, setIsHovered] = useState(false);

  const handleDisable = () => {
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
            Are you sure you want to disable this loan product?
          </DialogTitle>
          <div
            className="text-center text-xl mt-10 text-primaryGrey-400"
            style={{
              marginTop: "50px",
              marginBottom: "20px",
            }}
          >
            Users will no longer be able to see or apply for this loan, but it will remain
            stored in the system. You can enable it again later if needed.
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
            onClick={handleDisable}
            size={"lg"}
            style={{
              backgroundColor: "#FFAB00",
            }}
            className="px-9 hover:bg-amber-600"
          >
            Yes, Disable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
