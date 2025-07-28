import React from 'react';
import type { Loan } from '../../../types/types';
import { Input } from '@jbaluch/components';
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';

export const StepPurpose: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
  validationErrors?: {[key: string]: string};
}> = ({ loanData, setLoanData, validationErrors = {} }) => {
  return (
    <div className="loan-wizard-step">
      <h2>Loan purpose</h2>
      <p>What is being funded?</p>
      
      <div className="loan-wizard-form">
        <div className="loan-wizard-form-group">
          <Input
            label="Loan name or ID"
            placeholder="Enter loan name or ID"
            required
            value={loanData.nickname || ''}
            onChange={(value: string) => setLoanData({ ...loanData, nickname: value })}
            error={validationErrors.nickname}
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <Input
            label="Purpose"
            placeholder="Type here..."
            value={loanData.comments || ''}
            onChange={(value: string) => setLoanData({ ...loanData, comments: value })}
            type="multiline"
            multiline={{
              maxHeight: 200,
              maxLength: 500,
              resizable: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}; 