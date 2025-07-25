import React from 'react';
import { CheckCircle, Circle, Loader, AlertCircle } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProcessingStepsProps {
  steps: ProcessingStep[];
  className?: string;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ steps, className = '' }) => {
  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getStepIcon(step.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Step {index + 1}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              step.status === 'processing' ? 'text-blue-600' :
              step.status === 'completed' ? 'text-green-600' :
              step.status === 'error' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {step.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};