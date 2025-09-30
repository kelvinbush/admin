"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLoanProduct } from "@/lib/api/hooks/loan-products";
import { useTitle } from "@/context/title-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, X } from "lucide-react";
import { LoanProductEditForm } from "./_components/loan-product-edit-form";

export default function LoanProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const { setTitle } = useTitle();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useLoanProduct(productId);

  React.useEffect(() => {
    if (product) {
      setTitle(`Edit ${product.name}`);
    }
  }, [product, setTitle]);

  const handleBack = () => {
    router.push(`/loan-products/${productId}`);
  };

  const handleCancel = () => {
    router.push(`/loan-products/${productId}`);
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
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load loan product</p>
          <Button onClick={handleBack}>Back to Product</Button>
        </div>
      </div>
    );
  }

  // Check if product can be edited
  if (product.status === 'archived') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Cannot edit archived products</p>
          <Button onClick={handleBack}>Back to Product</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-10 bg-white p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-primaryGrey-400 hover:text-primaryGrey-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="text-primaryGrey-400 hover:text-primaryGrey-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              form="loan-product-edit-form"
              className="bg-primary-green hover:bg-primary-green/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <LoanProductEditForm product={product} onSuccess={handleBack} />
    </div>
  );
}
