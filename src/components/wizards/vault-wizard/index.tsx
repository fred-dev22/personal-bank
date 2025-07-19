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
import { useAuth } from '../../../contexts/AuthContext';
import { useActivity } from '../../../contexts/ActivityContext';
import { createAccount } from '../../../controllers/accountController';
import { createHolding } from '../../../controllers/holdingController';
import { createVault } from '../../../controllers/vaultController';
import type { AccountType } from '../../../types/types';
import { updateBankField } from '../../../controllers/bankController';

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

// Utilitaire pour convertir un champ % en décimal
function parsePercentToDecimal(val?: string | number): number | undefined {
  if (val === undefined || val === null) return undefined;
  const str = String(val).replace('%', '').trim();
  const num = parseFloat(str);
  if (isNaN(num)) return undefined;
  return num / 100;
}

export const VaultWizard: React.FC<{
  onClose: () => void;
  onVaultCreated?: (vault: Vault) => void;
  onGatewayCreated?: () => void;
  vaultToEdit?: Vault;
  vaultType?: 'cash' | 'super';
  gatewayMode?: boolean;
}> = ({ onClose, onVaultCreated, onGatewayCreated, vaultToEdit, vaultType, gatewayMode }) => {
  const [type, setType] = useState<'cash' | 'super' | undefined>(gatewayMode ? 'cash' : vaultType);
  const steps = type === 'super' ? stepsSuperVault : stepsCashVault;
  const [step, setStep] = useState(gatewayMode ? 1 : 0);
  const [vaultData, setVaultData] = useState<Vault>(vaultToEdit || {
    id: '',
    name: gatewayMode ? 'Gateway' : (type === 'super' ? 'Super Vault' : ''),
    issues: 0,
    balance: 10000,
    financials: { paidIn: 0, paidOut: 0 },
    health: { reserves: 0, loanToValue: 0, incomeDSCR: 0, growthDSCR: 0 },
    hold: 0,
    reserve: 0,
    type: gatewayMode ? 'cash' : type,
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

  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();
  const { showActivity, hideActivity } = useActivity();

  // Pour la validation du bouton Next
  const isNextDisabled = () => {
    return false;
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
      return;
    }

    // Ferme le wizard et affiche le snackbar immédiatement
    onClose();
    showActivity(gatewayMode ? 'Creating gateway...' : 'Creating vault...');

    // Création async en tâche de fond
    (async () => {
      const token = localStorage.getItem('authToken');
      if (!user || !token) return;
      try {
        let accountIds: string[] = [];
        if (type === 'cash') {
          const account = await createAccount(token, {
            nickname: vaultData.name ?? '',
            type: (vaultData.accountType as AccountType) ?? 'Checking',
            balance: Number(vaultData.amount),
            pb: user.current_pb,
            annual_interest_rate: parsePercentToDecimal(vaultData.interestRate),
          });
          accountIds = [account.id];
        } else if (type === 'super') {
          const assetAccount = await createAccount(token, {
            nickname: vaultData.assetName ?? '',
            type: (vaultData.assetType as AccountType) ?? 'Checking',
            balance: Number(vaultData.amount),
            pb: user.current_pb,
            annual_interest_rate: parsePercentToDecimal(vaultData.interestRate),
          });
          const debtAccount = await createAccount(token, {
            nickname: 'Debt',
            type: 'Line of Credit',
            balance: Number(vaultData.debtBalance),
            pb: user.current_pb,
          });
          accountIds = [assetAccount.id, debtAccount.id];
        }
        const holding = await createHolding(token, {
          nickname: vaultData.name || 'Default holding name',
          accounts: accountIds,
        });
        // Calcul du available_for_lending_amount
        const availableForLending =
          Number(vaultData.amount ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0);
        // Création du vault
        const vault = await createVault(token, user.current_pb!, {
          ...vaultData,
          holding_id: holding.id,
          type: type === 'super' ? 'super vault' : 'cash vault',
          is_gateway: !!gatewayMode,
          available_for_lending_amount: availableForLending,
        });
        // Mise à jour de l'onboarding_state selon le mode (uniquement pendant l'onboarding)
        if (user?.current_pb && current_pb_onboarding_state && current_pb_onboarding_state !== 'done') {
          try {
            if (gatewayMode) {
              // Si c'est un gateway, passer à l'étape add-vault
              setCurrentPbOnboardingState('add-vault');
              await updateBankField(token, user.current_pb, { onboarding_state: 'add-vault' });
            } else if (current_pb_onboarding_state === 'add-vault') {
              // Si on est à l'étape add-vault et qu'on crée un vault normal, passer à add-loan
              setCurrentPbOnboardingState('add-loan');
              await updateBankField(token, user.current_pb, { onboarding_state: 'add-loan' });
            }
          } catch (error) {
            console.error('Error updating onboarding state:', error);
          }
        }
        // Passage à l'étape suivante APRÈS la fermeture du snackbar
        setTimeout(() => {
          hideActivity();
          if (onVaultCreated) onVaultCreated(vault);
          if (gatewayMode && onGatewayCreated) onGatewayCreated();
        }, 2000);
      } catch (error) {
        console.error('Error creating vault:', error);
        hideActivity();
      }
    })();
  };

  return (
    <div style={{ width: '100%', padding: 32, boxSizing: 'border-box', paddingBottom: 120 }}>
      <HeaderWizard
        title={gatewayMode ? 'Add Gateway' : (vaultToEdit ? 'Edit Vault' : 'Add Vault')}
        onExit={onClose}
        showPreview={gatewayMode ? step > 1 : step > 0}
        onPreview={step > 0 ? () => {
          if (step === 1) {
            if (!gatewayMode) {
              setType(undefined);
              setStep(0);
            }
          } else {
            setStep(Math.max(0, step - 1));
          }
        } : undefined}
      />
      {(!gatewayMode && type === undefined) ? (
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
            step === 1 ? <StepConfig vaultData={vaultData} setVaultData={setVaultData} gatewayMode={gatewayMode} /> :
            step === 2 ? <StepAsset vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 3 ? <StepDebt vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 4 ? <StepReserve vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 5 ? <StepHold vaultData={vaultData} setVaultData={setVaultData} /> :
            step === 6 ? <StepConfirm vaultData={vaultData} /> : null
          ) : (
            step === 1 ? <StepConfig vaultData={vaultData} setVaultData={setVaultData} gatewayMode={gatewayMode} /> :
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