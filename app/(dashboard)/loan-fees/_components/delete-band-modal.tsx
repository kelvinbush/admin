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

interface DeleteBandModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bandType: "value" | "period";
}

export function DeleteBandModal({
  open,
  onClose,
  onConfirm,
  bandType,
}: DeleteBandModalProps) {
  const [isHovered, setIsHovered] = useState(false);

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
            Are you sure you want to delete this {bandType} band?
          </DialogTitle>
          <div
            className="text-center text-xl mt-10 text-primaryGrey-400"
            style={{
              marginTop: "50px",
              marginBottom: "20px",
            }}
          >
            This action cannot be undone
          </div>
        </DialogHeader>
        <div className="flex justify-center mt-4 gap-8 items-center">
          <Button
            onClick={onClose}
            size={"lg"}
            variant={"outline"}
            style={{
              borderColor: isHovered ? "#1f2937" : "#A71525",
              color: isHovered ? "white" : "#A71525",
              backgroundColor: isHovered ? "#1f2937" : "transparent",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="border-[#A71525] text-[#A71525] hover:bg-gray-800 px-9 hover:text-white"
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
