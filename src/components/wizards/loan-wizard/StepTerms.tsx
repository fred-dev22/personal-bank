import React, { useMemo } from 'react';
import type { Loan, Borrower } from '../../../types/types';
import { Input, PopupButton } from '@jbaluch/components';
import { BorrowerSelector } from './BorrowerSelector';
import { SelectDate } from '../../SelectDate';
import { calculateMonthlyPayment, formatCurrency } from './utils';

export const StepTerms: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
  borrowers: Borrower[];
  onCreateBorrower: (borrowerData: Partial<Borrower>) => void;
  validationErrors?: {[key: string]: string};
}> = ({ loanData, setLoanData, borrowers, onCreateBorrower, validationErrors = {} }) => {
  const handleBorrowerChange = (borrowerId: string) => {
    setLoanData({ ...loanData, borrower_id: borrowerId });
  };

  // Calculer le paiement mensuel quand les 3 champs sont remplis
  const monthlyPayment = useMemo(() => {
    const { initial_balance, initial_annual_rate, initial_number_of_payments, loan_type } = loanData;
    
    if (initial_balance && initial_annual_rate && initial_number_of_payments) {
      return calculateMonthlyPayment(initial_balance, initial_annual_rate, initial_number_of_payments, loan_type || 'Amortized: Due-Date');
    }
    return 0;
  }, [loanData.initial_balance, loanData.initial_annual_rate, loanData.initial_number_of_payments, loanData.loan_type]);

  return (
    <div className="loan-wizard-step">
      <h2>Loan terms</h2>
      <p>Complete the details for this loan.</p>
      
      <div className="loan-wizard-form-grid">
        <div className="loan-wizard-form-group">
          <BorrowerSelector
            borrowers={borrowers}
            value={loanData.borrower_id || ''}
            onChange={handleBorrowerChange}
            onCreateBorrower={onCreateBorrower}
            error={validationErrors.borrower_id}
          />
        </div>
        
        <div className="loan-wizard-form-group">
          <Input
            label="Total term in months"
            placeholder="Enter term"
            required
            value={loanData.initial_number_of_payments?.toString() || ''}
            onChange={(value: string) => setLoanData({ ...loanData, initial_number_of_payments: value ? parseInt(value) : undefined })}
            error={validationErrors.initial_number_of_payments}
          />
        </div>
        
                 <div className="loan-wizard-form-group">
           <SelectDate
             label="First payment date"
             placeholder="Select first payment date"
             value={loanData.start_date || ''}
             onChange={(value: string) => setLoanData({ ...loanData, start_date: value })}
             required
             error={validationErrors.start_date}
           />
         </div>
        
        <div className="loan-wizard-form-group">
           <Input
             label="Annual interest rate"
             placeholder="Enter rate"
             required
             type="percentage"
             value={loanData.initial_annual_rate?.toString() || ''}
             onChange={(value: string) => setLoanData({ ...loanData, initial_annual_rate: value ? parseFloat(value) : undefined })}
             error={validationErrors.initial_annual_rate}
           />
         </div>
         
         <div className="loan-wizard-form-group">
           <Input
             label="Amount"
             placeholder="Enter amount"
             required
             type="currency"
             value={loanData.initial_balance?.toString() || ''}
             onChange={(value: string) => setLoanData({ ...loanData, initial_balance: value ? parseFloat(value) : undefined })}
             error={validationErrors.initial_balance}
           />
         </div>
        
        <div className="loan-wizard-form-group">
          <PopupButton
            defaultValue={loanData.loan_type || 'Amortized: Due-Date'}
            items={[
              {
                id: 'Amortized: Due-Date',
                label: 'Amortized: Due-Date'
              },
              {
                id: 'Interest-only',
                label: 'Interest-only'
              },
              {
                id: 'Revolving',
                label: 'Revolving'
              }
            ]}
            label="Type"
            menuStyle="text"
            onSelect={(selectedId: string) => {
              setLoanData({ ...loanData, loan_type: selectedId });
            }}
            width="100%"
            menuMaxHeight="200px"
          />
          <small style={{ color: '#666', fontSize: 12, marginTop: 4, display: 'block', textAlign: 'left' }}>
             Interest accrues daily based on the current loan balance. It accrues through the due date, regardless of when the payment is made.
           </small>
        </div>
      </div>
      
      <div style={{ maxWidth: 600, margin: '32px auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
         <div style={{ 
           background: '#fff', 
           border: '1px solid #e0e0e0', 
           borderRadius: '8px', 
           padding: '20px',
           width: '100%',
           textAlign: 'left'
         }}>
           <div style={{ fontSize: 16, color: '#000', fontWeight: 600, marginBottom: 8 }}>Payment</div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 14, color: '#666' }}>
                The payment is the amount of money that will be paid back.
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>
                  {formatCurrency(monthlyPayment)}
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                  Monthly
                </div>
              </div>
            </div>
         </div>
         
         <div style={{ 
           background: '#fff', 
           border: '1px solid #e0e0e0', 
           borderRadius: '8px', 
           padding: '20px',
           width: '100%',
           textAlign: 'left'
         }}>
           <div style={{ fontSize: 16, color: '#000', fontWeight: 600, marginBottom: 8 }}>Cash flow rate</div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 0, lineHeight: 1.4 }}>
              This shows how quickly cash returns to you. It is a monthly metric, and is relative to the loan amount. Adjust it with the term and rate.
            </div>
         </div>
       </div>
    </div>
  );
};