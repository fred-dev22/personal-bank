import React, { useState, useEffect } from 'react';
import { Button } from '@jbaluch/components';
import type { Loan } from '../../../types/types';
import { formatCurrency } from '../../../utils/currencyUtils';

interface PaymentRow {
  id: string;
  dueDate: string;
  category: string;
  amount: number;
  status: string;
}

export const StepHistory: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: React.Dispatch<React.SetStateAction<Partial<Loan>>>;
  validationErrors?: {[key: string]: string};
}> = ({ loanData, setLoanData, validationErrors: _validationErrors = {} }) => {
  // Fonction pour générer l'historique automatiquement
  const generatePaymentHistory = () => {
    if (!loanData.start_date) return [];
    
    const startDate = new Date(loanData.start_date);
    const today = new Date();
    const history: PaymentRow[] = [];
    
    let currentDate = new Date(startDate);
    let paymentNumber = 1;
    
    // Générer les paiements jusqu'à aujourd'hui
    while (currentDate <= today) {
      // Formater la date au format YYYY-MM-DD pour SelectDate
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      history.push({
        id: paymentNumber.toString(),
        dueDate: formattedDate,
        category: 'Loan payment',
        amount: ((loanData.initial_balance || 0) / (loanData.initial_number_of_payments || 1)),
        status: 'On time'
      });
      
      // Passer au mois suivant
      currentDate.setMonth(currentDate.getMonth() + 1);
      paymentNumber++;
    }
    
    return history;
  };

  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);

  // Fonction pour régénérer l'historique
  const regenerateHistory = () => {
    const newHistory = generatePaymentHistory();
    setPaymentRows(newHistory);
  };

  // Régénérer l'historique quand le composant devient visible (mount)
  useEffect(() => {
    regenerateHistory();
  }, []); // Se déclenche à chaque fois que le composant est affiché

  // Régénérer l'historique quand les données du loan changent
  useEffect(() => {
    regenerateHistory();
  }, [loanData.start_date, loanData.initial_balance, loanData.initial_number_of_payments]);

  // Sauvegarder automatiquement les données des paiements quand paymentRows change
  useEffect(() => {
    const paymentData = paymentRows
      .filter(row => row.amount > 0 && row.dueDate)
      .map(row => {
        return {
          amount: row.amount,
          date: row.dueDate,
          balloon: row.status === 'Missed',
          status: row.status
        };
      });

    // Stocker les données des paiements dans le loanData
    setLoanData(prev => ({
      ...prev,
      pendingPayments: paymentData
    }));

    console.log('✅ Payment data automatically saved:', paymentData);
  }, [paymentRows, setLoanData]);

  const addPaymentRow = () => {
    const newRow: PaymentRow = {
      id: Date.now().toString(),
      dueDate: new Date().toISOString().split('T')[0], // Date d'aujourd'hui par défaut
      category: 'Loan payment',
      amount: 0,
      status: 'On time'
    };
    setPaymentRows([...paymentRows, newRow]);
  };

  const updatePaymentRow = (id: string, field: keyof PaymentRow, value: string | number) => {
    setPaymentRows(paymentRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const deletePaymentRow = (id: string) => {
    setPaymentRows(paymentRows.filter(row => row.id !== id));
  };



  return (
    <div className="loan-wizard-step">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
        Loan amortization
      </h2>
      
             <p style={{ 
         color: '#666', 
         textAlign: 'center', 
         marginBottom: '32px', 
         lineHeight: '1.5',
         fontSize: '14px'
       }}>
         Here's what you should have received already. Adjust each row to match your records. Payment data will be automatically saved and created at the end of the wizard. Or, you can later upload a CSV in the loan's activity tab.
       </p>

      <div className="payment-history-table">
        <div className="table-header">
          <div className="header-cell">Due Date</div>
          <div className="header-cell">Category</div>
          <div className="header-cell">Amount</div>
          <div className="header-cell">Status</div>
          <div className="header-cell"></div>
        </div>

                 {paymentRows.map((row) => (
           <div key={row.id} className="table-row">
             <div className="table-cell">
               <input
                 type="date"
                 value={row.dueDate || ''}
                 onChange={(e) => updatePaymentRow(row.id, 'dueDate', e.target.value)}
                 className="table-input"
                 style={{ 
                   cursor: 'pointer',
                   border: '1px solid #e0e0e0',
                   borderRadius: '4px',
                   padding: '8px 12px',
                   fontSize: '14px',
                   width: 'calc(100% - 8px)',
                   boxSizing: 'border-box'
                 }}
               />
             </div>
            <div className="table-cell">
              <div className="category-badge">
                💰 {row.category}
              </div>
            </div>
            <div className="table-cell">
              <input
                type="text"
                value={row.amount > 0 ? formatCurrency(row.amount) : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[$,]/g, '');
                  updatePaymentRow(row.id, 'amount', parseFloat(value) || 0);
                }}
                placeholder="$0.00"
                className="table-input"
              />
            </div>
            <div className="table-cell">
              <select
                value={row.status}
                onChange={(e) => updatePaymentRow(row.id, 'status', e.target.value)}
                className="table-select"
              >
                <option value="On time">On time</option>
                <option value="Late">Late</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
            <div className="table-cell">
              <button
                onClick={() => deletePaymentRow(row.id)}
                className="delete-button"
                title="Delete row"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

             <div style={{ textAlign: 'center', marginTop: '24px' }}>
         <Button
           icon="iconless"
           iconComponent={undefined}
           interaction="default"
           justified="center"
           name="add"
           form=""
           ariaLabel="Add"
           onMouseEnter={() => {}}
           onMouseLeave={() => {}}
           type="secondary"
           onClick={addPaymentRow}
           style={{ 
             display: 'inline-flex', 
             alignItems: 'center', 
             gap: '8px',
             width: '100px'
           }}
         >
           <span style={{ fontSize: '18px' }}>+</span>
           Add
         </Button>
       </div>
      </div>
    </div>
  );
}; 