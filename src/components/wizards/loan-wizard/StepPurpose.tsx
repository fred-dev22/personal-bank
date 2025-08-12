import React from 'react';
import type { Loan } from '../../../types/types';
import { Input } from '@jbaluch/components';
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';

export const StepPurpose: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: React.Dispatch<React.SetStateAction<Partial<Loan>>>;
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
            onChange={(value: string) => setLoanData(prev => ({ ...prev, nickname: value }))}
            error={validationErrors.nickname}
            style={{ width: '350px' }}
          />
        </div>
        
        <div >
          <Input
            label="Purpose"
            placeholder="Type here..."
            value={loanData.comments || ''}
            onChange={(value: string) => setLoanData(prev => ({ ...prev, comments: value }))}
            type="multiline"
            multiline={{
              maxHeight: 150,
              maxLength: 500,
            }}
            style={{ width: '350px', height: '150px' }}
          />
        </div>
      </div>
    </div>
  );
}; 