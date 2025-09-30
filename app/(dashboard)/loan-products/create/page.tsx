"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RootState } from "@/lib/redux/store";
import { resetForm } from "@/lib/redux/features/loan-product-form.slice";
import { useCreateLoanProductMutation } from "@/lib/redux/services/loan-product";
import { SupportedCurrency } from "@/lib/types/loan-product";
import { toast } from "sonner";
import StepIndicator from "../_components/step-indicator";
import StepOneForm from "../_components/step-one-form";
import StepThreeForm from "../_components/step-three-form";
import { PartnerLoanForm } from "../_components/partner-loan-form";
import { FormData as PartnerFormData } from "../_components/_schemas/partner-loan-form-schema";
import StepTwoForm from "@/app/(dashboard)/loan-products/_components/step-two-form";

const AddLoanProductPage = () => {
  const dispatch = useDispatch();
  const { activeStep, formData } = useSelector(
    (state: RootState) => state.loanProductForm,
  );
  const [createLoanProduct] = useCreateLoanProductMutation();
  const [, setIsSubmitting] = useState(false);

  // Hardcode product type to partner
  const productType = "partner";

  useEffect(() => {
    // Reset form when component mounts
    dispatch(resetForm());
  }, [dispatch]);

  const handlePartnerLoanSubmit = async (data: PartnerFormData) => {
    console.log("Partner Loan Form Data:", data);
    setIsSubmitting(true);

    try {
      // Add the adminguid to the form data and ensure all required fields are present
      const apiRequest = {
        loanName: data.loanName,
        description: data.description || "", // Provide default for optional fields
        partnerReference: data.partnerReference || "",
        integrationType: data.integrationType,
        loanProductType: data.loanProductType,
        currency: data.currency as SupportedCurrency, // Cast to SupportedCurrency type
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

      await createLoanProduct(apiRequest).unwrap();
      toast.success("Loan product created successfully");
    } catch (error) {
      console.error("Failed to create loan product:", error);
      toast.error("Failed to create loan product. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              {activeStep === 2 && <StepOneForm initialData={formData} />}
              {activeStep === 3 && <StepTwoForm initialData={formData} />}
              {activeStep === 1 && <StepThreeForm initialData={formData} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddLoanProductPage;
