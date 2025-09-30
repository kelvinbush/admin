"use client";

import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductDetailsSheetProps {
  product: LoanProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: LoanProduct) => void;
}

export function LoanProductDetailsSheet({ 
  product, 
  isOpen, 
  onClose, 
  onEdit 
}: LoanProductDetailsSheetProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTerm = (minTerm: number, maxTerm: number, termUnit: string) => {
    const unit = termUnit.toLowerCase();
    if (minTerm === maxTerm) {
      return `${minTerm} ${unit}`;
    }
    return `${minTerm} - ${maxTerm} ${unit}`;
  };

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-midnight-blue">
            {product.name}
          </SheetTitle>
          <SheetDescription>
            Detailed information about this loan product
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`font-light text-xs ${
                  product.isActive 
                    ? 'border-green-200 text-green-700' 
                    : 'border-red-200 text-red-700'
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
              <Button 
                className="bg-[#00B67C] hover:bg-[#00B67C]/90"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </div>
            
            {product.summary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-sm text-gray-600">{product.summary}</p>
              </div>
            )}
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Financial Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Amount Range</p>
                <p className="font-medium">
                  {formatCurrency(product.minAmount, product.currency)} - {formatCurrency(product.maxAmount, product.currency)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="font-medium text-[#00B67C]">
                  {product.interestRate}% {product.interestType}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Term Range</p>
                <p className="font-medium">
                  {formatTerm(product.minTerm, product.maxTerm, product.termUnit)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Grace Period</p>
                <p className="font-medium">{product.gracePeriodDays} days</p>
              </div>
            </div>
          </div>

          {/* Loan Structure */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Loan Structure</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Amortization Method</p>
                <p className="font-medium">{product.amortizationMethod.replace(/_/g, ' ')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Repayment Frequency</p>
                <p className="font-medium">{product.repaymentFrequency}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Rate Period</p>
                <p className="font-medium">{product.ratePeriod}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Currency</p>
                <p className="font-medium">{product.currency}</p>
              </div>
            </div>
          </div>

          {/* Fees */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Fees</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Processing Fee</p>
                <p className="font-medium">
                  {product.processingFeeRate ? `${product.processingFeeRate}%` : 
                   product.processingFeeFlat ? formatCurrency(product.processingFeeFlat, product.currency) : 
                   'Not set'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Late Fee</p>
                <p className="font-medium">
                  {product.lateFeeRate ? `${product.lateFeeRate}%` : 
                   product.lateFeeFlat ? formatCurrency(product.lateFeeFlat, product.currency) : 
                   'Not set'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Prepayment Penalty</p>
                <p className="font-medium">
                  {product.prepaymentPenaltyRate ? `${product.prepaymentPenaltyRate}%` : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {product.description && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900">Metadata</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-sm">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Product ID</p>
                <p className="font-medium text-sm font-mono">{product.id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Slug</p>
                <p className="font-medium text-sm font-mono">{product.slug}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
