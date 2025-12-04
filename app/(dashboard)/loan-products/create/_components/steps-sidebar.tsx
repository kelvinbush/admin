"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type LoanProductStepId = 1 | 2 | 3;

export interface LoanProductStep {
  id: LoanProductStepId;
  number: string;
  title: string;
  description: string;
}

const steps: LoanProductStep[] = [
  {
    id: 1,
    number: "01",
    title: "Step 1",
    description: "Basic loan details",
  },
  {
    id: 2,
    number: "02",
    title: "Step 2",
    description: "Terms & pricing",
  },
  {
    id: 3,
    number: "03",
    title: "Step 3",
    description: "Publishing & review",
  },
];

interface StepsSidebarProps {
  currentStep: LoanProductStepId;
  completedSteps?: number[];
  onStepClick?: (step: LoanProductStepId) => void;
}

export function LoanProductStepsSidebar({
  currentStep,
  completedSteps = [],
  onStepClick,
}: StepsSidebarProps) {
  const isStepEnabled = (stepId: LoanProductStepId) => {
    // For now, allow navigation to any step; we can tighten this later
    return true;
  };

  const isStepCompleted = (stepId: LoanProductStepId) => {
    return completedSteps.includes(stepId);
  };

  return (
    <div className="w-64 bg-white border-r border-t border-primaryGrey-50">
      {steps.map((step) => {
        const enabled = isStepEnabled(step.id);
        const completed = isStepCompleted(step.id);
        return (
          <StepItem
            key={step.id}
            step={step}
            isActive={step.id === currentStep}
            isEnabled={enabled}
            isCompleted={completed}
            onClick={() => {
              if (enabled) {
                onStepClick?.(step.id);
              }
            }}
          />
        );
      })}
    </div>
  );
}

interface StepItemProps {
  step: LoanProductStep;
  isActive: boolean;
  isEnabled: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

function StepItem({
  step,
  isActive,
  isEnabled,
  isCompleted,
  onClick,
}: StepItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      className={cn(
        "w-full flex items-start gap-3 p-3 transition-colors text-left border-b border-primaryGrey-50",
        isEnabled && "hover:bg-primaryGrey-50 cursor-pointer",
        !isEnabled && "cursor-not-allowed opacity-50",
        isActive && "bg-primary-green/10",
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center text-sm",
          isCompleted && !isActive
            ? "bg-primary-green/20 border border-primary-green text-primary-green"
            : isActive
              ? "bg-primary-green text-white"
              : isEnabled
                ? "bg-white border border-primaryGrey-200 text-primaryGrey-400"
                : "bg-primaryGrey-50 border border-primaryGrey-200 text-primaryGrey-300",
        )}
      >
        {isCompleted && !isActive ? (
          <Check className="h-5 w-5" />
        ) : (
          step.number
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-xs mb-0.5",
            isActive
              ? "text-midnight-blue"
              : isEnabled
                ? "text-primaryGrey-400"
                : "text-primaryGrey-300",
          )}
        >
          {step.title}
        </div>
        <div
          className={cn(
            "text-sm",
            isActive
              ? "text-midnight-blue"
              : isEnabled
                ? "text-primaryGrey-400"
                : "text-primaryGrey-300",
          )}
        >
          {step.description}
        </div>
      </div>
    </button>
  );
}


