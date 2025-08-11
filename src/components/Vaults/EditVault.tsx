import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, CloseButton } from '@jbaluch/components';
import type { Vault } from '../../types/types';
import { Modal } from '../Modal/Modal';
import './EditVault.css';
import { useActivity } from '../../contexts/ActivityContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateVault } from '../../controllers/vaultController';
import { updateAccount } from '../../controllers/accountController';

interface EditVaultProps {
  open: boolean;
  onClose: () => void;
  vault: Vault;
  onSave?: (data: Partial<Vault>) => void;
  onSetupVault?: (vault: Vault) => void;
}

export const EditVault: React.FC<EditVaultProps> = ({ open, onClose, vault, onSave, onSetupVault }) => {
  const { showActivity, hideActivity } = useActivity();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [reserveType, setReserveType] = useState<'amount' | 'percentage'>('percentage');
  const [holdType, setHoldType] = useState<'amount' | 'percentage'>('percentage');
  const [reserveValue, setReserveValue] = useState<number | string>('');
  const [holdValue, setHoldValue] = useState<number | string>('');
  const [savingsRate, setSavingsRate] = useState<number | string>('5.0');
  const [incomeDSCR, setIncomeDSCR] = useState<number | string>('0.00');
  const [growthDSCR, setGrowthDSCR] = useState<number | string>('0.00');

  useEffect(() => {
    if (vault) {
      const isCashVault = vault.type === 'cash vault';
      const isGateway = vault.is_gateway;
      
      // For Cash Vault and Gateway, force amount type ($)
      const initialReserveType = (isCashVault || isGateway) ? 'amount' : (vault.reserve_type || 'percentage');
      const initialHoldType = (isCashVault || isGateway) ? 'amount' : (vault.hold_type || 'percentage');
      
      // Pour Gateway, le nom n'est pas modifiable, pour les autres on utilise le nom du vault
      const vaultName = isGateway ? 'Gateway' : (vault.nickname || vault.name || '');
      console.log('EditVault - Setting name:', vaultName, 'from vault:', { nickname: vault.nickname, name: vault.name });
      setName(vaultName);
      setReserveType(initialReserveType);
      setHoldType(initialHoldType);
      setReserveValue(vault.reserve ?? 0);
      setHoldValue(vault.hold ?? 0);
      
      // Pour Cash Vault et Gateway, récupérer le Savings Rate depuis accounts_json
      let initialSavingsRate = '5.0';
      if ((isCashVault || isGateway) && vault.accounts_json) {
        // Pour Cash Vault/Gateway, il n'y a qu'un seul account
        const cashAccount = vault.accounts_json[0];
        if (cashAccount && cashAccount.annual_interest_rate) {
          // Convertir de décimal vers pourcentage (ex: 0.05 -> 5.0)
          initialSavingsRate = (cashAccount.annual_interest_rate * 100).toFixed(1);
        }
      }
      setSavingsRate(initialSavingsRate);
      
      // Pour Super Vault, initialiser les DSCR
      if (vault.type === 'super vault') {
        setIncomeDSCR(vault.health?.incomeDSCR?.toFixed(2) || '0.00');
        setGrowthDSCR(vault.health?.growthDSCR?.toFixed(2) || '0.00');
      }
    }
  }, [vault, open]);

  // Fonction pour calculer le credit limit pour Super Vault
  const calculateCreditLimit = useCallback(() => {
    if (vault.type !== 'super vault' || !vault.accounts_json) return 0;
    
    // Récupérer les données de l'asset account
    const assetAccount = vault.accounts_json.find(acc => acc.type !== 'Line of Credit');
    if (!assetAccount) return 0;
    
    const assetValue = assetAccount.balance || 0;
    
    // Récupérer les données de debt depuis le debt account
    const debtAccount = vault.accounts_json.find(acc => acc.type === 'Line of Credit');
    if (!debtAccount) return 0;
    
    const creditLimitValue = debtAccount.credit_limit || 0;
    const creditLimitType = debtAccount.credit_limit_type || 'percentage';
    
    if (creditLimitType === 'percentage') {
      return (creditLimitValue / 100) * assetValue;
    } else {
      return creditLimitValue;
    }
  }, [vault]);

  // Fonction pour calculer les valeurs de reserve et hold
  const calculateReserveHoldValues = useCallback(() => {
    const creditLimit = calculateCreditLimit();
    
    let calculatedReserveValue = Number(reserveValue) || 0;
    let calculatedHoldValue = Number(holdValue) || 0;
    
    if (vault.type === 'super vault') {
      if (reserveType === 'percentage') {
        calculatedReserveValue = (calculatedReserveValue / 100) * creditLimit;
      }
      if (holdType === 'percentage') {
        calculatedHoldValue = (calculatedHoldValue / 100) * creditLimit;
      }
    }
    
    return { calculatedReserveValue, calculatedHoldValue };
  }, [calculateCreditLimit, reserveValue, holdValue, reserveType, holdType, vault.type]);

  // Fonction pour calculer available to lending
  const calculateAvailableToLending = useCallback(() => {
    if (vault.type === 'super vault') {
      const creditLimit = calculateCreditLimit();
      const { calculatedReserveValue, calculatedHoldValue } = calculateReserveHoldValues();
      
      // Récupérer le debt balance
      const debtAccount = vault.accounts_json?.find(acc => acc.type === 'Line of Credit');
      const debtBalance = debtAccount?.balance || 0;
      
      return Math.max(0, creditLimit - calculatedReserveValue - calculatedHoldValue - Math.max(0, debtBalance));
    } else {
      // Pour Cash Vault/Gateway : utiliser le balance de l'account associé
      const cashAccount = vault.accounts_json?.find(acc => 
        acc.type === 'Savings' || acc.type === 'Cash' || vault.accounts_json!.length === 1
      ) || vault.accounts_json?.[0];
      
      const totalAmount = cashAccount?.balance || Number(vault.balance) || 0;
      console.log('Cash Vault Available Calculation:', {
        cashAccountBalance: cashAccount?.balance,
        vaultBalance: vault.balance,
        totalAmount,
        reserveValue: Number(reserveValue),
        holdValue: Number(holdValue),
        available: totalAmount - Number(reserveValue) - Number(holdValue)
      });
      
      return Math.max(0, totalAmount - Number(reserveValue) - Number(holdValue));
    }
  }, [vault.type, vault.accounts_json, vault.balance, calculateCreditLimit, calculateReserveHoldValues, reserveValue, holdValue]);

  // Debug pour afficher les calculs en temps réel
  useEffect(() => {
    if (vault.type === 'super vault') {
      const creditLimit = calculateCreditLimit();
      const { calculatedReserveValue, calculatedHoldValue } = calculateReserveHoldValues();
      const availableToLending = calculateAvailableToLending();
      
      console.log('Super Vault Calculations:', {
        creditLimit,
        reserveValue: calculatedReserveValue,
        holdValue: calculatedHoldValue,
        availableToLending,
        reserveType,
        holdType
      });
    }
  }, [vault.type, calculateCreditLimit, calculateReserveHoldValues, calculateAvailableToLending, reserveValue, holdValue, reserveType, holdType]);

  const handleSave = async () => {
    // Show activity indicator immediately when button is clicked
    showActivity('Editing vault...');
    
    // Fermer le modal immédiatement
    onClose();
    
    try {
      const token = localStorage.getItem('authToken');
      if (!user || !token) {
        hideActivity();
        return;
      }

      // Calculer les valeurs finales
      const availableToLending = calculateAvailableToLending();
      
      // Payload nettoyé pour l'édition du vault
      const vaultData = {
        nickname: vault.is_gateway ? 'Gateway' : name,
        reserve: Number(reserveValue),
        hold: Number(holdValue),
        reserve_type: reserveType,
        hold_type: holdType,
        available_for_lending_amount: availableToLending,
        health: vault.type === 'super vault' ? {
          reserves: vault.health?.reserves || 0,
          loanToValue: vault.health?.loanToValue || 0,
          incomeDSCR: Number(incomeDSCR),
          growthDSCR: Number(growthDSCR),
        } : vault.health,
        modified_date: new Date().toISOString(),
      };

      // 1. Appel API pour mettre à jour le vault
      console.log('Updating vault with data:', vaultData);
      const updatedVault = await updateVault(token, user.current_pb!, vault.id, vaultData);
      console.log('Vault updated:', updatedVault);

      // 2. Pour Cash Vault/Gateway : mettre à jour l'account si le savings rate a changé
      if ((vault.type === 'cash vault' || vault.is_gateway) && vault.accounts_json && vault.accounts_json.length > 0) {
        // Trouver le cash account (pour Cash Vault/Gateway, c'est le premier account)
        const cashAccount = vault.accounts_json.find(acc => 
          acc.type === 'Savings' || acc.type === 'Cash' || vault.accounts_json!.length === 1
        ) || vault.accounts_json[0];
        
        if (cashAccount) {
          const currentSavingsRate = (cashAccount.annual_interest_rate || 0) * 100;
          const newSavingsRate = Number(savingsRate);
          
          console.log('Savings Rate comparison:', {
            current: currentSavingsRate,
            new: newSavingsRate,
            difference: Math.abs(currentSavingsRate - newSavingsRate),
            willUpdate: Math.abs(currentSavingsRate - newSavingsRate) > 0.01,
            cashAccountBalance: cashAccount.balance,
            cashAccountId: cashAccount.id
          });
          
          if (Math.abs(currentSavingsRate - newSavingsRate) > 0.01) { // Si changement significatif
            console.log('Updating cash account savings rate from', currentSavingsRate, 'to', newSavingsRate);
            
            const accountUpdateData = {
              ...cashAccount, // Préserver tous les champs existants
              annual_interest_rate: newSavingsRate / 100, // Convertir en décimal
              modified_date: new Date().toISOString(),
            };
            
            console.log('Account update payload:', accountUpdateData);
            const updatedAccount = await updateAccount(token, cashAccount.id, accountUpdateData);
            console.log('Account updated successfully:', updatedAccount);
          }
        }
      }

      // 3. Callback pour mettre à jour les données locales
      if (onSave) {
        onSave({
          ...vault, // Garder toutes les données du vault original
          ...vaultData, // Appliquer les modifications du vault
          // Mettre à jour les accounts_json si nécessaire pour Cash Vault/Gateway
          accounts_json: (vault.type === 'cash vault' || vault.is_gateway) && vault.accounts_json ? 
            vault.accounts_json.map(acc => {
              // Mettre à jour le cash account avec le nouveau savings rate
              const isCashAccount = acc.type === 'Savings' || acc.type === 'Cash' || vault.accounts_json!.length === 1;
              if (isCashAccount) {
                return { 
                  ...acc, 
                  annual_interest_rate: Number(savingsRate) / 100, 
                  modified_date: new Date().toISOString() 
                };
              }
              return acc;
            }) : vault.accounts_json
        });
      }
      
      // 4. Cacher le snackbar après les appels API
      setTimeout(() => {
        hideActivity();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating vault:', error);
      // En cas d'erreur, cacher le snackbar
      setTimeout(() => {
        hideActivity();
      }, 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="edit-vault__container">
        {/* Scrollable content */}
        <div className="edit-vault__scrollable">
          {/* Header */}
          <div className="edit-vault__header">
            <h2 className="edit-vault__title">{vault.is_gateway ? 'Edit Gateway' : 'Edit Vault'}</h2>
            <CloseButton
              aria-label="Close"
              onClick={onClose}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="dark"
              interaction=""
              className="custom-close-button"
            />
          </div>
          
          {/* Form fields */}
          <div className="edit-vault__form">
            {!vault.is_gateway && (
              <div className="edit-vault__input-group">
                <label className="edit-vault__label">
                  <span className="edit-vault__label-required">*</span>
                  Name
                </label>
                <Input value={name} onChange={(value: string) => setName(value)} className="edit-vault__input" />
              </div>
            )}
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Safety buffer allocation
              </label>
              <div className="edit-vault__currency-group">
                <select 
                  value={reserveType === 'amount' ? '$' : '%'} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReserveType(e.target.value === '$' ? 'amount' : 'percentage')} 
                  className="edit-vault__currency-select"
                  disabled={vault.type === 'cash vault' || vault.is_gateway}
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                <Input 
                  value={reserveValue} 
                  onChange={(value: string) => setReserveValue(value)} 
                  className="edit-vault__currency-input" 
                />
              </div>
            </div>
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Hold allocation
              </label>
              <div className="edit-vault__currency-group">
                <select 
                  value={holdType === 'amount' ? '$' : '%'} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHoldType(e.target.value === '$' ? 'amount' : 'percentage')} 
                  className="edit-vault__currency-select"
                  disabled={vault.type === 'cash vault' || vault.is_gateway}
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                <Input 
                  value={holdValue} 
                  onChange={(value: string) => setHoldValue(value)} 
                  className="edit-vault__currency-input" 
                />
              </div>
            </div>
            {/* Pour Cash Vault et Gateway : Savings Rate */}
            {(vault.type === 'cash vault' || vault.is_gateway) ? (
              <div className="edit-vault__input-group">
                <label className="edit-vault__label">
                  <span className="edit-vault__label-required">*</span>
                  Savings Rate
                </label>
                <Input 
                  value={savingsRate} 
                  onChange={(value: string) => setSavingsRate(value)} 
                  className="edit-vault__input"
                  type="percentage"
                />
              </div>
            ) : (
              /* Pour Super Vault : Income et Growth DSCR targets */
              <>
                <div className="edit-vault__input-group">
                  <label className="edit-vault__label">
                    <span className="edit-vault__label-required">*</span>
                    Income DSCR target
                  </label>
                  <Input 
                    value={incomeDSCR} 
                    onChange={(value: string) => setIncomeDSCR(value)}
                    className="edit-vault__input"
                    type="number"
                  />
                </div>
                <div className="edit-vault__input-group">
                  <label className="edit-vault__label">
                    <span className="edit-vault__label-required">*</span>
                    Growth DSCR target
                  </label>
                  <Input 
                    value={growthDSCR} 
                    onChange={(value: string) => setGrowthDSCR(value)}
                    className="edit-vault__input"
                    type="number"
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Setup Vault section */}
          <div className="edit-vault__section">
            <div className="edit-vault__section-row">
              <div className="edit-vault__section-content">
                <div className="edit-vault__section-title">Setup Vault</div>
                <div className="edit-vault__section-message">Re-open the setup wizard.</div>
              </div>
              <Button
                icon="iconless"
                iconComponent={undefined}
                interaction="default"
                onClick={() => {
                  if (onSetupVault) {
                    onSetupVault(vault);
                    onClose();
                  }
                }}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="secondary"
                className="edit-vault__button"
                name="setup"
                form=""
                ariaLabel="Setup"
              >
                Setup
              </Button>
            </div>
          </div>
          
          {/* Close Vault section */}
          <div className="edit-vault__section">
            <div className="edit-vault__section-row">
              <div className="edit-vault__section-content">
                <div className="edit-vault__section-title">Close Vault</div>
                <div className="edit-vault__section-message">Remove from view but keep historical data.</div>
              </div>
              <Button
                icon="iconless"
                iconComponent={undefined}
                interaction="default"
                onClick={() => {}}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="secondary"
                className="edit-vault__button--close"
                name="close"
                form=""
                ariaLabel="Close"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer sticky */}
        <div className="edit-vault__footer">
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            onClick={onClose}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="secondary"
            className="edit-vault__footer-button"
            name="cancel"
            form=""
            ariaLabel="Cancel"
          >
            Cancel
          </Button>
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            onClick={handleSave}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="primary"
            className="edit-vault__footer-button--save"
            name="save"
            form=""
            ariaLabel="Save"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 