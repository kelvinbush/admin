"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoanProductFormProvider } from "./_context/loan-product-form-context";
import { Step1BasicDetails } from "./_components/step-1-basic-details";
import { Step2TermsPricing } from "./_components/step-2-terms-pricing";
import { Step3LoanFees } from "./_components/step-3-loan-fees";

export default function CreateLoanProductPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <LoanProductFormProvider>
      <div className="space-y-6">
        <Link
          href="/loan-products"
          className="inline-flex items-center gap-2 text-sm text-primaryGrey-500 hover:text-midnight-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Loan Products
        </Link>

        <div className="rounded-sm bg-white shadow-sm border border-primaryGrey-50 overflow-hidden">
          <div className="py-6 px-8">
            {currentStep === 1 && (
              <Step1BasicDetails
                onContinue={() => {
                  setCurrentStep(2);
                }}
              />
            )}
            {currentStep === 2 && (
              <Step2TermsPricing
                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <Step3LoanFees
                onBack={() => setCurrentStep(2)}
              />
            )}
          </div>
        </div>
      </div>
    </LoanProductFormProvider>
  );
}


