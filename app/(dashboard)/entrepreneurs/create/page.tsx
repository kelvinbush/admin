"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StepsSidebar, type StepId } from "./_components/steps-sidebar";

export default function CreateEntrepreneurPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepId>(1);

  const handleCancel = () => {
    router.push("/entrepreneurs");
  };

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
                className="h-[120%] w-auto object-contain scale-125"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Form Content - Split Layout */}
        <div className="flex py-4">
          {/* Steps Sidebar */}
          <StepsSidebar
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            <div className="space-y-4">
              <p className="text-primaryGrey-500">
                Step {currentStep} content will be implemented here.
              </p>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="text-white border-0"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                  }}
                  disabled
                >
                  Save SME
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
