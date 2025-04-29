"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RootState } from "@/lib/redux/store";
import { resetForm } from "@/lib/redux/features/loan-product-form.slice";
import StepIndicator from "../_components/step-indicator";
import StepOneForm from "../_components/step-one-form";
import StepTwoForm from "@/app/(dashboard)/loan-products/_components/step-two-form";
import StepThreeForm from "@/app/(dashboard)/loan-products/_components/step-three-form";

const AddLoanProductPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { activeStep, formData } = useSelector(
    (state: RootState) => state.loanProductForm,
  );

  const productType = searchParams.get("type") || "mk";

  useEffect(() => {
    // Reset form when component mounts
    dispatch(resetForm());
  }, [dispatch]);

  const renderStepContent = () => {
    switch (activeStep) {
      case 2:
        return <StepOneForm initialData={formData} />;
      case 1:
        // Will be implemented in the future
        return <StepTwoForm initialData={formData} />;
      case 3:
        return <StepThreeForm initialData={formData} />;
      default:
        return <StepOneForm initialData={formData} />;
    }
  };

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
        <StepIndicator currentStep={activeStep} totalSteps={3} />

        <h1 className="mb-2 text-3xl font-bold">
          Add {productType === "mk" ? "MK" : "Partner"} loan product
        </h1>

        <p className="mb-8 text-gray-600">
          Fill in the details below to create a new loan product
        </p>

        <div className="mt-6">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default AddLoanProductPage;
