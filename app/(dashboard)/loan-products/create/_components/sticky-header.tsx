"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X } from "lucide-react";

interface StickyHeaderProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export function StickyHeader({ onCancel, isSubmitting }: StickyHeaderProps) {
  return (
    <div className="sticky top-14 z-10 bg-white p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-primaryGrey-400 hover:text-primaryGrey-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-primaryGrey-400 hover:text-primaryGrey-500"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="loan-product-form"
            className="bg-primary-green hover:bg-primary-green/90"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
