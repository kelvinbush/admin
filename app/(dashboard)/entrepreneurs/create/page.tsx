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
import { toast } from "@/hooks/use-toast";

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
  useEffect(() => {
    if (currentStep > 1 && !userId && !isLoading) {
      toast({
        title: "Error",
        description: "Please complete Step 1 first to create the SME user.",
        variant: "destructive",
      });
      router.push("/entrepreneurs/create?step=1");
    }
  }, [currentStep, userId, isLoading, router]);

  // Handle invalid userId (404 error)
  useEffect(() => {
    if (isError && currentStep > 1) {
      toast({
        title: "Error",
        description: "Invalid user ID. Please start from Step 1.",
        variant: "destructive",
      });
      router.push("/entrepreneurs/create?step=1");
    }
  }, [isError, currentStep, router]);

  const handleStepChange = (step: StepId) => {
    const urlUserId = searchParams.get("userId");
    if (urlUserId) {
      router.push(`/entrepreneurs/create?userId=${urlUserId}&step=${step}`);
    } else {
      router.push(`/entrepreneurs/create?step=${step}`);
    }
  };

  // Determine which steps are completed
  const completedSteps = onboardingState?.completedSteps || [];
  const currentStepNumber = onboardingState?.currentStep || currentStep;

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
