import React, { useState } from 'react';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import { StepType } from './StepType';
import { StepConfig } from './StepConfig';
import { StepReserve } from './StepReserve';
import { StepHold } from './StepHold';
import { StepConfirm } from './StepConfirm';
import { Button } from '@jbaluch/components';
import StepsWizard from '../wizard-components/StepsWizard';
import type { Vault, HoldReserveType, VaultType, CreditLimitType } from '../../../types/types';
import { StepAsset } from './StepAsset';
import { StepDebt } from './StepDebt';
import { useAuth } from '../../../contexts/AuthContext';
import { useActivity } from '../../../contexts/ActivityContext';
import { createAccount } from '../../../controllers/accountController';
import { createHolding } from '../../../controllers/holdingController';
import { createVault } from '../../../controllers/vaultController';
import type { AccountType } from '../../../types/types';
import { updateBankField } from '../../../controllers/bankController';
import './index.css';

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
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [vaultData, setVaultData] = useState<Vault>(vaultToEdit || {
    id: '',
    name: gatewayMode ? 'Gateway' : (type === 'super' ? 'Super Vault' : (type === 'cash' ? 'Cash Vault' : '')),
    nickname: gatewayMode ? 'Gateway' : (type === 'super' ? 'Super Vault' : (type === 'cash' ? 'Cash Vault' : '')),
    issues: 0,
    balance: 10000,
    financials: { paidIn: 0, paidOut: 0 },
    health: { reserves: 0, loanToValue: 0, incomeDSCR: 0, growthDSCR: 0 },
    hold: type === 'cash' ? 500 : (type === 'super' ? 10 : 0),
    hold_type: type === 'cash' ? ('amount' as HoldReserveType) : (type === 'super' ? ('percentage' as HoldReserveType) : undefined),
    reserve: type === 'cash' ? 1000 : (type === 'super' ? 10 : 0),
    reserve_type: type === 'cash' ? ('amount' as HoldReserveType) : (type === 'super' ? ('percentage' as HoldReserveType) : undefined),
    type: gatewayMode ? ('cash vault' as VaultType) : (type === 'cash' ? ('cash vault' as VaultType) : (type === 'super' ? ('super vault' as VaultType) : undefined)),
    // Champs requis pour Cash Vault (même pour Gateway)
    amount: type === 'cash' ? 0 : undefined,
    interestRate: type === 'cash' ? '5.00%' : undefined,
    accountType: type === 'cash' ? 'Savings' : undefined,
    // Champs Super Vault
    assetType: type === 'super' ? 'Indexed Universal Life' : '',
    assetName: '',
    assetStartDate: type === 'super' ? '2025-01-01' : '',
    annualNonMecLimit: type === 'super' ? '39000.00' : '',
    annualGuidelineAmount: type === 'super' ? '15000.00' : '',
    annualGrowthRate: type === 'super' ? '7.00' : '',
    premiumPaidThisYear: type === 'super' ? '30000.00' : '',
    debtBalance: type === 'super' ? '0.00' : '',
    debtCeilingRate: type === 'super' ? '5.00' : '',
    debtLtv: type === 'super' ? '90.00' : '',
    creditLimitType: type === 'super' ? ('percentage' as CreditLimitType) : undefined,
  });

  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();
  const { showActivity, hideActivity } = useActivity();

  // Mettre à jour les valeurs par défaut quand le type change
  React.useEffect(() => {
    if (type === 'cash' && !gatewayMode) {
      setVaultData(prev => ({
        ...prev,
        name: prev.name || 'Cash Vault',
        nickname: prev.nickname || 'Cash Vault',
        amount: prev.amount || 0,
        interestRate: prev.interestRate || '5.00%',
        accountType: prev.accountType || 'Savings',
        reserve: prev.reserve || 1000,
        reserve_type: prev.reserve_type || ('amount' as HoldReserveType),
        hold: prev.hold || 500,
        hold_type: prev.hold_type || ('amount' as HoldReserveType),
      }));
    } else if (type === 'super' && !gatewayMode) {
      setVaultData(prev => ({
        ...prev,
        name: prev.name || 'Super Vault',
        nickname: prev.nickname || 'Super Vault',
        amount: prev.amount || 30000,
        assetType: prev.assetType || 'Indexed Universal Life',
        assetStartDate: prev.assetStartDate || '2025-01-01',
        annualNonMecLimit: prev.annualNonMecLimit || '39000.00',
        annualGuidelineAmount: prev.annualGuidelineAmount || '15000.00',
        annualGrowthRate: prev.annualGrowthRate || '7.00',
        premiumPaidThisYear: prev.premiumPaidThisYear || '30000.00',
        debtBalance: prev.debtBalance || '0.00',
        debtCeilingRate: prev.debtCeilingRate || '5.00',
        debtLtv: prev.debtLtv || '90.00',
        creditLimitType: prev.creditLimitType || ('percentage' as CreditLimitType),
        reserve: prev.reserve || 10,
        reserve_type: prev.reserve_type || ('percentage' as HoldReserveType),
        hold: prev.hold || 10,
        hold_type: prev.hold_type || ('percentage' as HoldReserveType),
      }));
    }
  }, [type, gatewayMode]);

  // Fonction de validation pour chaque étape
  const validateStep = (stepIndex: number): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};
    
    if (type === 'cash') {
      switch (stepIndex) {
        case 1: // Config
          if (!vaultData.name?.trim()) {
            errors.name = 'Vault Name is required';
          }
          if (!vaultData.amount || Number(vaultData.amount) <= 0) {
            errors.amount = 'Amount is required and must be greater than 0';
          }
          if (!vaultData.interestRate?.trim()) {
            errors.interestRate = 'Interest Rate is required';
          }
          break;
        case 2: // Reserve
          if (!vaultData.reserve || Number(vaultData.reserve) <= 0) {
            errors.reserve = 'Reserve amount is required and must be greater than 0';
          } else if (Number(vaultData.reserve) > Number(vaultData.amount)) {
            errors.reserve = 'Reserve amount cannot exceed the account balance';
          }
          break;
        case 3: // Hold
          if (!vaultData.hold || Number(vaultData.hold) <= 0) {
            errors.hold = 'Hold amount is required and must be greater than 0';
          } else if ((Number(vaultData.reserve) + Number(vaultData.hold)) > Number(vaultData.amount)) {
            errors.hold = 'Reserve + Hold cannot exceed the account balance';
          }
          break;
      }
    } else if (type === 'super') {
      switch (stepIndex) {
        case 1: // Config - Pour Super Vault, seul le nom est requis à l'étape 1
          if (!vaultData.name?.trim()) {
            errors.name = 'Vault Name is required';
          }
          // Amount et Interest Rate ne sont pas requis à l'étape 1 pour Super Vault
          break;
        case 2: // Asset
          if (!vaultData.assetType?.trim()) {
            errors.assetType = 'Asset type is required';
          }
          if (!vaultData.amount || Number(vaultData.amount) <= 0) {
            errors.amount = 'Accumulated value is required and must be greater than 0';
          }
          break;
                  case 3: // Debt
            if (vaultData.debtBalance === undefined || vaultData.debtBalance === null || vaultData.debtBalance === '') {
              errors.debtBalance = 'Debt balance is required';
            } else if (Number(vaultData.debtBalance) < 0) {
              errors.debtBalance = 'Debt balance must be 0 or greater';
            }
            if (!vaultData.debtCeilingRate?.trim()) {
              errors.debtCeilingRate = 'Debt ceiling rate is required';
            }
            if (!vaultData.debtLtv?.trim()) {
              errors.debtLtv = 'Debt LTV is required';
            }
            break;
                  case 4: // Reserve
            if (!vaultData.reserve || Number(vaultData.reserve) <= 0) {
              errors.reserve = 'Reserve amount is required and must be greater than 0';
            } else if (Number(vaultData.reserve) > Number(vaultData.amount)) {
              errors.reserve = 'Reserve amount cannot exceed the account balance';
            }
            break;
          case 5: // Hold
            if (!vaultData.hold || Number(vaultData.hold) <= 0) {
              errors.hold = 'Hold amount is required and must be greater than 0';
            } else if ((Number(vaultData.reserve) + Number(vaultData.hold)) > Number(vaultData.amount)) {
              errors.hold = 'Reserve + Hold cannot exceed the account balance';
            }
            break;
      }
    }
    
    return errors;
  };

  // Pour la validation du bouton Next
  const isNextDisabled = () => {
    return false; // On ne désactive plus le bouton, on affiche les erreurs à la place
  };

  const handleNext = () => {
    const errors = validateStep(step);
    setValidationErrors(errors);
    
    // Si il y a des erreurs, on ne passe pas à l'étape suivante
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Nettoyer les erreurs si tout est valide
    setValidationErrors({});
    
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
        console.log('Creating vault with data:', vaultData);
        let accountIds: string[] = [];
        if (type === 'cash') {
          const accountData = {
            nickname: vaultData.name ?? '',
            type: (vaultData.accountType as AccountType) ?? 'Checking',
            balance: Number(vaultData.amount),
            pb: user.current_pb,
            annual_interest_rate: parsePercentToDecimal(vaultData.interestRate),
          };
          console.log('Creating account with data:', accountData);
          const account = await createAccount(token, accountData);
          console.log('Account created:', account);
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
        const holdingData = {
          nickname: vaultData.name || 'Default holding name',
          accounts: accountIds,
        };
        console.log('Creating holding with data:', holdingData);
        const holding = await createHolding(token, holdingData);
        console.log('Holding created:', holding);
        // Calcul du available_for_lending_amount
        let availableForLending = 0;
        
        if (type === 'super') {
          // Pour Super Vault : calcul basé sur le credit limit
          const assetValue = Number(vaultData.amount) || 0;
          const creditLimitValue = Number(vaultData.debtLtv) || 0;
          const creditLimitType = vaultData.creditLimitType || 'percentage';
          
          let creditLimit = 0;
          if (creditLimitType === 'percentage') {
            creditLimit = (creditLimitValue / 100) * assetValue;
          } else {
            creditLimit = creditLimitValue;
          }
          
          // Calcul des valeurs de reserve et hold
          const reserveType = vaultData.reserve_type || 'amount';
          const holdType = vaultData.hold_type || 'amount';
          
          let reserveValue = Number(vaultData.reserve) || 0;
          let holdValue = Number(vaultData.hold) || 0;
          
          if (reserveType === 'percentage') {
            reserveValue = (reserveValue / 100) * creditLimit;
          }
          if (holdType === 'percentage') {
            holdValue = (holdValue / 100) * creditLimit;
          }
          
          const debtBalance = Number(vaultData.debtBalance) || 0;
          availableForLending = Math.max(0, creditLimit - reserveValue - holdValue - debtBalance);
        } else {
          // Pour Cash Vault : calcul basé sur le montant
          availableForLending = Number(vaultData.amount ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0);
        }
        // Création du vault
        const vaultCreateData = {
          ...vaultData,
          nickname: vaultData.name, // S'assurer que le nickname est bien défini
          holding_id: holding.id,
                     type: type === 'super' ? ('super vault' as VaultType) : ('cash vault' as VaultType),
          is_gateway: !!gatewayMode,
          available_for_lending_amount: availableForLending,
        };
        console.log('Creating vault with data:', vaultCreateData);
        const vault = await createVault(token, user.current_pb!, vaultCreateData);
        console.log('Vault created:', vault);
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

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
      setValidationErrors({}); // Nettoyer les erreurs quand on revient en arrière
    }
  };

  return (
    <div className="vault-wizard">
      <HeaderWizard
        title={gatewayMode ? 'Add Gateway' : (vaultToEdit ? 'Edit Vault' : 'Add Vault')}
        onExit={onClose}
        showPreview={gatewayMode ? step > 1 : step > 0}
        onPreview={step > 0 ? () => {
          if (step === 1) {
            if (!gatewayMode) {
              setType(undefined);
              setStep(0);
              setValidationErrors({});
            } else {
              handlePrevious();
            }
          } else {
            handlePrevious();
          }
        } : undefined}
      />
      {(!gatewayMode && type === undefined) ? (
        <StepType
          selectedType={type || ''}
          onSelect={t => {
            setType(t as 'cash' | 'super');
                         setVaultData({ ...vaultData, type: t === 'cash' ? ('cash vault' as VaultType) : ('super vault' as VaultType) });
          }}
          onTypeSelected={() => setStep(1)}
        />
      ) : (
        <>
          <div style={{ marginBottom: 32 }}>
            <StepsWizard steps={steps} currentStep={step - 1} />
          </div>
          {type === 'super' ? (
            step === 1 ? <StepConfig vaultData={vaultData} setVaultData={setVaultData} gatewayMode={gatewayMode} vaultType={type} validationErrors={validationErrors} /> :
            step === 2 ? <StepAsset vaultData={vaultData} setVaultData={setVaultData} validationErrors={validationErrors} /> :
            step === 3 ? <StepDebt vaultData={vaultData} setVaultData={setVaultData} validationErrors={validationErrors} /> :
            step === 4 ? <StepReserve vaultData={vaultData} setVaultData={setVaultData} validationErrors={validationErrors} /> :
            step === 5 ? <StepHold vaultData={vaultData} setVaultData={setVaultData} validationErrors={validationErrors} /> :
            step === 6 ? <StepConfirm vaultData={vaultData} /> : null
          ) : (
            step === 1 ? <StepConfig vaultData={vaultData} setVaultData={setVaultData} gatewayMode={gatewayMode} vaultType={type} validationErrors={validationErrors} /> :
            step === 2 ? <StepReserve vaultData={vaultData} setVaultData={setVaultData} validationErrors={validationErrors} /> :
            step === 3 ? <StepHold vaultData={vaultData} setVaultData={setVaultData} validationErrors={validationErrors} /> :
            step === 4 ? <StepConfirm vaultData={vaultData} /> : null
          )}
          {step > 0 && (
            <div className="vault-wizard-footer">
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