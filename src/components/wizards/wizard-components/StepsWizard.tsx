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
        // Premier trait : blanc vers couleur de l'étape
        if (currentStep === 0) {
          leftClass += ' gradient-white-green'; // blanc -> vert (étape courante)
        } else {
          leftClass += ' gradient-white-blue'; // blanc -> bleu (étape traversée)
        }
      } else if (idx < currentStep) {
        leftClass += ' solid-blue'; // étapes passées : bleu
      } else if (idx === currentStep) {
        leftClass += ' gradient-blue-green'; // bleu -> vert (transition depuis étape précédente)
      } else {
        leftClass += ' inactive'; // gris
      }

      // Trait droit
      let rightClass = 'steps-wizard-line';
      if (idx === steps.length - 1) {
        // Dernier trait : couleur de l'étape vers blanc
        if (idx === currentStep) {
          rightClass += ' gradient-green-white'; // vert -> blanc
        } else if (idx < currentStep) {
          rightClass += ' gradient-blue-white'; // bleu -> blanc
        } else {
          rightClass += ' inactive'; // gris
        }
      } else if (idx < currentStep) {
        // Étapes traversées : trait droit complètement bleu
        rightClass += ' solid-blue'; // bleu uni
      } else if (idx === currentStep) {
        rightClass += ' gradient-green-gray'; // vert -> gris (vers étapes futures)
      } else {
        rightClass += ' inactive'; // gris
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