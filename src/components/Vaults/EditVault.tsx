import React, { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Button, Input, CloseButton } from '@jbaluch/components';
import './EditVault.css';
import type { Vault } from '../../types/types';

interface EditVaultProps {
  open: boolean;
  onClose: () => void;
  vault: Vault;
}

export const EditVault: React.FC<EditVaultProps> = ({ open, onClose, vault }) => {
  const [currency1] = useState('%');
  const [currency2] = useState('%');

  // Format percentage value
  const formatPercentage = (value: number | undefined) => {
    if (typeof value === 'number') {
      return `${value.toFixed(2)}%`;
    }
    return '0.00%';
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
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Name
              </label>
              <Input value={vault.is_gateway ? 'Gateway' : (vault.nickname || vault.name)} readOnly className="edit-vault__input" />
            </div>
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Safety buffer allocation
              </label>
              <div className="edit-vault__currency-group">
                <select value={currency1} className="edit-vault__currency-select" disabled>
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                <Input value={formatPercentage(vault.reserve_type === 'percentage' ? vault.reserve : 10)} readOnly className="edit-vault__currency-input" />
              </div>
            </div>
            <div className="edit-vault__input-group">
              <label className="edit-vault__label">
                <span className="edit-vault__label-required">*</span>
                Hold allocation
              </label>
              <div className="edit-vault__currency-group">
                <select value={currency2} className="edit-vault__currency-select" disabled>
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                <Input value={formatPercentage(vault.hold_type === 'percentage' ? vault.hold : 10)} readOnly className="edit-vault__currency-input" />
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
            onClick={() => {}}
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