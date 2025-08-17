import React, { useState } from 'react';
import { Button } from '@jbaluch/components';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import './RecastLoanWizard.css';
import { PaymentTable } from './PaymentTable';
import { ManualEntry } from './ManualEntry';
import { calculateMonthlyPayment } from '../../../utils/loanUtils';
import type { Loan } from '../../../types/types';

interface RecastLoanWizardProps {
  onClose: () => void;
  loanToRecast?: Loan;
  onRecastSuccess?: () => void;
}

type Screen = 'table' | 'manual' | 'finish';

export const RecastLoanWizard: React.FC<RecastLoanWizardProps> = ({ onClose, loanToRecast, onRecastSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('table');
  const [selectedRate, setSelectedRate] = useState<number>(5);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(12);
  const [manualRate, setManualRate] = useState<number>(5);
  const [manualPeriod, setManualPeriod] = useState<number>(12);

  // Si pas de loan à recaster, fermer le wizard
  if (!loanToRecast) {
    onClose();
    return null;
  }

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
    // Ici on peut ajouter la logique pour sauvegarder le recast
    console.log('Recast loan with:', {
      rate: selectedRate,
      period: selectedPeriod,
      newPayment: newMonthlyPayment
    });
    if (onRecastSuccess) {
      onRecastSuccess();
    }
    onClose();
  };

  const handleBack = () => {
    if (currentScreen === 'manual') {
      setCurrentScreen('table');
    } else if (currentScreen === 'finish') {
      setCurrentScreen('manual');
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
        showPreview={currentScreen !== 'table'}
        onPreview={currentScreen !== 'table' ? handleBack : undefined}
      />

      <div className="recast-loan-wizard__content">
        {currentScreen === 'table' && (
          <>
            <div className="recast-loan-wizard__section">
              <h2>Select a new payment</h2>
              <p>We will adjust the loan terms for the new payment.</p>
            </div>

            <div className="recast-loan-wizard__main">
              <PaymentTable
                balance={loanToRecast.current_balance}
                selectedRate={selectedRate}
                selectedPeriod={selectedPeriod}
                onSelectionChange={handleTableSelection}
              />

              <div className="recast-loan-wizard__summary">
                <div className="payment-summary">
                  <div className="payment-summary__new">
                    <div className="payment-summary__amount">${newMonthlyPayment.toFixed(2)}</div>
                    <div className="payment-summary__label">New Monthly Payment</div>
                  </div>
                  <div className="payment-summary__old">
                    <div className="payment-summary__amount">${(loanToRecast.monthly_payment_amount || 0).toFixed(2)}</div>
                    <div className="payment-summary__label">Old Monthly Payment</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

                 {currentScreen === 'manual' && (
           <ManualEntry
             balance={loanToRecast.current_balance}
             rate={manualRate}
             period={manualPeriod}
             oldPayment={loanToRecast.monthly_payment_amount || 0}
             onRateChange={setManualRate}
             onPeriodChange={setManualPeriod}
           />
         )}

        {currentScreen === 'finish' && (
          <>
            <div className="recast-loan-wizard__section">
              <h2>Recast Summary</h2>
            </div>

            <div className="recast-loan-wizard__summary-card">
              <div className="summary-card__left">
                <div className="summary-item">
                  <span className="summary-label">New payment</span>
                  <span className="summary-value">${newMonthlyPayment.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Term</span>
                  <span className="summary-value">{selectedPeriod} months</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Rate</span>
                  <span className="summary-value">{(selectedRate / 100).toFixed(2)}</span>
                </div>
              </div>
              <div className="summary-card__right">
                <div className="summary-item">
                  <span className="summary-label">Balance</span>
                  <span className="summary-value">${loanToRecast.current_balance.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Type</span>
                  <span className="summary-value">Amortized: Due-Date</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Recast date</span>
                  <span className="summary-value">{new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>

            <div className="recast-loan-wizard__downloads">
              <h3>Downloads</h3>
              <div className="download-item">
                <span className="download-icon">📄</span>
                <span className="download-text">Promissory.pdf</span>
                <span className="download-arrow">↗</span>
              </div>
            </div>
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
