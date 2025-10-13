"use client";

import React from "react";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductFeesProps {
  product: LoanProduct;
}

export function LoanProductFees({ product }: LoanProductFeesProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatFee = (rate?: number, flat?: number, currency?: string) => {
    if (rate) return `${rate}%`;
    if (flat && currency) return formatCurrency(flat, currency);
    return "Not set";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Fees & Charges
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Processing Fee */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-3">
            Processing Fee
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-primaryGrey-400">Amount</span>
              <span className="text-sm font-medium text-midnight-blue">
                {formatFee(
                  product.processingFeeRate,
                  product.processingFeeFlat,
                  product.currency,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-primaryGrey-400">Type</span>
              <span className="text-sm font-medium text-midnight-blue">
                {product.processingFeeRate
                  ? "Percentage"
                  : product.processingFeeFlat
                    ? "Flat Fee"
                    : "Not configured"}
              </span>
            </div>
          </div>
        </div>

        {/* Late Fee */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-3">Late Fee</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-primaryGrey-400">Amount</span>
              <span className="text-sm font-medium text-midnight-blue">
                {formatFee(
                  product.lateFeeRate,
                  product.lateFeeFlat,
                  product.currency,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-primaryGrey-400">Type</span>
              <span className="text-sm font-medium text-midnight-blue">
                {product.lateFeeRate
                  ? "Percentage"
                  : product.lateFeeFlat
                    ? "Flat Fee"
                    : "Not configured"}
              </span>
            </div>
          </div>
        </div>

        {/* Prepayment Penalty */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-3">
            Prepayment Penalty
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-primaryGrey-400">Amount</span>
              <span className="text-sm font-medium text-midnight-blue">
                {product.prepaymentPenaltyRate
                  ? `${product.prepaymentPenaltyRate}%`
                  : "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-primaryGrey-400">Type</span>
              <span className="text-sm font-medium text-midnight-blue">
                {product.prepaymentPenaltyRate
                  ? "Percentage"
                  : "Not configured"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
