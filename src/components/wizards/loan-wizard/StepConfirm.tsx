import React from 'react';
import type { Loan } from '../../../types/types';

export const StepConfirm: React.FC<{
  loanData: Partial<Loan>;
}> = ({ loanData }) => {
  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
          {loanData.nickname}
        </h2>
        
        <div className="loan-wizard-summary-card">
          <div className="loan-wizard-summary-grid">
            <div>
              <div className="loan-wizard-summary-value">
                ${loanData.initial_balance?.toFixed(2) || '0.00'}
              </div>
              <div className="loan-wizard-summary-label">funding amount</div>
            </div>
            <div>
              <div className="loan-wizard-summary-value">
                ${loanData.initial_payment_amount?.toFixed(2) || '0.00'}
              </div>
              <div className="loan-wizard-summary-label">
                {loanData.initial_number_of_payments || 0} months
              </div>
            </div>
            <div>
              <div className="loan-wizard-summary-value">
                {loanData.initial_annual_rate?.toFixed(2) || '0.00'}%
              </div>
              <div className="loan-wizard-summary-label">{loanData.loan_type}</div>
            </div>
          </div>
        </div>
        
        <div className="loan-wizard-summary-card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Cash flow rate</h3>
          <div className="loan-wizard-slider">
            <div className="loan-wizard-slider-thumb" />
            <div className="loan-wizard-slider-labels">
              <span>slow</span>
              <span>moderate</span>
              <span>fast</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }}>8.88</div>
        </div>
        
        <div className="loan-wizard-summary-card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Gateway</h3>
          <div style={{ color: '#666', marginBottom: 16 }}>Cash vault</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>$7,500.00</div>
        </div>
        
        <div className="loan-wizard-summary-card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Downloads</h3>
          <p style={{ color: '#666', marginBottom: 16 }}>
            Download this promissory note, or upload an existing one after the loan is added to the app.
          </p>
          <div className="loan-wizard-download-card">
            <span className="loan-wizard-download-icon">📄</span>
            <span className="loan-wizard-download-name">Promissory.pdf</span>
            <span className="loan-wizard-download-arrow">↗</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 