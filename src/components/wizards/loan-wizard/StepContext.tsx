import React, { useState } from 'react';
import { Button } from '@jbaluch/components';
import type { Loan } from '../../../types/types';

interface StepContextProps {
  loanData: Partial<Loan>;
  setLoanData: (data: Partial<Loan>) => void;
  validationErrors?: {[key: string]: string};
  onNext: () => void; // Fonction pour avancer automatiquement
}

export const StepContext: React.FC<StepContextProps> = ({ 
  loanData, 
  setLoanData, 
  validationErrors = {},
  onNext 
}) => {
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [fundingDate, setFundingDate] = useState('');

  const handleChoice = (choice: boolean) => {
    if (choice) {
      // Si "Yes", ouvrir le popup pour la date
      setLoanData({ ...loanData, is_funded: true });
      setShowDatePopup(true);
    } else {
      // Si "No", avancer directement
      setLoanData({ ...loanData, is_funded: false });
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  const handleConfirmDate = () => {
    if (fundingDate) {
      // Stocker la date de financement dans les commentaires ou un autre champ existant
      setLoanData({ ...loanData, is_funded: true, comments: (loanData.comments || '') + `Funding date: ${fundingDate}` });
      setShowDatePopup(false);
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  const handleCancelDate = () => {
    setShowDatePopup(false);
    setLoanData({ ...loanData, is_funded: undefined });
  };

  // Fonction pour obtenir la date max (aujourd'hui)
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="loan-wizard-step">
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px', textAlign: 'center' }}>
        Have you funded this loan already?
      </h2>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '32px',
        marginTop: '48px'
      }}>
        <div
          onClick={() => handleChoice(true)}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: loanData.is_funded === true ? '#EEEEF2' : '#F0F0F1',
            border: '1px solid #ddd',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            if (loanData.is_funded !== true) {
              e.currentTarget.style.backgroundColor = '#EEEEF2';
            }
          }}
          onMouseLeave={(e) => {
            if (loanData.is_funded !== true) {
              e.currentTarget.style.backgroundColor = '#F0F0F1';
            }
          }}
        >
          Yes
        </div>
        
        <div
          onClick={() => handleChoice(false)}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: loanData.is_funded === false ? '#EEEEF2' : '#F0F0F1',
            border: '1px solid #ddd',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            if (loanData.is_funded !== false) {
              e.currentTarget.style.backgroundColor = '#EEEEF2';
            }
          }}
          onMouseLeave={(e) => {
            if (loanData.is_funded !== false) {
              e.currentTarget.style.backgroundColor = '#F0F0F1';
            }
          }}
        >
          No
        </div>
      </div>
      
             {validationErrors.is_funded && (
         <div style={{ 
           color: '#d32f2f', 
           fontSize: '14px', 
           marginTop: '16px', 
           textAlign: 'center' 
         }}>
           {validationErrors.is_funded}
         </div>
       )}

       {/* Popup pour la date de financement */}
       {showDatePopup && (
         <div style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundColor: 'rgba(0, 0, 0, 0.5)',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           zIndex: 9999
         }}>
           <div style={{
             backgroundColor: '#fff',
             borderRadius: '8px',
             padding: '32px',
             width: '400px',
             maxWidth: '90vw',
             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
           }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap' }}>Funding date</h3>
               <button
                 onClick={handleCancelDate}
                 style={{
                   background: 'none',
                   border: 'none',
                   fontSize: '20px',
                   cursor: 'pointer',
                   padding: '4px'
                 }}
               >
                 ×
               </button>
             </div>
             
             <p style={{ 
               color: '#666', 
               fontSize: '14px', 
               textAlign: 'center', 
               marginBottom: '24px',
               lineHeight: '1.5'
             }}>
               Select the date in which this loan was funded and confirm.
             </p>
             
             <div style={{ marginBottom: '32px' }}>
               <input
                 type="date"
                 value={fundingDate}
                 onChange={(e) => setFundingDate(e.target.value)}
                 max={getTodayDate()}
                 style={{
                   width: '100%',
                   height: '48px',
                   padding: '0 16px',
                   border: '1px solid #ddd',
                   borderRadius: '8px',
                   fontSize: '16px',
                   outline: 'none',
                   boxSizing: 'border-box'
                 }}
                 placeholder="DD/MM/YYYY"
               />
             </div>
             
             <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
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
                 onClick={handleCancelDate}
                 style={{ width: '100px' }}
               >
                 Cancel
               </Button>
               <Button
                 icon="iconless"
                 iconComponent={undefined}
                 interaction="default"
                 justified="center"
                 name="confirm"
                 form=""
                 ariaLabel="Confirm"
                 onMouseEnter={() => {}}
                 onMouseLeave={() => {}}
                 type="primary"
                 onClick={handleConfirmDate}
                 disabled={!fundingDate}
                 style={{ 
                   width: '100px',
                   backgroundColor: !fundingDate ? '#ccc' : undefined
                 }}
               >
                 Confirm
               </Button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
}; 