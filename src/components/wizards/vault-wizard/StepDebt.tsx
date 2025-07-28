import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepDebt: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Debt Information</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>Configure the debt details for your Super Vault.</p>
      
             <div style={{ maxWidth: 400, margin: '0 auto' }}>
         <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
           <Input
             label="Debt Balance"
             placeholder="Enter debt balance"
             required
             value={vaultData.debtBalance || ''}
             onChange={(value: string) => setVaultData({ ...vaultData, debtBalance: value })}
             error={validationErrors.debtBalance}
             type="currency"
           />
         </div>
         
         <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
           <Input
             label="Debt Ceiling Rate"
             placeholder="Enter ceiling rate"
             value={vaultData.debtCeilingRate || ''}
             onChange={(value: string) => setVaultData({ ...vaultData, debtCeilingRate: value })}
             error={validationErrors.debtCeilingRate}
             type="percentage"
           />
         </div>
         
         <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
           <Input
             label="Debt LTV"
             placeholder="Enter LTV percentage"
             value={vaultData.debtLtv || ''}
             onChange={(value: string) => setVaultData({ ...vaultData, debtLtv: value })}
             error={validationErrors.debtLtv}
             type="percentage"
           />
         </div>
      </div>
    </div>
  );
};

export default StepDebt; 