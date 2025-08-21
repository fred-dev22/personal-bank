import React, { useState, useMemo } from 'react';
import { Button } from '@jbaluch/components';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import './RecastLoanWizard.css';
import { PaymentTable } from './PaymentTable';
import { ManualEntry } from './ManualEntry';
import { calculateMonthlyPayment } from '../../../utils/loanUtils';
import { recastLoan } from '../../../controllers/loanController';
import { useActivity } from '../../../contexts/ActivityContext';

import type { Loan, Borrower, Vault } from '../../../types/types';

interface RecastLoanWizardProps {
  onClose: () => void;
  loanToRecast?: Loan;
  onRecastSuccess?: () => void;
  borrowers: Borrower[];
  vaults: Vault[];
}

type Screen = 'table' | 'manual' | 'finish';

export const RecastLoanWizard: React.FC<RecastLoanWizardProps> = ({ onClose, loanToRecast, onRecastSuccess, borrowers, vaults }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('table');
  const [selectedRate, setSelectedRate] = useState<number>(5);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(12);
  const [manualRate, setManualRate] = useState<number>(5);
  const [manualPeriod, setManualPeriod] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<'summary' | 'instructions'>('summary');
  const { showActivity } = useActivity();

  const token = localStorage.getItem('authToken');

  // Récupérer le borrower et vault correspondants
  const currentBorrower = useMemo(() => {
    if (!loanToRecast) return null;
    // Essayer d'abord borrower_id, puis borrowerId
    const borrowerId = loanToRecast.borrower_id || loanToRecast.borrowerId;
    console.log('Debug - Looking for borrower:', borrowerId, 'in borrowers:', borrowers);
    const found = borrowers.find(borrower => borrower.id === borrowerId);
    console.log('Debug - Found borrower:', found);
    return found;
  }, [borrowers, loanToRecast?.borrower_id, loanToRecast?.borrowerId]);

  const currentVault = useMemo(() => {
    if (!loanToRecast) return null;
    // Essayer d'abord vault_id, puis vaultId
    const vaultId = loanToRecast.vault_id || loanToRecast.vaultId;
    console.log('Debug - Looking for vault:', vaultId, 'in vaults:', vaults);
    const found = vaults.find(vault => vault.id === vaultId);
    console.log('Debug - Found vault:', found);
    return found;
  }, [vaults, loanToRecast?.vault_id, loanToRecast?.vaultId]);

  // Si pas de loan à recaster, fermer le wizard
  if (!loanToRecast) {
    onClose();
    return null;
  }



  // Debug du loan
  console.log('Debug - Loan data:', loanToRecast);
  console.log('Debug - Loan keys:', Object.keys(loanToRecast));

  // Calculer le nouveau paiement mensuel basé sur la sélection
  const newMonthlyPayment = calculateMonthlyPayment(
    loanToRecast.current_balance,
    selectedPeriod,
    selectedRate / 100
  );

  const handleTableSelection = (rate: number, period: number) => {
    setSelectedRate(rate);
    setSelectedPeriod(period);
  };

  const handleShowManualEntry = () => {
    setManualRate(selectedRate);
    setManualPeriod(selectedPeriod);
    setCurrentScreen('manual');
  };

  const handleManualNext = () => {
    setSelectedRate(manualRate);
    setSelectedPeriod(manualPeriod);
    setCurrentScreen('finish');
  };

  const handleFinish = () => {
    console.log('🔍 handleFinish called');
    handleFinishRecast();
  };

  const handleBack = () => {
    if (currentScreen === 'manual') {
      setCurrentScreen('table');
    } else if (currentScreen === 'finish') {
      setCurrentScreen('manual');
    }
  };

  const handleFinishRecast = async () => {
    console.log('🔍 handleFinishRecast called');
    console.log('🔍 token:', token);
    console.log('🔍 loanToRecast.id:', loanToRecast.id);
    
    if (!token) {
      console.error('❌ No token found');
      showActivity('No authentication token found');
      return;
    }
    
    if (!loanToRecast.id) {
      console.error('❌ No loan ID found');
      showActivity('No loan ID found');
      return;
    }
    
    // Fermer le wizard immédiatement
    onClose();
    
    // Afficher le Snackbar "Recast in progress"
    showActivity('Recast in progress...');
    
    try {
             const recastData: Partial<Loan> = {
         initial_annual_rate: currentScreen === 'manual' ? manualRate / 100 : selectedRate / 100,
         initial_number_of_payments: currentScreen === 'manual' ? manualPeriod : selectedPeriod,
         monthly_payment_amount: newMonthlyPayment,
         // Inclure le current_balance pour l'API recast
         current_balance: loanToRecast.current_balance || 0,
         is_recast: true
       };

      console.log('🔄 Starting recast with data:', recastData);
      console.log('🔄 Calling recastLoan with token:', token, 'loan ID:', loanToRecast.id);
      
      const updatedLoan = await recastLoan(token, loanToRecast.id, recastData);
      
      console.log('✅ Recast successful:', updatedLoan);
      console.log('✅ Updated loan data:', {
        newRate: updatedLoan.initial_annual_rate,
        newPeriod: updatedLoan.initial_number_of_payments,
        newMonthlyPayment: updatedLoan.monthly_payment_amount,
        isRecast: updatedLoan.is_recast,
        recastDate: updatedLoan.recast_date
      });
      
      // Afficher le Snackbar de succès
      showActivity('Loan recast successfully!');
      
      // Appeler le callback de succès
      if (onRecastSuccess) {
        onRecastSuccess();
      }
    } catch (error) {
      console.error('❌ Error recasting loan:', error);
      
      // Afficher le Snackbar d'erreur
      showActivity('Failed to recast loan. Please try again.');
    }
  };

  const isNextDisabled = () => {
    return false; // Toujours activé pour ce wizard
  };

  return (
    <div className="recast-loan-wizard">
      <HeaderWizard
        title="Recast Loan"
        onExit={onClose}
        showPreview={currentScreen === 'finish'}
        onPreview={currentScreen === 'finish' ? handleBack : undefined}
      />

      <div className="recast-loan-wizard__content">
        {currentScreen === 'table' && (
          <>
            <div className="recast-loan-wizard__header-content">
              <h1 className="recast-loan-wizard__title">Select a new payment</h1>
              <p className="recast-loan-wizard__subtitle">We will adjust the loan terms for the new payment.</p>
            </div>
            
            <div className="recast-loan-wizard__main-content">
              <PaymentTable
                balance={loanToRecast.current_balance || 0}
                selectedPeriod={selectedPeriod}
                selectedRate={selectedRate}
                onSelectionChange={handleTableSelection}
              />
              
              <div className="recast-loan-wizard__summary-card">
                <div className="recast-loan-wizard__summary-item">
                  <div className="recast-loan-wizard__summary-value">
                    ${newMonthlyPayment.toFixed(2)}
                  </div>
                  <div className="recast-loan-wizard__summary-label">New Monthly Payment</div>
                </div>
                <div className="recast-loan-wizard__summary-item">
                  <div className="recast-loan-wizard__summary-value">
                    ${(loanToRecast.monthly_payment_amount || 0).toFixed(2)}
                  </div>
                  <div className="recast-loan-wizard__summary-label">Old Monthly Payment</div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'manual' && (
          <ManualEntry
            balance={loanToRecast.current_balance || 0}
            rate={manualRate}
            period={manualPeriod}
            oldPayment={loanToRecast.monthly_payment_amount || 0}
            onRateChange={setManualRate}
            onPeriodChange={setManualPeriod}
          />
        )}

        {currentScreen === 'finish' && (
          <>
            <div className="recast-finish__header">
              <h1 className="recast-finish__title">{loanToRecast.nickname || `Loan ${loanToRecast.loan_number}` || 'Loan'}</h1>
              <div className="recast-finish__tabs">
                <button 
                  className={`recast-finish__tab ${activeTab === 'summary' ? 'recast-finish__tab--active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </button>
                <button 
                  className={`recast-finish__tab ${activeTab === 'instructions' ? 'recast-finish__tab--active' : ''}`}
                  onClick={() => setActiveTab('instructions')}
                >
                  Instructions
                </button>
              </div>
            </div>

            {activeTab === 'summary' && (
              <div className="recast-finish__content">
                <div className="recast-finish__summary-grid">
                  <div className="recast-finish__summary-left">
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__borrower">{currentBorrower?.fullName || 'Borrower'}</div>
                      <div className="recast-finish__label">Borrower</div>
                    </div>
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">${newMonthlyPayment.toFixed(2)}</div>
                      <div className="recast-finish__label">New payment</div>
                    </div>
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">Amortized: Due-Date</div>
                      <div className="recast-finish__label">Type</div>
                    </div>
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">Aug 19, 2025</div>
                      <div className="recast-finish__label">Recast date</div>
                    </div>
                  </div>
                  
                  <div className="recast-finish__summary-right">
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">${(loanToRecast.current_balance || 0).toFixed(2)}</div>
                      <div className="recast-finish__label">Balance</div>
                    </div>
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">{selectedPeriod} Months</div>
                      <div className="recast-finish__label">Term</div>
                    </div>
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">{(selectedRate).toFixed(2)}%</div>
                      <div className="recast-finish__label">Rate</div>
                    </div>
                    <div className="recast-finish__info-item">
                      <div className="recast-finish__value">{currentVault?.nickname || 'Vault'}</div>
                      <div className="recast-finish__label">Vault</div>
                    </div>
                  </div>
                </div>

                <div className="recast-finish__downloads">
                  <h3>Downloads</h3>
                  <div className="recast-finish__download-item">
                    <span className="recast-finish__download-icon">📄</span>
                    <span className="recast-finish__download-text">Promissory.pdf</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="recast-finish__content">
                <div className="recast-finish__instructions">
                  <div className="recast-finish__instruction-section">
                    <div className="recast-finish__instruction-header">
                      <h3>Funding</h3>
                      <span className="recast-finish__instruction-icon">📋</span>
                    </div>
                    <ul>
                      <li>Send {currentBorrower?.fullName || 'the borrower'} the new Promissory Note and have them sign it. Store the signed Note for your records.</li>
                      <li>We will automatically recompute the payment schedule.</li>
                    </ul>
                  </div>

                  <div className="recast-finish__instruction-section">
                    <h3>Receiving Payments</h3>
                    <ul>
                      <li>You will get a ${newMonthlyPayment.toFixed(2)} payment from {currentBorrower?.fullName || 'the borrower'} every month. Put this into the Gateway.</li>
                    </ul>
                  </div>

                  <div className="recast-finish__instruction-section">
                    <h3>Completion</h3>
                    <ul>
                      <li>This loan ends after {selectedPeriod} timely payments.</li>
                    </ul>
                  </div>
                </div>

                <div className="recast-finish__downloads">
                  <h3>Downloads</h3>
                  <div className="recast-finish__download-item">
                    <span className="recast-finish__download-icon">📄</span>
                    <span className="recast-finish__download-text">Promissory.pdf</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer avec boutons fixés en bas */}
      <div className="recast-loan-wizard-footer">
        {currentScreen === 'table' && (
          <>
            <Button
              icon="iconless"
              iconComponent={undefined}
              interaction="default"
              justified="center"
              name="show-manual"
              form=""
              ariaLabel="Show Manual Entry"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="secondary"
              style={{ width: 140 }}
              onClick={handleShowManualEntry}
            >
              Show Manual Entry
            </Button>
            <Button
              icon="iconless"
              iconComponent={undefined}
              interaction="default"
              justified="center"
              name="next"
              form=""
              ariaLabel="Next"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="primary"
              style={{ width: 100, height: 40 }}
              onClick={() => setCurrentScreen('finish')}
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          </>
        )}

        {currentScreen === 'manual' && (
          <>
            <Button
              icon="iconless"
              iconComponent={undefined}
              interaction="default"
              justified="center"
              name="show-table"
              form=""
              ariaLabel="Show Payment Table"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="secondary"
              style={{ width: 140 }}
              onClick={() => setCurrentScreen('table')}
            >
              Show Payment Table
            </Button>
            <Button
              icon="iconless"
              iconComponent={undefined}
              interaction="default"
              justified="center"
              name="next"
              form=""
              ariaLabel="Next"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="primary"
              style={{ width: 100, height: 40 }}
              onClick={handleManualNext}
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          </>
        )}

        {currentScreen === 'finish' && (
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            justified="center"
            name="finish"
            form=""
            ariaLabel="Finish"
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="primary"
            style={{ width: 100, height: 40 }}
                         onClick={handleFinish}
           >
             Finish
          </Button>
        )}
      </div>
    </div>
  );
};
