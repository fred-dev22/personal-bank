import React from 'react';
import type { Loan } from '../../../types/types';

export const StepPurpose: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
}> = ({ loanData, setLoanData }) => {
  return (
    <div className="loan-wizard-step">
      <h2>Loan purpose</h2>
      <p>What is being funded?</p>
      
      <div className="loan-wizard-form">
        <div className="loan-wizard-form-group">
          <label>
            Loan name or ID <span className="required">*</span>
          </label>
          <input
            type="text"
            value={loanData.nickname || ''}
            onChange={(e) => setLoanData({ ...loanData, nickname: e.target.value })}
            placeholder="Enter loan name or ID"
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <label>Purpose</label>
          <textarea
            value={loanData.comments || ''}
            onChange={(e) => setLoanData({ ...loanData, comments: e.target.value })}
            placeholder="Type here..."
          />
        </div>
      </div>
    </div>
  );
}; 