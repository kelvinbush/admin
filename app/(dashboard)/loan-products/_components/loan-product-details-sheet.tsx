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
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`font-normal text-xs ${
                product.isActive 
                  ? 'border-green-500 text-green-500' 
                  : 'border-red-500 text-red-500'
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button 
              size="sm"
              className="bg-primary-green hover:bg-primary-green/90"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {product.summary && (
            <div className="bg-primaryGrey-50 p-4 rounded-lg">
              <p className="text-sm text-primaryGrey-400">{product.summary}</p>
            </div>
          )}

          {/* Financial Details */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Financial Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Amount Range</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {formatCurrency(product.minAmount, product.currency)} - {formatCurrency(product.maxAmount, product.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Interest Rate</span>
                <span className="text-sm font-medium text-primary-green">
                  {product.interestRate}% {product.interestType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Term Length</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {formatTerm(product.minTerm, product.maxTerm, product.termUnit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Grace Period</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {product.gracePeriodDays} days
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-primaryGrey-50"></div>

          {/* Loan Structure */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Loan Structure</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Amortization</span>
                <span className="text-sm font-medium text-midnight-blue">{product.amortizationMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Repayment Frequency</span>
                <span className="text-sm font-medium text-midnight-blue">{product.repaymentFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Rate Period</span>
                <span className="text-sm font-medium text-midnight-blue">{product.ratePeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Currency</span>
                <span className="text-sm font-medium text-midnight-blue">{product.currency}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-primaryGrey-50"></div>

          {/* Fees */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Fees</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-primaryGrey-400 mb-1">Processing Fee</p>
                <p className="text-sm font-medium text-midnight-blue">
                  {product.processingFeeRate ? `${product.processingFeeRate}%` : 
                   product.processingFeeFlat ? formatCurrency(product.processingFeeFlat, product.currency) : 
                   'Not set'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-primaryGrey-400 mb-1">Late Fee</p>
                <p className="text-sm font-medium text-midnight-blue">
                  {product.lateFeeRate ? `${product.lateFeeRate}%` : 
                   product.lateFeeFlat ? formatCurrency(product.lateFeeFlat, product.currency) : 
                   'Not set'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-primaryGrey-400 mb-1">Prepayment Penalty</p>
                <p className="text-sm font-medium text-midnight-blue">
                  {product.prepaymentPenaltyRate ? `${product.prepaymentPenaltyRate}%` : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-primaryGrey-50"></div>

          {/* Additional Info */}
          {product.description && (
            <div>
              <h4 className="font-medium text-midnight-blue mb-3">Description</h4>
              <p className="text-sm text-primaryGrey-400 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-primaryGrey-50">
            <div className="grid grid-cols-2 gap-4 text-xs text-primaryGrey-400">
              <div>
                <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
