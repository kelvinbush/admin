interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="mb-6">
      <div className="text-sm font-medium text-emerald-500">
        STEP {currentStep}/{totalSteps}
      </div>
    </div>
  );
};

export default StepIndicator;
