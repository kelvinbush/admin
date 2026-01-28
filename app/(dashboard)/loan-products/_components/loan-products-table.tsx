"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LoanProduct } from "@/lib/api/hooks/loan-products";
import { DuplicateLoanProductModal, type DuplicateLoanProductFormValues } from "./duplicate-loan-product-modal";
import { ConfirmActionModal } from "@/app/(dashboard)/internal-users/_components/confirm-action-modal";
import { useCreateLoanProduct, type CreateLoanProductRequest } from "@/lib/api/hooks/loan-products";
import { toast } from "sonner";

// Placeholder type for loan product
export type LoanProductTableItem = {
  id: string;
  code: string;
  name: string;
  provider: string;
  visibility: string;
  linkedLoans: number;
  status: "active" | "inactive";
  product?: LoanProduct; // Store full product for sheet
};

interface LoanProductsTableProps {
  data: LoanProductTableItem[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: "active" | "inactive") => void;
  onViewDetails?: (id: string) => void;
  actionBusyId?: string | null;
}

export function LoanProductsTable({
  data,
  isLoading = false,
  onEdit,
  onToggleStatus,
  onViewDetails,
  actionBusyId,
}: LoanProductsTableProps) {
  const router = useRouter();
  const createLoanProduct = useCreateLoanProduct();
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateSource, setDuplicateSource] = useState<LoanProductTableItem | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string;
    newStatus: "active" | "inactive";
    isCurrentlyActive: boolean;
  } | null>(null);

  const handleOpenDuplicate = (product: LoanProductTableItem) => {
    setDuplicateSource(product);
    setDuplicateOpen(true);
  };

  const handleDuplicateSubmit = async (values: DuplicateLoanProductFormValues) => {
    if (!duplicateSource?.product) {
      setDuplicateOpen(false);
      return;
    }

    const source = duplicateSource.product;

    const payload: CreateLoanProductRequest = {
      name: values.name,
      slug: undefined,
      summary: source.summary ?? undefined,
      description: source.description ?? undefined,
      currency: source.currency,
      minAmount: source.minAmount,
      maxAmount: source.maxAmount,
      minTerm: source.minTerm,
      maxTerm: source.maxTerm,
      termUnit: source.termUnit,
      availabilityStartDate: source.availabilityStartDate ?? undefined,
      availabilityEndDate: source.availabilityEndDate ?? undefined,
      organizationId: source.organizationId,
      userGroupIds: source.userGroupIds ?? [],
      repaymentFrequency: source.repaymentFrequency,
      maxGracePeriod: source.maxGracePeriod ?? undefined,
      maxGraceUnit: source.maxGraceUnit ?? undefined,
      interestRate: source.interestRate,
      ratePeriod: source.ratePeriod,
      amortizationMethod: source.amortizationMethod,
      interestCollectionMethod: source.interestCollectionMethod,
      interestRecognitionCriteria: source.interestRecognitionCriteria,
      fees:
        values.copyFees && source.fees
          ? source.fees.map(
              ({
                loanFeeId,
                feeName,
                calculationMethod,
                rate,
                collectionRule,
                allocationMethod,
                calculationBasis,
              }) => ({
                loanFeeId,
                feeName,
                calculationMethod,
                rate,
                collectionRule,
                allocationMethod,
                calculationBasis,
              }),
            )
          : undefined,
    };

    try {
      await createLoanProduct.mutateAsync(payload);
      toast.success("Loan product duplicated successfully");
      setDuplicateOpen(false);
      setDuplicateSource(null);
    } catch (error: any) {
      console.error("Failed to duplicate loan product:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to duplicate loan product",
      );
    }
  };

  const handlePowerClick = (
    e: React.MouseEvent,
    product: LoanProductTableItem,
    isActive?: boolean,
  ) => {
    e.stopPropagation();
    if (!onToggleStatus) return;

    const newStatus: "active" | "inactive" = isActive ? "inactive" : "active";

    setPendingStatusChange({
      id: product.id,
      newStatus,
      isCurrentlyActive: !!isActive,
    });
    setConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryGrey-50">
                  <TableHead className="font-medium text-primaryGrey-500 py-4">
                    CODE
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LOAN NAME
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LOAN PROVIDER
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LOAN VISIBILITY
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LINKED LOANS
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    STATUS
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return null; // Empty state is handled by parent
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primaryGrey-50">
                <TableHead className="font-medium text-primaryGrey-500 py-4">
                  CODE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LOAN NAME
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LOAN PROVIDER
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LOAN VISIBILITY
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LINKED LOANS
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  STATUS
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((product) => {
                const isActive = product?.product?.isActive;
                const isBusy = actionBusyId === product.id;

                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewDetails?.(product.id)}
                  >
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-midnight-blue">
                        {product.code}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-midnight-blue">
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.provider}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.visibility}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.linkedLoans}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`font-normal border text-xs ${
                          isActive
                            ? "border-[#B0EFDF] text-[#007054] bg-[#B0EFDF]"
                            : "border-[#E9B7BD] text-[#650D17] bg-[#E9B7BD]"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto px-0 py-0 text-[#00CC99] hover:bg-transparent hover:text-[#00CC99] flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit) {
                              onEdit(product.id);
                            } else {
                              router.push(`/loan-products/${product.id}/edit`);
                            }
                          }}
                          disabled={isBusy}
                          title="Edit"
                        >
                          <Image
                            src="/edit.svg"
                            alt="Edit"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm font-normal">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto px-0 py-0 text-[#01337F] hover:bg-transparent hover:text-[#01337F] flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDuplicate(product);
                          }}
                          disabled={isBusy}
                          title="Duplicate"
                        >
                          <Image
                            src="/copy.svg"
                            alt="Duplicate"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm font-normal">Duplicate</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto px-0 py-0 text-[#F59E0B] hover:bg-transparent hover:text-[#F59E0B] flex items-center gap-2"
                          onClick={(e) => handlePowerClick(e, product, isActive)}
                          disabled={isBusy}
                          title={isActive ? "Disable" : "Enable"}
                        >
                          <Power className="h-4 w-4" />
                          <span className="text-sm font-normal">
                            {isActive ? "Disable" : "Enable"}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {/* Duplicate loan product modal */}
      <DuplicateLoanProductModal
        open={duplicateOpen}
        onOpenChange={setDuplicateOpen}
        defaultName={
          duplicateSource?.name
            ? `${duplicateSource.name} Copy`
            : undefined
        }
        onSubmit={handleDuplicateSubmit}
        isLoading={createLoanProduct.isPending}
      />

      {/* Enable / Disable confirmation modal */}
      <ConfirmActionModal
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmOpen(false);
            setPendingStatusChange(null);
          } else {
            setConfirmOpen(true);
          }
        }}
        onConfirm={() => {
          if (pendingStatusChange && onToggleStatus) {
            onToggleStatus(
              pendingStatusChange.id,
              pendingStatusChange.newStatus,
            );
          }
          setConfirmOpen(false);
          setPendingStatusChange(null);
        }}
        title={
          pendingStatusChange?.isCurrentlyActive
            ? "Are you sure you want to disable this loan product?"
            : "Are you sure you want to enable this loan product?"
        }
        description={
          pendingStatusChange?.isCurrentlyActive
            ? "Users will no longer be able to see or apply for this loan, but it will remain stored in the system. You can enable it again later if needed."
            : "Users will be able to see and apply for this loan product once it is enabled."
        }
        confirmButtonText={
          pendingStatusChange?.isCurrentlyActive ? "Yes, Disable" : "Yes, Enable"
        }
      />
    </Card>
  );
}

