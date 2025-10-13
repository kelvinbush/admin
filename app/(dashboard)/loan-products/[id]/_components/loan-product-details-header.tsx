"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductDetailsHeaderProps {
  product: LoanProduct;
  onBack: () => void;
  onEdit: () => void;
}

export function LoanProductDetailsHeader({
  product,
  onBack,
}: LoanProductDetailsHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500 text-green-500";
      case "draft":
        return "border-yellow-500 text-yellow-500";
      case "archived":
        return "border-red-500 text-red-500";
      default:
        return "border-primaryGrey-300 text-primaryGrey-400";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-primaryGrey-400 hover:text-primaryGrey-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div className="h-6 w-px bg-primaryGrey-200" />
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={`font-normal text-xs ${getStatusColor(product.status)}`}
            >
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </Badge>
            <span className="text-sm text-primaryGrey-400">
              Version {product.version}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
