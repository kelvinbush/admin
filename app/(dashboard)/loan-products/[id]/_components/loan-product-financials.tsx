"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductFinancialsProps {
  product: LoanProduct;
}

export function LoanProductFinancials({ product }: LoanProductFinancialsProps) {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Financial Details
        </h3>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Range */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Loan Amount</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Minimum</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {formatCurrency(product.minAmount, product.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Maximum</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {formatCurrency(product.maxAmount, product.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Range</span>
                <span className="text-sm font-medium text-primary-green">
                  {formatCurrency(product.minAmount, product.currency)} - {formatCurrency(product.maxAmount, product.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Interest & Terms */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Interest & Terms</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Interest Rate</span>
                <span className="text-sm font-medium text-primary-green">
                  {product.interestRate}% {product.interestType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Rate Period</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {product.ratePeriod.replace(/_/g, ' ')}
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
        </div>
    </div>
  );
}
