import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface StepProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Registration progress" className="mb-8">
      <ol role="list" className="flex items-center justify-center gap-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {/* Step dot */}
            <li className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${index < currentStep
                    ? 'bg-indigo-500 text-white'
                    : index === currentStep
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/20'
                      : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }
                `}
                aria-current={index === currentStep ? 'step' : undefined}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </li>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-16 h-0.5 mx-1 mt-[-18px] transition-colors duration-300 ${
                  index < currentStep ? 'bg-indigo-500' : 'bg-gray-800'
                }`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default StepProgressIndicator;
