import React, { useState } from 'react';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import { Button } from '@jbaluch/components';
import StepsWizard from '../wizard-components/StepsWizard';
import { useAuth } from '../../../contexts/AuthContext';
import { useActivity } from '../../../contexts/ActivityContext';
import type { Loan } from '../../../types/types';
import { StepPurpose } from './StepPurpose';
import { StepTerms } from './StepTerms';
import { StepContext } from './StepContext';
import { StepFunding } from './StepFunding';
import { StepConfirm } from './StepConfirm';
import './index.css';

// Définir les étapes du loan wizard
const steps = [
  { label: 'Purpose' },
  { label: 'Terms' },
  { label: 'Context' },
  { label: 'Funding' },
  { label: 'Confirm' },
];

export const LoanWizard: React.FC<{
  onClose: () => void;
  onLoanCreated?: (loan: Loan) => void;
  loanToEdit?: Loan;
}> = ({ onClose, loanToEdit }) => {
  const [step, setStep] = useState(0);
  const [loanData, setLoanData] = useState<Partial<Loan>>(loanToEdit || {
    nickname: '',
    comments: '',
    borrower_id: '',
    start_date: '',
    initial_balance: 0,
    initial_number_of_payments: 0,
    initial_frequency: 'every month',
    initial_annual_rate: 0,
    initial_payment_amount: 0,
    loan_type: 'Amortized: Due-Date',
    vault_id: '',
    is_funded: false,
  });

  const { user } = useAuth();
  const { showActivity, hideActivity } = useActivity();

  // Pour la validation du bouton Next
  const isNextDisabled = () => {
    switch (step) {
      case 0: // Purpose
        return !loanData.nickname || !loanData.comments;
      case 1: // Terms
        return !loanData.borrower_id || !loanData.start_date || !loanData.initial_balance || 
               !loanData.initial_number_of_payments || !loanData.initial_annual_rate;
      case 2: // Context
        return loanData.is_funded === undefined;
      case 3: // Funding
        return !loanData.vault_id;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    // Ferme le wizard et affiche le snackbar immédiatement
    onClose();
    showActivity('Creating loan...');

    // Création async en tâche de fond
    (async () => {
      const token = localStorage.getItem('authToken');
      if (!user || !token) return;
      try {
        // TODO: Implémenter la création du loan
        // const loan = await createLoan(token, loanData);
        
        // Passage à l'étape suivante APRÈS la fermeture du snackbar
        setTimeout(() => {
          hideActivity();
          // if (onLoanCreated) onLoanCreated(loan);
        }, 2000);
      } catch (error) {
        console.error('Error creating loan:', error);
        hideActivity();
      }
    })();
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="loan-wizard">
      <HeaderWizard
        title="Add loan"
        onExit={onClose}
        showPreview={step > 0}
        onPreview={step > 0 ? handlePrevious : undefined}
      />
      <div style={{ marginBottom: 32 }}>
        <StepsWizard steps={steps} currentStep={step} />
      </div>
      
      {/* Contenu des étapes */}
      {step === 0 && <StepPurpose loanData={loanData} setLoanData={setLoanData} />}
      {step === 1 && <StepTerms loanData={loanData} setLoanData={setLoanData} />}
      {step === 2 && <StepContext loanData={loanData} setLoanData={setLoanData} />}
      {step === 3 && <StepFunding loanData={loanData} setLoanData={setLoanData} />}
      {step === 4 && <StepConfirm loanData={loanData} />}

      {/* Footer avec boutons */}
      <div className="loan-wizard-footer">
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="center"
          name="cancel"
          form=""
          ariaLabel="Cancel"
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          style={{ width: 100 }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="center"
          name={step === steps.length - 1 ? 'finish' : 'next'}
          form=""
          ariaLabel={step === steps.length - 1 ? 'Finish' : 'Next'}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="primary"
          style={{ width: 100 }}
          onClick={handleNext}
          disabled={isNextDisabled()}
        >
          {step === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default LoanWizard; 