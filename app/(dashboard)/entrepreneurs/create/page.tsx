"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SMEOnboardingProvider, useSMEOnboarding } from "./_context/sme-onboarding-context";
import { StepsSidebar, type StepId } from "./_components/steps-sidebar";
import { Step1EntrepreneurDetails } from "./_components/step-1-entrepreneur-details";
import { Step2CompanyInformation } from "./_components/step-2-company-information";
import { Step3BusinessLocation } from "./_components/step-3-business-location";
import { Step4EntrepreneurDocuments } from "./_components/step-4-entrepreneur-documents";
import { Step5CompanyRegistrationDocuments } from "./_components/step-5-company-registration-documents";
import { Step6CompanyFinancialDocuments } from "./_components/step-6-company-financial-documents";
import { Step7OtherSupportingDocuments } from "./_components/step-7-other-supporting-documents";
import { toast } from "sonner";

function CreateEntrepreneurPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId, onboardingState, isError, isLoading } = useSMEOnboarding();

  // Get step from URL or default to 1
  const currentStep = useMemo<StepId>(() => {
    const stepParam = searchParams.get("step");
    const step = stepParam ? parseInt(stepParam, 10) : 1;
    return (step >= 1 && step <= 7 ? step : 1) as StepId;
  }, [searchParams]);

  // Validate userId for steps 2-7
  // Only redirect if we're not loading and there's no userId in URL either
  useEffect(() => {
    const urlUserId = searchParams.get("userId");
    if (currentStep > 1 && !userId && !urlUserId && !isLoading) {
      toast.error("Please complete Step 1 first to create the SME user.");
      router.push("/entrepreneurs/create?step=1");
    }
  }, [currentStep, userId, isLoading, router, searchParams]);

  // Handle invalid userId (404 error)
  useEffect(() => {
    if (isError && currentStep > 1) {
      toast.error("Invalid user ID. Please start from Step 1.");
      router.push("/entrepreneurs/create?step=1");
    }
  }, [isError, currentStep, router]);

  const handleStepChange = (step: StepId) => {
    // Use userId from multiple sources in priority order:
    // 1. Context userId (from state)
    // 2. onboardingState userId (from API response)
    // 3. URL userId (from query params)
    const urlUserId = searchParams.get("userId");
    const contextUserId = userId;
    const stateUserId = onboardingState?.userId;
    const finalUserId = contextUserId || stateUserId || urlUserId;
    
    if (step === 1) {
      // Step 1 doesn't require userId - preserve userId if it exists for easy navigation back
      if (finalUserId) {
        router.push(`/entrepreneurs/create?userId=${finalUserId}&step=${step}`);
      } else {
        router.push(`/entrepreneurs/create?step=${step}`);
      }
    } else if (finalUserId) {
      // Steps 2-7 require userId
      router.push(`/entrepreneurs/create?userId=${finalUserId}&step=${step}`);
    } else {
      // If no userId and trying to go to step 2+, show error
      toast.error("Please complete Step 1 first to create the SME user.");
    }
  };

  // Determine which steps are completed
  const completedSteps = onboardingState?.completedSteps || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/entrepreneurs"
        className="inline-flex items-center gap-2 text-sm text-primaryGrey-500 hover:text-midnight-blue transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Link>

      {/* Main Card */}
      <div className="rounded-sm bg-white shadow-sm border border-primaryGrey-50 overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-midnight-blue">
          {/* Header Content */}
          <div className="relative px-8 py-4 flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">Add New SME</h1>
            
            {/* Branding Image */}
            <div className="flex-shrink-0 h-full flex items-center">
              <Image
                src="/images/branding.png"
                alt="Branding"
                width={0}
                height={0}
                className="h-[120%] w-auto object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Form Content - Split Layout */}
        <div className="flex py-6">
          {/* Steps Sidebar */}
          <StepsSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepChange}
          />

          {/* Main Content Area */}
          <div className="flex-1 px-8">
            {currentStep === 1 && <Step1EntrepreneurDetails />}
            {currentStep === 2 && <Step2CompanyInformation />}
            {currentStep === 3 && <Step3BusinessLocation />}
            {currentStep === 4 && <Step4EntrepreneurDocuments />}
            {currentStep === 5 && <Step5CompanyRegistrationDocuments />}
            {currentStep === 6 && <Step6CompanyFinancialDocuments />}
            {currentStep === 7 && <Step7OtherSupportingDocuments />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateEntrepreneurPage() {
  return (
    <SMEOnboardingProvider>
      <CreateEntrepreneurPageContent />
    </SMEOnboardingProvider>
  );
}
