import React from 'react';
import type { Loan } from '../../../types/types';

export const StepContext: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
}> = ({ loanData, setLoanData }) => {
  return (
    <div className="loan-wizard-step">
      <h2>Have you funded this loan already?</h2>
      
      <div className="loan-wizard-buttons">
        <button
          className={`loan-wizard-button ${loanData.is_funded === true ? 'selected' : ''}`}
          onClick={() => setLoanData({ ...loanData, is_funded: true })}
        >
          Yes
        </button>
        <button
          className={`loan-wizard-button ${loanData.is_funded === false ? 'selected' : ''}`}
          onClick={() => setLoanData({ ...loanData, is_funded: false })}
        >
          No
        </button>
      </div>
    </div>
  );
}; 