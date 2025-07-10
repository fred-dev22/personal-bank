import React from 'react';
import './StepsWizard.css';

export const StepsWizard: React.FC<{
  steps: { label: string }[];
  currentStep: number;
}> = ({ steps, currentStep }) => (
  <nav className="steps-wizard-root">
    {steps.map((step, idx) => {
      // Trait gauche
      let leftClass = 'steps-wizard-line';
      if (idx === 0) {
        leftClass += ' gradient'; // premier trait gauche toujours gradient (to right, #fff -> #00B5AE)
      } else if (idx < currentStep) {
        leftClass += ' solid'; // étapes passées
      } else if (idx === currentStep) {
        leftClass += ' solid'; // étape courante
      } else {
        leftClass += ' inactive';
      }
      // Trait droit
      let rightClass = 'steps-wizard-line';
      if (idx === currentStep) {
        rightClass += ' gradient right'; // trait droit de l'étape courante (to right, #00B5AE -> #fff)
      } else if (idx < currentStep) {
        rightClass += ' solid'; // étapes passées
      } else {
        rightClass += ' inactive';
      }
      return (
        <div className="steps-wizard-step-col" key={step.label}>
          <div className="steps-wizard-bar-row">
            <div className={leftClass} />
            <div
              className={`steps-wizard-circle${idx === currentStep ? ' active' : ''}${idx < currentStep ? ' done' : ''}`}
            >
              {idx + 1}
            </div>
            <div className={rightClass} />
          </div>
          <div className={`steps-wizard-label${idx === currentStep ? ' active' : ''}`}>{step.label}</div>
        </div>
      );
    })}
  </nav>
);

export default StepsWizard; 