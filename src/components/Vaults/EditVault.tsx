import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal/Modal';
import { Button, Input, CloseButton } from '@jbaluch/components';
import './EditVault.css';
import { useActivity } from '../../contexts/ActivityContext';
import type { Vault } from '../../types/types';

interface EditVaultProps {
  open: boolean;
  onClose: () => void;
  vault: Vault;
  onSave?: (data: Partial<Vault>) => void;
}

export const EditVault: React.FC<EditVaultProps> = ({ open, onClose, vault, onSave }) => {
  const { showActivity, hideActivity } = useActivity();
  const [name, setName] = useState('');
  const [reserveType, setReserveType] = useState<'amount' | 'percentage'>('percentage');
  const [holdType, setHoldType] = useState<'amount' | 'percentage'>('percentage');
  const [reserveValue, setReserveValue] = useState<number | string>('');
  const [holdValue, setHoldValue] = useState<number | string>('');

  useEffect(() => {
    if (vault) {
      const isCashVault = vault.type === 'Cash Vault';
      const isGateway = vault.is_gateway;
      
      // For Cash Vault and Gateway, force amount type ($)
      const initialReserveType = (isCashVault || isGateway) ? 'amount' : (vault.reserve_type || 'percentage');
      const initialHoldType = (isCashVault || isGateway) ? 'amount' : (vault.hold_type || 'percentage');
      
      // For Gateway, show "Edit Gateway", otherwise use vault name
      setName(isGateway ? 'Edit Gateway' : (vault.nickname || vault.name || ''));
      setReserveType(initialReserveType);
      setHoldType(initialHoldType);
      setReserveValue(vault.reserve ?? 0);
      setHoldValue(vault.hold ?? 0);
    }
  }, [vault, open]);

  const handleSave = () => {
    // Show activity indicator immediately when button is clicked
    showActivity('Editing vault...');
    
    const vaultData = {
      ...vault,
      nickname: vault.is_gateway ? 'Gateway' : name,
      reserve: Number(reserveValue),
      hold: Number(holdValue),
      reserve_type: reserveType,
      hold_type: holdType,
    };
    
    if (onSave) {
      onSave(vaultData);
    }
    
    hideActivity();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="edit-vault__container">
        {/* Scrollable content */}
        <div className="edit-vault__scrollable">
          {/* Header */}
          <div className="edit-vault__header">
            <h2 className="edit-vault__title">Edit Vault</h2>
            <CloseButton
              aria-label="Close"
              onClick={onClose}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="dark"
              interaction=""
              className="edit-vault__close-button"
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
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="edit-vault__input" />
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
                  disabled={vault.type === 'Cash Vault' || vault.is_gateway}
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                <Input 
                  value={reserveValue} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReserveValue(e.target.value)} 
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
                  disabled={vault.type === 'Cash Vault' || vault.is_gateway}
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                <Input 
                  value={holdValue} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoldValue(e.target.value)} 
                  className="edit-vault__currency-input" 
                />
              </div>
            </div>
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Income DSCR target
              </label>
              <Input value={vault.health?.incomeDSCR?.toFixed(2) || "1.50"} readOnly className="edit-vault__input" />
            </div>
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Growth DSCR target
              </label>
              <Input value={vault.health?.growthDSCR?.toFixed(2) || "1.50"} readOnly className="edit-vault__input" />
            </div>
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
                onClick={() => {}}
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