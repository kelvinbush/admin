"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { useCreateLoanProduct } from "@/lib/api/hooks/loan-products";
import {
  createLoanProductSchema,
  CreateLoanProductFormData,
} from "@/lib/validations/loan-product";
import { toast } from "sonner";
import { useTitle } from "@/context/title-context";
import { StickyHeader } from "./_components/sticky-header";
import { BasicInformationSection } from "./_components/basic-information-section";
import { FinancialDetailsSection } from "./_components/financial-details-section";
import { LoanStructureSection } from "./_components/loan-structure-section";
import { FeesSection } from "./_components/fees-section";
import { ProductStatusSection } from "./_components/product-status-section";

export default function CreateLoanProductPage() {
  const router = useRouter();
  const { setTitle } = useTitle();
  const createLoanProductMutation = useCreateLoanProduct();

  const form = useForm<CreateLoanProductFormData>({
    resolver: zodResolver(createLoanProductSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
      summary: "",
      description: "",
      currency: "USD",
      minAmount: 0,
      maxAmount: 0,
      minTerm: 0,
      maxTerm: 0,
      termUnit: "months",
      interestRate: 0,
      interestType: "fixed",
      ratePeriod: "per_month",
      amortizationMethod: "flat",
      repaymentFrequency: "monthly",
      processingFeeRate: undefined,
      processingFeeFlat: undefined,
      lateFeeRate: undefined,
      lateFeeFlat: undefined,
      prepaymentPenaltyRate: undefined,
      gracePeriodDays: undefined,
      isActive: true,
    },
  });

  React.useEffect(() => {
    setTitle("Create Loan Product");
  }, [setTitle]);

  const onSubmit = async (data: CreateLoanProductFormData) => {
    try {
      await createLoanProductMutation.mutateAsync(data as any);
      toast.success("Loan product created successfully");
      router.push("/loan-products");
    } catch (error) {
      toast.error("Failed to create loan product");
      console.error("Error creating loan product:", error);
    }
  };

  const handleCancel = () => {
    router.push("/loan-products");
  };

  return (
    <div className="container mx-auto bg-white">
      <StickyHeader 
        onCancel={handleCancel} 
        isSubmitting={createLoanProductMutation.isPending} 
      />

      {/* Form */}
      <Form {...form}>
        <form
          id="loan-product-form"
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-0"
        >
          <BasicInformationSection control={form.control} />
          
          <div className="border-t border-primaryGrey-50"></div>
          
          <FinancialDetailsSection control={form.control} />
          
          <div className="border-t border-primaryGrey-50"></div>
          
          <LoanStructureSection control={form.control} />
          
          <div className="border-t border-primaryGrey-50"></div>
          
          <FeesSection control={form.control} />
          
          <div className="border-t border-primaryGrey-50"></div>
          
          <ProductStatusSection control={form.control} />
        </form>
      </Form>
    </div>
  );
}