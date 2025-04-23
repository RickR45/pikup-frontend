import React from 'react';
import './FormProgress.css';

interface FormProgressProps {
  steps: string[];
  currentStep: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="form-progress">
      {steps.map((step, index) => (
        <div 
          key={step} 
          className={`progress-step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
        >
          <div className="step-number">
            {index < currentStep ? '✓' : index + 1}
          </div>
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && <div className="step-connector" />}
        </div>
      ))}
    </div>
  );
};

export default FormProgress; 