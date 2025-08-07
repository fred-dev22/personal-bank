import React from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepConfig: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  onNext?: () => void;
  onPrev?: () => void;
  gatewayMode?: boolean;
  vaultType?: 'cash' | 'super';
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, gatewayMode, vaultType, validationErrors = {} }) => {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        {gatewayMode ? 'Gateway Configuration' : 'Vault Configuration'}
      </h2>
      <p style={{ color: '#666', marginBottom: 32 }}>
        {gatewayMode ? 'Configure your gateway vault settings.' : vaultType === 'cash' ? 'A Cash Vault uses a bank account. Let\'s define what that is.' : 'Give this vault a name'}
      </p>
      
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
          <Input
            label="Vault Name"
            placeholder="Enter vault name"
            required
            value={vaultData.name || ''}
            onChange={(value: string) => setVaultData({ ...vaultData, name: value })}
            error={validationErrors.name}
            disabled={gatewayMode}
          />
        </div>
        
        {/* Masquer ces champs pour Super Vault */}
        {vaultType !== 'super' && (
          <>
            <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
              <Input
                label="Account Balance"
                placeholder="Enter amount"
                required
                value={vaultData.amount?.toString() || ''}
                onChange={(value: string) => setVaultData({ ...vaultData, amount: parseFloat(value) || 0 })}
                error={validationErrors.amount}
                type="currency"
              />
            </div>
            
            <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
              <Input
                label="Account Interest Rate"
                placeholder="Enter interest rate"
                value={vaultData.interestRate || ''}
                onChange={(value: string) => setVaultData({ ...vaultData, interestRate: value })}
                error={validationErrors.interestRate}
                type="percentage"
              />
            </div>
           
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, textAlign: 'left' }}>
                Account Type <span style={{ color: 'red' }}>*</span>
              </label>
              <PopupButton
                defaultValue={vaultData.accountType || ''}
                items={[
                  {
                    id: 'Checking',
                    label: 'Checking'
                  },
                  {
                    id: 'Savings',
                    label: 'Savings'
                  }
                ]}
                label="Account Type"
                menuStyle="text"
                onSelect={(selectedId: string) => {
                  setVaultData({ ...vaultData, accountType: selectedId });
                }}
                width="100%"
                menuMaxHeight="200px"
              />
              {validationErrors.accountType && (
                <div style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>
                  {validationErrors.accountType}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#666', marginTop: 4, textAlign: 'left' }}>
                Examples include savings and checking accounts.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepConfig; 