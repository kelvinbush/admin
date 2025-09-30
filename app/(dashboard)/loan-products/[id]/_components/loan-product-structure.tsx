"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductStructureProps {
  product: LoanProduct;
}

export function LoanProductStructure({ product }: LoanProductStructureProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Loan Structure
        </h3>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amortization & Repayment */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Amortization & Repayment</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Amortization Method</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {product.amortizationMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Repayment Frequency</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {product.repaymentFrequency.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Product Configuration */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Configuration</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Interest Type</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {product.interestType.charAt(0).toUpperCase() + product.interestType.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Term Unit</span>
                <span className="text-sm font-medium text-midnight-blue">
                  {product.termUnit.charAt(0).toUpperCase() + product.termUnit.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
