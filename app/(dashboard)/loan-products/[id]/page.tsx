"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLoanProduct } from "@/lib/api/hooks/loan-products";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, CheckCircle, Archive, FileText } from "lucide-react";
import { LoanProductDetailsHeader } from "./_components/loan-product-details-header";
import { LoanProductOverview } from "./_components/loan-product-overview";
import { LoanProductFinancials } from "./_components/loan-product-financials";
import { LoanProductStructure } from "./_components/loan-product-structure";
import { LoanProductFees } from "./_components/loan-product-fees";
import { LoanProductHistory } from "./_components/loan-product-history";
import { LoanProductActions } from "./_components/loan-product-actions";

export default function LoanProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setTitle } = useTitle();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useLoanProduct(productId);

  React.useEffect(() => {
    if (product) {
      setTitle(product.name);
    }
  }, [product, setTitle]);

  const handleBack = () => {
    router.push("/loan-products");
  };

  const handleEdit = () => {
    router.push(`/loan-products/${productId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load loan product</p>
          <Button onClick={handleBack}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <LoanProductDetailsHeader
        product={product}
        onBack={handleBack}
        onEdit={handleEdit}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg">
            <LoanProductOverview product={product} />
            <div className="border-t border-primaryGrey-100"></div>
            <LoanProductFinancials product={product} />
            <div className="border-t border-primaryGrey-100"></div>
            <LoanProductStructure product={product} />
            <div className="border-t border-primaryGrey-100"></div>
            <LoanProductFees product={product} />
          </div>
        </div>

        {/* Right Column - Actions and History */}
        <div className="space-y-6">
          <LoanProductActions product={product} />
          <LoanProductHistory product={product} />
        </div>
      </div>
    </div>
  );
}
