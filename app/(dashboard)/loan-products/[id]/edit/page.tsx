"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoanProductFormPage } from "../../create/_components/loan-product-form-page";
import { useLoanProduct } from "@/lib/api/hooks/loan-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function EditLoanProductPage() {
  const params = useParams();
  const loanProductId = params.id as string;

  const { data: loanProduct, isLoading, isError } = useLoanProduct(loanProductId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="rounded-sm bg-white shadow-sm border border-primaryGrey-50 overflow-hidden">
          <div className="py-6 px-8">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !loanProduct) {
    return (
      <div className="space-y-6">
        <Link
          href="/loan-products"
          className="inline-flex items-center gap-2 text-sm text-primaryGrey-500 hover:text-midnight-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Loan Products
        </Link>
        <div className="rounded-sm bg-white shadow-sm border border-primaryGrey-50 overflow-hidden p-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-midnight-blue">
              Failed to load loan product
            </h2>
            <p className="text-sm text-primaryGrey-500">
              {isError
                ? "An error occurred while loading the loan product. Please try again."
                : "Loan product not found."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoanProductFormPage 
      initialData={loanProduct}
      loanProductId={loanProductId}
    />
  );
}

