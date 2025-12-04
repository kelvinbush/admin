"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import type { LoanProductStepId } from "./_components/steps-sidebar";
import { Step1BasicDetails } from "./_components/step-1-basic-details";

export default function CreateLoanProductPage() {
  const [currentStep, setCurrentStep] = useState<LoanProductStepId>(1);

  const stepLabel = useMemo(() => `STEP ${currentStep}/3`, [currentStep]);

  const handleContinueFromStep1 = () => {
    setCurrentStep(2);
  };

  return (
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
                handleContinueFromStep1();
              }}
            />
          )}
          {currentStep === 2 && (
            <div className="text-sm text-primaryGrey-500">
              Step 2 – Terms &amp; pricing (coming soon)
            </div>
          )}
          {currentStep === 3 && (
            <div className="text-sm text-primaryGrey-500">
              Step 3 – Publishing &amp; review (coming soon)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


