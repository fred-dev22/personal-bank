import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepAsset: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Asset Information</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>Define the asset for your Super Vault.</p>
      
             <div style={{ maxWidth: 400, margin: '0 auto' }}>
         <div className="vault-wizard-form-group" style={{ marginBottom: 16 }}>
           <Input
             label="Asset Name"
             placeholder="Enter asset name"
             required
             value={vaultData.assetName || ''}
             onChange={(value: string) => setVaultData({ ...vaultData, assetName: value })}
             error={validationErrors.assetName}
           />
         </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Asset Type <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={vaultData.assetType || ''}
            onChange={(e) => setVaultData({ ...vaultData, assetType: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.assetType ? '1px solid #d32f2f' : '1px solid #ddd',
              borderRadius: 8,
              fontSize: 16
            }}
          >
            <option value="">Select asset type</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Stocks">Stocks</option>
            <option value="Bonds">Bonds</option>
            <option value="Other">Other</option>
          </select>
          {validationErrors.assetType && (
            <div style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>
              {validationErrors.assetType}
            </div>
          )}
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
             label="Asset Start Date"
             type="date"
             value={vaultData.assetStartDate || ''}
             onChange={(value: string) => setVaultData({ ...vaultData, assetStartDate: value })}
           />
         </div>
      </div>
    </div>
  );
};

export default StepAsset; 