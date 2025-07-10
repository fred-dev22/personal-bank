import React, { useState } from 'react';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import { StepType } from './StepType';
import { StepConfig } from './StepConfig';
import { StepReserve } from './StepReserve';
import { StepHold } from './StepHold';
import { StepConfirm } from './StepConfirm';
import { Button } from '@jbaluch/components';
import StepsWizard from '../wizard-components/StepsWizard';
import type { Vault } from '../../../types/types';
import { StepAsset } from './StepAsset';
import { StepDebt } from './StepDebt';

// Définir les étapes selon le type de vault
const stepsCashVault = [
  { label: 'Configure' },
  { label: 'Reserve' },
  { label: 'Hold' },
  { label: 'Confirm' },
];
const stepsSuperVault = [
  { label: 'Name' },
  { label: 'Asset' },
  { label: 'Strategic Debt' },
  { label: 'Reserve' },
  { label: 'Hold' },
  { label: 'Confirm' },
];

export const VaultWizard: React.FC<{ onClose: () => void; vaultToEdit?: Vault; vaultType?: 'cash' | 'super' }> = ({ onClose, vaultToEdit, vaultType }) => {
  const [type, setType] = useState<'cash' | 'super' | undefined>(vaultType);
  const steps = type === 'super' ? stepsSuperVault : stepsCashVault;
  const [step, setStep] = useState(0);
  const [vaultData, setVaultData] = useState<Vault>(vaultToEdit || {
    id: '',
    name: type === 'super' ? 'Super Vault' : '',
    issues: 0,
    balance: 10000,
    financials: { paidIn: 0, paidOut: 0 },
    health: { reserves: 0, loanToValue: 0, incomeDSCR: 0, growthDSCR: 0 },
    hold: 0,
    reserve: 0,
    type,
    // Champs Super Vault
    assetType: '',
    assetName: '',
    assetStartDate: '',
    annualNonMecLimit: '',
    annualGuidelineAmount: '',
    annualGrowthRate: '',
    premiumPaidThisYear: '',
    debtBalance: '',
    debtCeilingRate: '',
    debtLtv: '',
  });

  // Pour la validation du bouton Next
  const isNextDisabled = () => {
    return false;
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div style={{ width: '100%', padding: 32, boxSizing: 'border-box', paddingBottom: 120 }}>
      <HeaderWizard
        title={vaultToEdit ? 'Edit Vault' : 'Add Vault'}
        onExit={onClose}
        showPreview={step > 0}
        onPreview={step > 0 ? () => {
          if (step === 1) {
            setType(undefined);
            setStep(0);
          } else {
            setStep(Math.max(0, step - 1));
          }
        } : undefined}
      />
      {type === undefined ? (
        <StepType
          selectedType={type || ''}
          onSelect={t => {
            setType(t as 'cash' | 'super');
            setVaultData({ ...vaultData, type: t });
          }}
          onTypeSelected={() => setStep(1)}
        />
      ) : (
        <>
          <div style={{ marginBottom: 32 }}>
            <StepsWizard steps={steps} currentStep={step - 1} />
          </div>
          {type === 'super' ? (
            step === 1 ? <StepConfig vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 2 ? <StepAsset vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 3 ? <StepDebt vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 4 ? <StepReserve vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 5 ? <StepHold vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 6 ? <StepConfirm vaultData={vaultData} /> : null
          ) : (
            step === 1 ? <StepConfig vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 2 ? <StepReserve vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 3 ? <StepHold vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 4 ? <StepConfirm vaultData={vaultData} /> : null
          )}
          {step > 0 && (
            <div className="wizard-footer" style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              background: '#fff',
              padding: '24px 0 24px 0',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
              zIndex: 2000,
              width: '100vw',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button
                icon="iconless"
                iconComponent={undefined}
                interaction="default"
                justified="right"
                name={step === steps.length ? 'finish' : 'next'}
                form=""
                ariaLabel={step === steps.length ? 'Finish' : 'Next'}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="primary"
                style={{ width: 100 }}
                onClick={handleNext}
                disabled={isNextDisabled()}
              >
                {step === steps.length ? 'Finish' : 'Next'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VaultWizard; 