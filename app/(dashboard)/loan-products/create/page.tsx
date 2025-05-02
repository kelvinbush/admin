"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RootState } from "@/lib/redux/store";
import { resetForm } from "@/lib/redux/features/loan-product-form.slice";
import StepIndicator from "../_components/step-indicator";
import StepOneForm from "../_components/step-one-form";
import StepThreeForm from "../_components/step-three-form";
import { PartnerLoanForm } from "../_components/partner-loan-form";
import { FormData as PartnerFormData } from "../_components/_schemas/partner-loan-form-schema";
import StepTwoForm from "@/app/(dashboard)/loan-products/_components/step-two-form";

interface Props {
  searchParams?: { [key: string]: string | undefined };
}

const AddLoanProductPage = ({ searchParams = {} }: Props) => {
  const dispatch = useDispatch();
  const { activeStep, formData } = useSelector(
    (state: RootState) => state.loanProductForm,
  );

  const productType = searchParams.type || "mk";

  useEffect(() => {
    // Reset form when component mounts
    dispatch(resetForm());
  }, [dispatch]);

  const handlePartnerLoanSubmit = async (data: PartnerFormData) => {
    console.log("Partner Loan Form Data:", data);
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
        {productType === "partner" ? (
          <PartnerLoanForm onSubmit={handlePartnerLoanSubmit} />
        ) : (
          <>
            <StepIndicator currentStep={activeStep} totalSteps={3} />

            <h1 className="mb-2 text-3xl font-bold">
              Add {productType === "mk" ? "MK" : "Partner"} loan product
            </h1>

            <p className="mb-8 text-gray-600">
              Fill in the details below to create a new loan product
            </p>

            <div className="mt-6">
              {activeStep === 1 && <StepOneForm initialData={formData} />}
              {activeStep === 2 && <StepTwoForm initialData={formData} />}
              {activeStep === 3 && <StepThreeForm initialData={formData} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddLoanProductPage;
