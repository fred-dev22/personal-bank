import React from 'react';
import type { Loan } from '../../../types/types';

export const StepTerms: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
}> = ({ loanData, setLoanData }) => {
  return (
    <div className="loan-wizard-step">
      <h2>Loan terms</h2>
      <p>Complete the details for this loan.</p>
      
      <div className="loan-wizard-form-grid">
        <div className="loan-wizard-form-group">
          <label>
            Borrower <span className="required">*</span>
          </label>
          <input
            type="text"
            value={loanData.borrower_id || ''}
            onChange={(e) => setLoanData({ ...loanData, borrower_id: e.target.value })}
            placeholder="Select borrower"
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <label>
            Total term in months <span className="required">*</span>
          </label>
          <input
            type="number"
            value={loanData.initial_number_of_payments || ''}
            onChange={(e) => setLoanData({ ...loanData, initial_number_of_payments: parseInt(e.target.value) || 0 })}
            placeholder="Enter term"
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <label>
            First payment date <span className="required">*</span>
          </label>
          <input
            type="date"
            value={loanData.start_date || ''}
            onChange={(e) => setLoanData({ ...loanData, start_date: e.target.value })}
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
            placeholder="Enter rate"
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <label>
            Amount <span className="required">*</span>
          </label>
          <input
            type="number"
            value={loanData.initial_balance || ''}
            onChange={(e) => setLoanData({ ...loanData, initial_balance: parseFloat(e.target.value) || 0 })}
            placeholder="Enter amount"
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <label>Type</label>
          <select
            value={loanData.loan_type || 'Amortized: Due-Date'}
            onChange={(e) => setLoanData({ ...loanData, loan_type: e.target.value })}
          >
            <option value="Amortized: Due-Date">Amortized: Due-Date</option>
            <option value="Interest-only">Interest-only</option>
            <option value="Revolving">Revolving</option>
          </select>
          <small style={{ color: '#666', fontSize: 12, marginTop: 4, display: 'block' }}>
            Interest accrues daily based on the current loan balance. It accrues through the due date, regardless of when the payment is made.
          </small>
        </div>
      </div>
      
      <div style={{ maxWidth: 600, margin: '32px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Payment</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            The payment is the amount of money that will be paid back.
          </div>
          <div style={{ 
            background: '#f5f5f5', 
            padding: 12, 
            borderRadius: 8, 
            marginTop: 8,
            minHeight: 40,
            display: 'flex',
            alignItems: 'center'
          }}>
            ${loanData.initial_payment_amount?.toFixed(2) || '0.00'}
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Cash flow rate</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            This shows how quickly cash returns to you. It is a monthly metric, and is relative to the loan amount. Adjust it with the term and rate.
          </div>
          <div style={{ 
            background: '#f5f5f5', 
            padding: 12, 
            borderRadius: 8, 
            marginTop: 8,
            minHeight: 40,
            display: 'flex',
            alignItems: 'center'
          }}>
            {loanData.initial_annual_rate ? `${(loanData.initial_annual_rate / 12).toFixed(2)}%` : '0.00%'}
          </div>
        </div>
      </div>
    </div>
  );
}; 