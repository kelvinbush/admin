"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Step {
  id: StepId;
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    number: "01",
    title: "Step 1",
    description: "Entrepreneur Details",
  },
  {
    id: 2,
    number: "02",
    title: "Step 2",
    description: "Company Information",
  },
  {
    id: 3,
    number: "03",
    title: "Step 3",
    description: "Business Location",
  },
  {
    id: 4,
    number: "04",
    title: "Step 4",
    description: "Entrepreneur Documents",
  },
  {
    id: 5,
    number: "05",
    title: "Step 5",
    description: "Company Registration Documents",
  },
  {
    id: 6,
    number: "06",
    title: "Step 6",
    description: "Company Financial Documents",
  },
  {
    id: 7,
    number: "07",
    title: "Step 7",
    description: "Other Supporting Documents",
  },
];

interface StepsSidebarProps {
  currentStep: StepId;
  completedSteps?: number[];
  onStepClick?: (step: StepId) => void;
}

export function StepsSidebar({ currentStep, completedSteps = [], onStepClick }: StepsSidebarProps) {
  const isStepEnabled = (stepId: StepId) => {
    // Allow navigation to:
    // 1. Current step
    // 2. Any completed step (for editing)
    // Don't allow skipping ahead to incomplete future steps
    return stepId === currentStep || completedSteps.includes(stepId);
  };

  const isStepCompleted = (stepId: StepId) => {
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
  step: Step;
  isActive: boolean;
  isEnabled: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

function StepItem({ step, isActive, isEnabled, isCompleted, onClick }: StepItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      className={cn(
        "w-full flex items-start gap-3 p-3 transition-colors text-left border-b border-primaryGrey-50",
        isEnabled && "hover:bg-primaryGrey-50 cursor-pointer",
        !isEnabled && "cursor-not-allowed opacity-50",
        isActive && "bg-primary-green/10"
      )}
    >
      {/* Step Number / Checkmark */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center text-sm",
          isCompleted && !isActive
            ? "bg-primary-green/20 border border-primary-green text-primary-green"
            : isActive
            ? "bg-primary-green text-white"
            : isEnabled
            ? "bg-white border border-primaryGrey-200 text-primaryGrey-400"
            : "bg-primaryGrey-50 border border-primaryGrey-200 text-primaryGrey-300"
        )}
      >
        {isCompleted && !isActive ? (
          <Check className="h-5 w-5" />
        ) : (
          step.number
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-xs mb-0.5",
            isActive
              ? "text-midnight-blue"
              : isEnabled
              ? "text-primaryGrey-400"
              : "text-primaryGrey-300"
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
              : "text-primaryGrey-300"
          )}
        >
          {step.description}
        </div>
      </div>
    </button>
  );
}

