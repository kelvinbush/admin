"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Power } from "lucide-react";
import type { LoanProduct } from "@/lib/api/hooks/loan-products";

interface LoanProductDetailsSheetProps {
  product: LoanProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: "active" | "inactive") => void;
  actionBusyId?: string | null;
  organizationName?: string;
  userGroupNames?: string[];
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTerm(term: number, unit: string): string {
  return `${term} ${unit}`;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    return format(parseISO(dateString), "PPP");
  } catch {
    return dateString;
  }
}

function formatRatePeriod(period: string): string {
  const periodMap: Record<string, string> = {
    per_day: "Per Day",
    per_month: "Per Month",
    per_quarter: "Per Quarter",
    per_year: "Per Year",
  };
  return periodMap[period] || period;
}

function formatRepaymentFrequency(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
  };
  return frequencyMap[frequency] || frequency;
}

function formatAmortizationMethod(method: string): string {
  const methodMap: Record<string, string> = {
    flat: "Flat Rate",
    reducing_balance: "Reducing Balance",
  };
  return methodMap[method] || method;
}

function formatInterestCollectionMethod(method: string): string {
  const methodMap: Record<string, string> = {
    installments: "Loan Installments (Conventional)",
    deducted: "Deducted (From Disbursement)",
    capitalized: "Capitalized (Sharia-compliant)",
  };
  return methodMap[method] || method;
}

function formatInterestRecognition(criteria: string): string {
  const criteriaMap: Record<string, string> = {
    on_disbursement: "Post Interest on Disbursement",
    when_accrued: "Post Interest When Accrued",
  };
  return criteriaMap[criteria] || criteria;
}

function formatCollectionRule(rule: string): string {
  return rule.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatAllocationMethod(method: string): string {
  return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatCalculationBasis(basis: string): string {
  return basis.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function LoanProductDetailsSheet({
  product,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
  actionBusyId,
  organizationName,
  userGroupNames = [],
}: LoanProductDetailsSheetProps) {
  if (!product) return null;

  const isActive = product.isActive;
  const isBusy = actionBusyId === product.id;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl text-midnight-blue">
                {product.name}
              </SheetTitle>
              <SheetDescription className="mt-2">
                {product.slug && (
                  <span className="text-primaryGrey-500">Code: {product.slug}</span>
                )}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary-green hover:text-primary-green hover:bg-green-50"
                onClick={() => onEdit?.(product.id)}
                disabled={isBusy}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50"
                onClick={() => {
                  if (onToggleStatus) {
                    onToggleStatus(product.id, isActive ? "inactive" : "active");
                  }
                }}
                disabled={isBusy}
                title={isActive ? "Disable" : "Enable"}
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badge */}
          <div>
            <Badge
              variant="outline"
              className={`font-normal border text-sm ${
                isActive
                  ? "border-green-500 text-green-500 bg-green-50"
                  : "border-red-500 text-red-500 bg-red-50"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          {/* Summary & Description */}
          {(product.summary || product.description) && (
            <>
              {product.summary && (
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                    Summary
                  </label>
                  <p className="text-sm text-midnight-blue">{product.summary}</p>
                </div>
              )}
              {product.description && (
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                    Description
                  </label>
                  <p className="text-sm text-midnight-blue whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}
              <Separator />
            </>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-midnight-blue">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Organization
                </label>
                <p className="text-sm text-midnight-blue">
                  {organizationName || product.organizationId}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Visibility
                </label>
                <p className="text-sm text-midnight-blue">
                  {userGroupNames.length > 0
                    ? userGroupNames.join(", ")
                    : "All Users"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Currency
                </label>
                <p className="text-sm text-midnight-blue">{product.currency}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Status
                </label>
                <p className="text-sm text-midnight-blue capitalize">{product.status}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loan Amount & Term */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-midnight-blue">Loan Amount & Term</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Minimum Amount
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatCurrency(product.minAmount, product.currency)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Maximum Amount
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatCurrency(product.maxAmount, product.currency)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Minimum Term
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatTerm(product.minTerm, product.termUnit)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Maximum Term
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatTerm(product.maxTerm, product.termUnit)}
                </p>
              </div>
            </div>
          </div>

          {/* Availability Window */}
          {(product.availabilityStartDate || product.availabilityEndDate) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-midnight-blue">
                  Availability Window
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.availabilityStartDate && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                        Start Date
                      </label>
                      <p className="text-sm text-midnight-blue">
                        {formatDate(product.availabilityStartDate)}
                      </p>
                    </div>
                  )}
                  {product.availabilityEndDate && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                        End Date
                      </label>
                      <p className="text-sm text-midnight-blue">
                        {formatDate(product.availabilityEndDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Repayment Terms */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-midnight-blue">Repayment Terms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Repayment Frequency
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatRepaymentFrequency(product.repaymentFrequency)}
                </p>
              </div>
              {(product.maxGracePeriod || product.maxGraceUnit) && (
                <div className="space-y-1">
                  <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                    Maximum Grace Period
                  </label>
                  <p className="text-sm text-midnight-blue">
                    {product.maxGracePeriod && product.maxGraceUnit
                      ? `${product.maxGracePeriod} ${product.maxGraceUnit}`
                      : "—"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Interest Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-midnight-blue">Interest Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Interest Rate
                </label>
                <p className="text-sm text-midnight-blue">
                  {product.interestRate}% {formatRatePeriod(product.ratePeriod)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Calculation Method
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatAmortizationMethod(product.amortizationMethod)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Collection Method
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatInterestCollectionMethod(product.interestCollectionMethod)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Recognition Criteria
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatInterestRecognition(product.interestRecognitionCriteria)}
                </p>
              </div>
            </div>
          </div>

          {/* Loan Fees */}
          {product.fees && product.fees.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-midnight-blue">
                  Loan Fees ({product.fees.length})
                </h3>
                <div className="space-y-3">
                  {product.fees.map((fee, index) => (
                    <div
                      key={index}
                      className="rounded-md border border-primaryGrey-100 bg-primaryGrey-25 p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-midnight-blue">
                            {fee.feeName || fee.loanFeeId || `Fee ${index + 1}`}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-primaryGrey-400">Method: </span>
                              <span className="text-midnight-blue capitalize">
                                {fee.calculationMethod}
                              </span>
                            </div>
                            <div>
                              <span className="text-primaryGrey-400">Rate: </span>
                              <span className="text-midnight-blue">
                                {fee.rate}
                                {fee.calculationMethod === "percentage" ? "%" : ""}
                              </span>
                            </div>
                            <div>
                              <span className="text-primaryGrey-400">Collection: </span>
                              <span className="text-midnight-blue">
                                {formatCollectionRule(fee.collectionRule)}
                              </span>
                            </div>
                            <div>
                              <span className="text-primaryGrey-400">Allocation: </span>
                              <span className="text-midnight-blue">
                                {formatAllocationMethod(fee.allocationMethod)}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-primaryGrey-400">Calculation Basis: </span>
                              <span className="text-midnight-blue">
                                {formatCalculationBasis(fee.calculationBasis)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-midnight-blue">Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Created At
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatDate(product.createdAt)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Updated At
                </label>
                <p className="text-sm text-midnight-blue">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
              {product.version && (
                <div className="space-y-1">
                  <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                    Version
                  </label>
                  <p className="text-sm text-midnight-blue">{product.version}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}














