import React from 'react';
import type { Loan } from '../../../types/types';

export const StepFunding: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
}> = ({ loanData, setLoanData }) => {
  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Funding source</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            How do you want to fund this loan? You can adjust the loan terms to meet a vault's minimum Income DSCR.
          </p>
          
          <div className="loan-wizard-funding-card">
            <div className="loan-wizard-funding-card-header">
              <input
                type="radio"
                checked={loanData.vault_id === 'gateway'}
                onChange={() => setLoanData({ ...loanData, vault_id: 'gateway' })}
              />
              <div>
                <div className="loan-wizard-funding-card-title">Gateway</div>
                <div className="loan-wizard-funding-card-subtitle">Cash Vault</div>
              </div>
              <div className="loan-wizard-funding-card-amount">
                $7,500.00
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Loan Terms</h2>
          
          <div className="loan-wizard-form-group">
            <label>
              Term in months <span className="required">*</span>
            </label>
            <input
              type="number"
              value={loanData.initial_number_of_payments || ''}
              onChange={(e) => setLoanData({ ...loanData, initial_number_of_payments: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="loan-wizard-form-group">
            <label>
              Annual interest rate <span className="required">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={loanData.initial_annual_rate || ''}
              onChange={(e) => setLoanData({ ...loanData, initial_annual_rate: parseFloat(e.target.value) || 0 })}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Loan constant</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>8.88%</div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Payment</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>$1.07</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 