import React from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepConfig: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  onNext?: () => void;
  onPrev?: () => void;
  gatewayMode?: boolean;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, gatewayMode, validationErrors = {} }) => {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        {gatewayMode ? 'Gateway Configuration' : 'Vault Configuration'}
      </h2>
      <p style={{ color: '#666', marginBottom: 32 }}>
        {gatewayMode ? 'Configure your gateway vault settings.' : 'Configure your vault settings.'}
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
           />
         </div>
         
         <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
           <Input
             label="Amount"
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
             label="Interest Rate"
             placeholder="Enter interest rate"
             value={vaultData.interestRate || ''}
             onChange={(value: string) => setVaultData({ ...vaultData, interestRate: value })}
             error={validationErrors.interestRate}
             type="percentage"
           />
         </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Account Type</label>
          <PopupButton
            defaultValue={vaultData.accountType || 'Checking'}
            items={[
              { id: 'Checking', label: 'Checking' },
              { id: 'Savings', label: 'Savings' }
            ]}
            label="Account Type"
            menuStyle="text"
            menuMaxHeight={200}
            onSelect={(selectedId: string) => setVaultData({ ...vaultData, accountType: selectedId })}
            style={{
              width: '100%',
              height: '48px',
              fontSize: 16
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepConfig; 