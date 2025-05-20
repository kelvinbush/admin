"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  useGetLoanProductByIdQuery,
  useUpdateLoanProductMutation,
} from "@/lib/redux/services/loan-product";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { SupportedCurrency, LoanProduct } from "@/lib/types/loan-product";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PartnerLoanForm } from "../_components/partner-loan-form";
import { FormData as PartnerFormData } from "../_components/_schemas/partner-loan-form-schema";

// Component that uses searchParams
const EditLoanProductContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const guid = useAppSelector(selectCurrentToken);
  const [updateLoanProduct] = useUpdateLoanProductMutation();
  const [, setIsSubmitting] = useState(false);

  const {
    data: loanProduct,
    isLoading,
    error,
  } = useGetLoanProductByIdQuery(
    { productId: productId || "", guid: guid as string },
    { skip: !productId || !guid },
  );

  const handleUpdateLoanProduct = async (data: PartnerFormData) => {
    if (!productId || !guid) return;

    setIsSubmitting(true);

    try {
      // Add the adminguid and productId to the form data
      const apiRequest = {
        adminguid: guid as string,
        productId: parseInt(productId),
        loanName: data.loanName,
        description: data.description || "",
        partnerReference: data.partnerReference || "",
        integrationType: data.integrationType,
        loanProductType: data.loanProductType,
        currency: data.currency as SupportedCurrency,
        loanPriceMax: data.loanPriceMax,
        loanInterest: data.loanInterest,
        status: data.status,
        loanPriceMin: data.loanPriceMin,
        disbursementAccount: data.disbursementAccount,
        interestCalculationMethod: data.interestCalculationMethod,
        minimumTerm: data.minimumTerm,
        maximumTerm: data.maximumTerm,
        termPeriod: data.termPeriod,
        interestPeriod: data.interestPeriod,
      };

      await updateLoanProduct(apiRequest).unwrap();
      toast.success("Loan product updated successfully");
      router.push("/loan-products");
    } catch (error) {
      console.error("Failed to update loan product:", error);
      toast.error("Failed to update loan product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert loan product data to form format
  const mapLoanProductToFormData = (product: LoanProduct): PartnerFormData => {
    return {
      loanName: product.loanName,
      description: product.description,
      partnerReference: product.partnerReference,
      integrationType: product.integrationType,
      loanProductType: product.loanProductType,
      currency: product.currency || "KES",
      loanPriceMax: product.loanPriceMax,
      loanInterest: product.loanInterest,
      status: product.status,
      // Default values for fields that might not be in the API response
      loanPriceMin: 0,
      disbursementAccount: "",
      interestCalculationMethod: "simple",
      minimumTerm: "1",
      maximumTerm: "12",
      termPeriod: "months",
      interestPeriod: "months",
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !loanProduct) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>Failed to load loan product. Please try again.</p>
          <Link
            href="/loan-products"
            className="mt-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loan Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-1">
      <div className="mb-2">
        <Link
          href="/loan-products"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Loan Products
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Edit Loan Product</h1>

        <PartnerLoanForm
          onSubmit={handleUpdateLoanProduct}
          initialData={mapLoanProductToFormData(loanProduct)}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

// Wrapper component with Suspense boundary
const EditLoanProductPage = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <EditLoanProductContent />
    </Suspense>
  );
};

export default EditLoanProductPage;
