"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useUpdateLoanProduct } from "@/lib/api/hooks/loan-products";
import { LoanProduct } from "@/lib/api/types";
import { toast } from "sonner";
import { LoanProductBasicInfoSection } from "./loan-product-basic-info-section";
import { LoanProductFinancialSection } from "./loan-product-financial-section";
import { LoanProductStructureSection } from "./loan-product-structure-section";
import { LoanProductFeesSection } from "./loan-product-fees-section";
import { LoanProductChangeReasonSection } from "./loan-product-change-reason-section";

interface LoanProductEditFormProps {
  product: LoanProduct;
  onSuccess: () => void;
}

export function LoanProductEditForm({ product, onSuccess }: LoanProductEditFormProps) {
  const updateProductMutation = useUpdateLoanProduct();
  const [changeReason, setChangeReason] = useState('');

  const form = useForm<Partial<LoanProduct>>({
    defaultValues: {
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      summary: product.summary,
      description: product.description,
      currency: product.currency,
      minAmount: product.minAmount,
      maxAmount: product.maxAmount,
      minTerm: product.minTerm,
      maxTerm: product.maxTerm,
      termUnit: product.termUnit,
      interestRate: product.interestRate,
      interestType: product.interestType,
      ratePeriod: product.ratePeriod,
      amortizationMethod: product.amortizationMethod,
      repaymentFrequency: product.repaymentFrequency,
      gracePeriodDays: product.gracePeriodDays,
      processingFeeRate: product.processingFeeRate,
      processingFeeFlat: product.processingFeeFlat,
      lateFeeRate: product.lateFeeRate,
      lateFeeFlat: product.lateFeeFlat,
      prepaymentPenaltyRate: product.prepaymentPenaltyRate,
    },
  });

  const onSubmit = async (data: Partial<LoanProduct>) => {
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for the changes");
      return;
    }

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        data: {
          ...data,
          changeReason,
        },
      });
      toast.success("Product updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Error updating product:", error);
    }
  };

  // Check if any critical fields have changed
  const criticalFields = ['minAmount', 'maxAmount', 'minTerm', 'maxTerm', 'interestRate', 'interestType', 'ratePeriod', 'amortizationMethod', 'repaymentFrequency'];
  const hasCriticalChanges = criticalFields.some(field => {
    const currentValue = form.watch(field as keyof LoanProduct);
    return currentValue !== product[field as keyof LoanProduct];
  });

  return (
    <div className="space-y-6">
      {/* Change Reason Section */}
      <LoanProductChangeReasonSection
        value={changeReason}
        onChange={setChangeReason}
        hasCriticalChanges={hasCriticalChanges}
        productStatus={product.status}
      />

      {/* Form */}
      <Form {...form}>
        <form
          id="loan-product-edit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-0"
        >
          <LoanProductBasicInfoSection control={form.control} />
          <div className="border-t border-primaryGrey-50"></div>
          <LoanProductFinancialSection control={form.control} />
          <div className="border-t border-primaryGrey-50"></div>
          <LoanProductStructureSection control={form.control} />
          <div className="border-t border-primaryGrey-50"></div>
          <LoanProductFeesSection control={form.control} />
        </form>
      </Form>
    </div>
  );
}
