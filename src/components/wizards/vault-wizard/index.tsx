import React, { useState } from 'react';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import { StepType } from './StepType';
import { StepConfig } from './StepConfig';
import { StepReserve } from './StepReserve';
import { StepHold } from './StepHold';
import { StepConfirm } from './StepConfirm';
import { Button } from '@jbaluch/components';
import StepsWizard from '../wizard-components/StepsWizard';
import type { Vault, HoldReserveType, VaultType, CreditLimitType, Account } from '../../../types/types';
import { StepAsset } from './StepAsset';
import { StepDebt } from './StepDebt';
import { useAuth } from '../../../contexts/AuthContext';
import { useActivity } from '../../../contexts/ActivityContext';
import { createAccount, updateAccount } from '../../../controllers/accountController';
import { createHolding } from '../../../controllers/holdingController';
import { createVault, updateVault } from '../../../controllers/vaultController';
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
  // En mode édition, déterminer le type depuis vaultToEdit
  const editingType = vaultToEdit ? (vaultToEdit.type === 'super vault' ? 'super' : 'cash') : undefined;
  const [type, setType] = useState<'cash' | 'super' | undefined>(
    gatewayMode ? 'cash' : 
    vaultToEdit ? editingType :
    vaultType
  );
  const steps = type === 'super' ? stepsSuperVault : stepsCashVault;
  // En mode édition, commencer à l'étape 1 (sauter la sélection de type)
  const [step, setStep] = useState(
    gatewayMode ? 1 : 
    vaultToEdit ? 1 :
    0
  );
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [vaultData, setVaultData] = useState<Vault>(vaultToEdit || {
    // Champs obligatoires pour Vault
    id: 'temp-id',
    issues: 0,
    balance: 0, // Sera supprimé lors de l'envoi
    financials: { paidIn: 0, paidOut: 0 }, // Sera supprimé lors de l'envoi
    health: { reserves: 0, loanToValue: 0, incomeDSCR: 0, growthDSCR: 0 }, // Sera supprimé lors de l'envoi
    // Champs essentiels du vault
    name: gatewayMode ? 'Gateway' : (type === 'super' ? 'Super Vault' : (type === 'cash' ? 'Cash Vault' : '')),
    hold: type === 'cash' ? 500 : (type === 'super' ? 10 : 0),
    hold_type: type === 'cash' ? ('amount' as HoldReserveType) : (type === 'super' ? ('percentage' as HoldReserveType) : undefined),
    reserve: type === 'cash' ? 1000 : (type === 'super' ? 10 : 0),
    reserve_type: type === 'cash' ? ('amount' as HoldReserveType) : (type === 'super' ? ('percentage' as HoldReserveType) : undefined),
    type: gatewayMode ? ('cash vault' as VaultType) : (type === 'cash' ? ('cash vault' as VaultType) : (type === 'super' ? ('super vault' as VaultType) : undefined)),
    // Champs temporaires pour le wizard (ne seront pas envoyés au backend)
    amount: type === 'cash' ? 0 : undefined,
    interestRate: type === 'cash' ? '5.00%' : undefined,
    accountType: type === 'cash' ? 'Savings' : undefined,
    // Champs Super Vault temporaires
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
  } as Vault);

  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();
  const { showActivity, hideActivity } = useActivity();

  // Peupler les données depuis accounts_json en mode édition
  React.useEffect(() => {
    if (vaultToEdit && vaultToEdit.accounts_json && vaultToEdit.accounts_json.length > 0) {
      const accounts = vaultToEdit.accounts_json;
      
      if (type === 'cash') {
        // Pour Cash Vault, récupérer les données du premier account (cash account)
        const cashAccount = accounts[0];
        if (cashAccount) {
          setVaultData(prev => ({
            ...prev,
            amount: cashAccount.balance || 0,
            interestRate: cashAccount.annual_interest_rate ? `${(cashAccount.annual_interest_rate * 100).toFixed(2)}%` : '5.00%',
            accountType: cashAccount.type || 'Savings',
          }));
        }
      } else if (type === 'super') {
        // Pour Super Vault, récupérer les données des accounts asset et debt
        const assetAccount = accounts.find(acc => acc.nickname === 'Asset super vault');
        const debtAccount = accounts.find(acc => acc.nickname === 'Debt');
        
        if (assetAccount) {
          // Extraire les données du tag JSON si elles existent
          let assetTagData: { [key: string]: string } = {};
          try {
            if (assetAccount.tag) {
              assetTagData = JSON.parse(assetAccount.tag);
            }
          } catch {
            console.warn('Could not parse asset account tag:', assetAccount.tag);
          }
          
          setVaultData(prev => ({
            ...prev,
            amount: assetAccount.balance || 30000,
            assetType: assetTagData.assetType || assetAccount.type || 'Indexed Universal Life',
            assetName: assetTagData.assetName || '',
            assetStartDate: assetAccount.policy_start_date || '2025-01-01',
            annualNonMecLimit: String(assetAccount.annual_non_mec_limit || 39000),
            annualGuidelineAmount: String(assetAccount.annual_guideline_amount || 15000),
            annualGrowthRate: assetTagData.annualGrowthRate || String((assetAccount.annual_interest_rate || 0.07) * 100),
            premiumPaidThisYear: assetTagData.premiumPaidThisYear || String(assetAccount.purchase_price || 30000),
            expenseRate: assetTagData.expenseRate || '12.00',
          }));
        }
        
        if (debtAccount) {
          // Extraire les données du tag JSON si elles existent
          let debtTagData: { [key: string]: string } = {};
          try {
            if (debtAccount.tag) {
              debtTagData = JSON.parse(debtAccount.tag);
            }
          } catch {
            console.warn('Could not parse debt account tag:', debtAccount.tag);
          }
          
          setVaultData(prev => ({
            ...prev,
            debtBalance: String(debtAccount.balance || 0),
            debtCeilingRate: debtTagData.debtCeilingRate || String((debtAccount.annual_interest_rate || 0.05) * 100),
            debtLtv: String(debtAccount.credit_limit || 90),
            creditLimitType: (debtAccount.credit_limit_type as CreditLimitType) || 'percentage',
          }));
        }
      }
    }
  }, [vaultToEdit, type]);

  // Mettre à jour les valeurs par défaut quand le type change (seulement si les valeurs n'existent pas)
  React.useEffect(() => {
    if (type === 'cash' && !gatewayMode) {
      setVaultData(prev => ({
        ...prev,
        name: prev.name !== undefined && prev.name !== '' ? prev.name : 'Cash Vault',
        nickname: prev.nickname !== undefined && prev.nickname !== '' ? prev.nickname : 'Cash Vault',
        amount: prev.amount !== undefined && prev.amount !== 0 ? prev.amount : 0,
        interestRate: prev.interestRate !== undefined && prev.interestRate !== '' ? prev.interestRate : '5.00%',
        accountType: prev.accountType !== undefined && prev.accountType !== '' ? prev.accountType : 'Savings',
        reserve: prev.reserve !== undefined && prev.reserve !== 0 ? prev.reserve : 1000,
        reserve_type: prev.reserve_type || ('amount' as HoldReserveType),
        hold: prev.hold !== undefined && prev.hold !== 0 ? prev.hold : 500,
        hold_type: prev.hold_type || ('amount' as HoldReserveType),
      }));
    } else if (type === 'super' && !gatewayMode) {
      setVaultData(prev => ({
        ...prev,
        name: prev.name !== undefined && prev.name !== '' ? prev.name : 'Super Vault',
        nickname: prev.nickname !== undefined && prev.nickname !== '' ? prev.nickname : 'Super Vault',
        amount: prev.amount !== undefined && prev.amount !== 0 ? prev.amount : 30000,
        assetType: prev.assetType !== undefined && prev.assetType !== '' ? prev.assetType : 'Indexed Universal Life',
        assetStartDate: prev.assetStartDate !== undefined && prev.assetStartDate !== '' ? prev.assetStartDate : '2025-01-01',
        annualNonMecLimit: prev.annualNonMecLimit !== undefined && prev.annualNonMecLimit !== '' ? prev.annualNonMecLimit : '39000.00',
        annualGuidelineAmount: prev.annualGuidelineAmount !== undefined && prev.annualGuidelineAmount !== '' ? prev.annualGuidelineAmount : '15000.00',
        annualGrowthRate: prev.annualGrowthRate !== undefined && prev.annualGrowthRate !== '' ? prev.annualGrowthRate : '7.00',
        premiumPaidThisYear: prev.premiumPaidThisYear !== undefined && prev.premiumPaidThisYear !== '' ? prev.premiumPaidThisYear : '30000.00',
        debtBalance: prev.debtBalance !== undefined && prev.debtBalance !== '' ? prev.debtBalance : '0.00',
        debtCeilingRate: prev.debtCeilingRate !== undefined && prev.debtCeilingRate !== '' ? prev.debtCeilingRate : '5.00',
        debtLtv: prev.debtLtv !== undefined && prev.debtLtv !== '' ? prev.debtLtv : '90.00',
        creditLimitType: prev.creditLimitType || ('percentage' as CreditLimitType),
        reserve: prev.reserve !== undefined && prev.reserve !== 0 ? prev.reserve : 10,
        reserve_type: prev.reserve_type || ('percentage' as HoldReserveType),
        hold: prev.hold !== undefined && prev.hold !== 0 ? prev.hold : 10,
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
    showActivity(vaultToEdit ? 'Updating vault...' : (gatewayMode ? 'Creating gateway...' : 'Creating vault...'));

    // Création/Édition async en tâche de fond
    (async () => {
      const token = localStorage.getItem('authToken');
      if (!user || !token) return;
      try {
        // Mode édition - mettre à jour le vault et ses accounts existants
        if (vaultToEdit) {
          console.log('Updating vault with data:', vaultData);
          
          // Calculer available_for_lending_amount
          let availableForLending = 0;
          
          if (type === 'super') {
            const assetValue = Number(vaultData.amount) || 0;
            const creditLimitValue = Number(vaultData.debtLtv) || 0;
            const creditLimitType = vaultData.creditLimitType || 'percentage';
            
            let creditLimit = 0;
            if (creditLimitType === 'percentage') {
              creditLimit = (creditLimitValue / 100) * assetValue;
            } else {
              creditLimit = creditLimitValue;
            }
            
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
            availableForLending = Number(vaultData.amount ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0);
          }
          
          // Mettre à jour le vault - payload nettoyé
          const vaultUpdateData = {
            nickname: vaultData.name || vaultToEdit.nickname,
            hold: vaultData.hold,
            hold_type: vaultData.hold_type,
            reserve: vaultData.reserve,
            reserve_type: vaultData.reserve_type,
            type: vaultData.type || vaultToEdit.type,
            available_for_lending_amount: availableForLending,
            modified_date: new Date().toISOString(),
          };
          
          const updatedVault = await updateVault(token, user.current_pb!, vaultToEdit.id, vaultUpdateData);
          console.log('Vault updated:', updatedVault);
          
          // Préparer les accounts_json mis à jour
          let updatedAccountsJson = vaultToEdit.accounts_json || [];
          
          // Mettre à jour les accounts si ils existent dans accounts_json
          if (vaultToEdit.accounts_json && vaultToEdit.accounts_json.length > 0) {
            for (const account of vaultToEdit.accounts_json) {
              let accountUpdateData: Partial<Account> = { ...account };
              
              if (type === 'cash') {
                // Pour Cash Vault, mettre à jour l'account avec les nouvelles valeurs
                accountUpdateData = {
                  ...account,
                  nickname: vaultData.name ?? account.nickname,
                  balance: Number(vaultData.amount) || account.balance,
                  annual_interest_rate: parsePercentToDecimal(vaultData.interestRate) || account.annual_interest_rate,
                  modified_date: new Date().toISOString(),
                };
                
                // Mettre à jour accounts_json localement
                updatedAccountsJson = updatedAccountsJson.map(acc => 
                  acc.id === account.id ? { ...acc, ...accountUpdateData } : acc
                );
              } else if (type === 'super') {
                // Pour Super Vault, mettre à jour selon le type d'account
                if (account.nickname === 'Asset super vault') {
                  accountUpdateData = {
                    ...account,
                    balance: Number(vaultData.amount) || account.balance,
                    annual_interest_rate: parsePercentToDecimal(vaultData.annualGrowthRate) || account.annual_interest_rate,
                    appreciation: parsePercentToDecimal(vaultData.annualGrowthRate) || account.appreciation,
                    annual_guideline_amount: Number(vaultData.annualGuidelineAmount) || account.annual_guideline_amount,
                    annual_non_mec_limit: Number(vaultData.annualNonMecLimit) || account.annual_non_mec_limit,
                    policy_start_date: vaultData.assetStartDate || account.policy_start_date,
                    purchase_price: Number(vaultData.premiumPaidThisYear) || account.purchase_price,
                    tag: JSON.stringify({
                      assetType: vaultData.assetType || 'Indexed Universal Life',
                      assetName: vaultData.assetName || '',
                      expenseRate: vaultData.expenseRate || '12.00',
                      premiumPaidThisYear: vaultData.premiumPaidThisYear || '30000.00',
                      annualGrowthRate: vaultData.annualGrowthRate || '7.00'
                    }),
                    modified_date: new Date().toISOString(),
                  };
                } else if (account.nickname === 'Debt') {
                  accountUpdateData = {
                    ...account,
                    balance: Number(vaultData.debtBalance) || account.balance,
                    credit_limit: Number(vaultData.debtLtv) || account.credit_limit,
                    credit_limit_type: vaultData.creditLimitType || account.credit_limit_type,
                    annual_interest_rate: parsePercentToDecimal(vaultData.debtCeilingRate) || account.annual_interest_rate,
                    tag: JSON.stringify({
                      debtBalance: vaultData.debtBalance || '0.00',
                      debtCeilingRate: vaultData.debtCeilingRate || '5.00',
                      debtLtv: vaultData.debtLtv || '90.00',
                      creditLimitType: vaultData.creditLimitType || 'percentage'
                    }),
                    modified_date: new Date().toISOString(),
                  };
                }
                
                // Mettre à jour accounts_json localement
                updatedAccountsJson = updatedAccountsJson.map(acc => 
                  acc.id === account.id ? { ...acc, ...accountUpdateData } : acc
                );
              }
              
              console.log('Updating account:', account.id, 'with data:', accountUpdateData);
              await updateAccount(token, account.id, accountUpdateData);
            }
          }
          
          // Construire le vault complet avec toutes les données mises à jour
          const completeUpdatedVault: Vault = {
            ...vaultToEdit, // Données originales
            ...vaultUpdateData, // Données mises à jour du vault
            accounts_json: updatedAccountsJson, // accounts_json mis à jour
            id: vaultToEdit.id, // Garder l'ID original
          };
          
          // Terminer avec succès
          setTimeout(() => {
            hideActivity();
          }, 2000);
          
          if (onVaultCreated) {
            onVaultCreated(completeUpdatedVault);
          }
          
          return; // Sortir de la fonction, ne pas exécuter la logique de création
        }
        
        // Mode création - logique existante
        console.log('Creating vault with data:', vaultData);
        let accountIds: string[] = [];
        let accountJsonData: Account[] = [];
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
          // Préparer les données JSON pour Cash Vault
          accountJsonData = [{
            id: account.id,
            nickname: accountData.nickname,
            type: accountData.type,
            balance: accountData.balance,
            annual_interest_rate: accountData.annual_interest_rate,
            pb: accountData.pb || user.current_pb || ''
          }];
        } else if (type === 'super') {
          const assetAccount = await createAccount(token, {
            nickname: 'Asset super vault',
            type: (vaultData.assetType as AccountType) ?? 'Indexed Universal Life',
            balance: Number(vaultData.amount) || 30000,
            pb: user.current_pb,
            // Tous les champs Asset transférés vers l'account
            annual_interest_rate: parsePercentToDecimal(vaultData.annualGrowthRate),
            appreciation: parsePercentToDecimal(vaultData.annualGrowthRate),
            annual_guideline_amount: Number(vaultData.annualGuidelineAmount) || 15000,
            annual_non_mec_limit: Number(vaultData.annualNonMecLimit) || 39000,
            policy_start_date: vaultData.assetStartDate || '2025-01-01',
            purchase_price: Number(vaultData.premiumPaidThisYear) || 30000,
            // Ajout des champs personnalisés pour les données Asset
            tag: JSON.stringify({
              assetType: vaultData.assetType || 'Indexed Universal Life',
              assetName: vaultData.assetName || '',
              expenseRate: vaultData.expenseRate || '12.00',
              premiumPaidThisYear: vaultData.premiumPaidThisYear || '30000.00',
              annualGrowthRate: vaultData.annualGrowthRate || '7.00'
            }),
            created_date: new Date().toISOString(),
            modified_date: new Date().toISOString(),
          });
          const debtAccount = await createAccount(token, {
            nickname: 'Debt',
            type: 'Line of Credit',
            balance: Number(vaultData.debtBalance) || 0,
            pb: user.current_pb,
            // Ajout du credit limit et de son type - on stocke directement la valeur tapée
            credit_limit: Number(vaultData.debtLtv) || 90,
            credit_limit_type: vaultData.creditLimitType || 'percentage',
            // Ajout d'autres champs debt spécifiques
            annual_interest_rate: parsePercentToDecimal(vaultData.debtCeilingRate) || 0.05,
            tag: JSON.stringify({
              debtBalance: vaultData.debtBalance || '0.00',
              debtCeilingRate: vaultData.debtCeilingRate || '5.00',
              debtLtv: vaultData.debtLtv || '90.00',
              creditLimitType: vaultData.creditLimitType || 'percentage'
            }),
            created_date: new Date().toISOString(),
            modified_date: new Date().toISOString(),
          });
          accountIds = [assetAccount.id, debtAccount.id];
          // Préparer les données JSON pour Super Vault
          accountJsonData = [
            {
              id: assetAccount.id,
              nickname: 'Asset super vault',
              type: (vaultData.assetType as AccountType) || 'Indexed Universal Life',
              balance: Number(vaultData.amount) || 30000,
              annual_interest_rate: parsePercentToDecimal(vaultData.annualGrowthRate),
              appreciation: parsePercentToDecimal(vaultData.annualGrowthRate),
              annual_guideline_amount: Number(vaultData.annualGuidelineAmount) || 15000,
              annual_non_mec_limit: Number(vaultData.annualNonMecLimit) || 39000,
              policy_start_date: vaultData.assetStartDate || '2025-01-01',
              purchase_price: Number(vaultData.premiumPaidThisYear) || 30000,
              pb: user.current_pb || '',
              // Données supplémentaires dans tag
              tag: JSON.stringify({
                assetName: vaultData.assetName || '',
                expenseRate: vaultData.expenseRate || '12.00',
                premiumPaidThisYear: vaultData.premiumPaidThisYear || '30000.00',
                annualGrowthRate: vaultData.annualGrowthRate || '7.00'
              })
            },
            {
              id: debtAccount.id,
              nickname: 'Debt',
              type: 'Line of Credit',
              balance: Number(vaultData.debtBalance) || 0,
              credit_limit: Number(vaultData.debtLtv) || 90,
              credit_limit_type: vaultData.creditLimitType || 'percentage',
              annual_interest_rate: parsePercentToDecimal(vaultData.debtCeilingRate) || 0.05,
              pb: user.current_pb || '',
              // Données supplémentaires dans tag
              tag: JSON.stringify({
                debtBalance: vaultData.debtBalance || '0.00',
                debtCeilingRate: vaultData.debtCeilingRate || '5.00',
                debtLtv: vaultData.debtLtv || '90.00',
                creditLimitType: vaultData.creditLimitType || 'percentage'
              })
            }
          ];
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
        // Création du vault - payload nettoyé
        const vaultCreateData = {
          nickname: vaultData.name, // Seulement nickname, pas name
          hold: vaultData.hold,
          hold_type: vaultData.hold_type,
          reserve: vaultData.reserve,
          reserve_type: vaultData.reserve_type,
          is_gateway: !!gatewayMode,
          holding_id: holding.id, // Seulement holding_id, pas holdingId
          type: type === 'super' ? ('super vault' as VaultType) : ('cash vault' as VaultType),
          available_for_lending_amount: availableForLending,
          accounts_json: accountJsonData,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString(),
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
        showPrevious={true}
        onPrevious={() => {
          if (step === 0) {
            // On first step, go back to close the wizard
            onClose();
          } else if (step === 1) {
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
        }}
        showPreview={false}
        onPreview={undefined}
      />
      {(!gatewayMode && type === undefined) ? (
        <StepType
          selectedType={type || ''}
          onSelect={t => {
            setType(t as 'cash' | 'super');
                         setVaultData(prev => ({ ...prev, type: t === 'cash' ? ('cash vault' as VaultType) : ('super vault' as VaultType) }));
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