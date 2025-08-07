import React, { useState } from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import { SelectDate } from '../../SelectDate';
import type { Vault } from '../../../types/types';

export const StepAsset: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Asset configuration</h2>
        <p style={{ color: '#666', marginBottom: 0 }}>Your Super Vault contains an appreciating asset. Let's set up its details.</p>
         </div>
        
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 32, maxWidth: 1200 }}>
          {/* Left Section - Asset Details Input */}
          <div style={{ width: 350 }}>
                                   <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, textAlign: 'left' }}>
                Asset type <span style={{ color: 'red' }}>*</span>
            </label>
            <PopupButton
                defaultValue="Indexed Universal Life"
              items={[
                  { id: 'Indexed Universal Life', label: 'Indexed Universal Life' },
                  { id: 'Whole Life', label: 'Whole Life' },
                  { id: 'Universal Life', label: 'Universal Life' },
                  { id: 'Variable Life', label: 'Variable Life' },
                  { id: 'Term Life', label: 'Term Life' },
                  { id: 'Real Estate', label: 'Real Estate' },
                  { id: 'Stocks', label: 'Stocks' },
                  { id: 'Bonds', label: 'Bonds' },
                  { id: 'Other', label: 'Other' }
              ]}
              label="Asset Type"
              menuStyle="text"
                             onSelect={(selectedId: string) => {
                 setVaultData({ ...vaultData, assetType: selectedId });
               }}
              width="100%"
              menuMaxHeight="200px"
                style={{ height: '40px' }}
            />
            {validationErrors.assetType && (
              <div style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>
                {validationErrors.assetType}
              </div>
            )}
          </div>
        
            <div style={{ marginBottom: 24 }}>
           <Input
                label="Accumulated value"
                placeholder="Enter accumulated value"
             required
                value={vaultData.amount?.toString() || '30000.00'}
             onChange={(value: string) => setVaultData({ ...vaultData, amount: parseFloat(value) || 0 })}
             error={validationErrors.amount}
             type="currency"
                style={{ height: '40px' }}
           />
         </div>
         
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                cursor: 'pointer',
                color: '#008080',
                fontSize: 14,
                fontWeight: 500,
                marginTop: 16
              }}
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <span>Show Advanced Settings</span>
              <span style={{ fontSize: 12 }}>›</span>
            </div>

            {/* Advanced Settings Section */}
            {showAdvancedSettings && (
              <div style={{ marginTop: 24, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                <p style={{ fontSize: 14, color: '#666', marginBottom: 16, padding: '0 24px', paddingTop: '24px' }}>
                  We use this information for vault forecasts.
                </p>
                
                <div style={{ marginBottom: 24 }}>
           <SelectDate
                    label="Start date"
                    placeholder="Select start date"
                    value={vaultData.assetStartDate || '2025-01-01'}
             onChange={(value: string) => setVaultData({ ...vaultData, assetStartDate: value })}
                    style={{ height: '40px' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Input
                    label="Annual non-MEC limit"
                    placeholder="Enter annual non-MEC limit"
                    required
                    value={vaultData.annualNonMecLimit || '39000.00'}
                    onChange={(value: string) => setVaultData({ ...vaultData, annualNonMecLimit: value })}
                    error={validationErrors.annualNonMecLimit}
                    type="currency"
                    style={{ height: '40px' }}
                  />
                  <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    Based on the start date, your cumulative non-MEC limit is: $39,000.00. Check this number with your agent.
                  </p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Input
                    label="Annual guideline"
                    placeholder="Enter annual guideline"
                    required
                    value={vaultData.annualGuidelineAmount || '15000.00'}
                    onChange={(value: string) => setVaultData({ ...vaultData, annualGuidelineAmount: value })}
                    error={validationErrors.annualGuidelineAmount}
                    type="currency"
                    style={{ height: '40px' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Input
                    label="Average growth rate"
                    placeholder="Enter growth rate"
                    required
                    value={vaultData.annualGrowthRate || '7.00'}
                    onChange={(value: string) => setVaultData({ ...vaultData, annualGrowthRate: value })}
                    error={validationErrors.annualGrowthRate}
                    type="percentage"
                    style={{ height: '40px' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Input
                    label="Expense rate"
                    placeholder="Enter expense rate"
                    required
                    value={vaultData.expenseRate || '12.00'}
                    onChange={(value: string) => setVaultData({ ...vaultData, expenseRate: value })}
                    error={validationErrors.expenseRate}
                    type="percentage"
                    style={{ height: '40px' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Input
                    label="Premium paid since start date"
                    placeholder="Enter premium paid"
                    required
                    value={vaultData.premiumPaidThisYear || '30000.00'}
                    onChange={(value: string) => setVaultData({ ...vaultData, premiumPaidThisYear: value })}
                    error={validationErrors.premiumPaidThisYear}
                    type="currency"
                    style={{ height: '40px' }}
                  />
                  <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    The amount you have paid in total since the start date.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Asset Type Selection */}
          <div style={{ flex: 1, maxWidth: 400 }}>
            {/* Conteneur blanc unique pour Equity et les deux blocs */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 16,
              border: '1px solid #ddd'
            }}>
              {/* Equity en haut à gauche */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#000' }}>$0.00</div>
                <div style={{ fontSize: 12, color: '#666' }}>Equity</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  border: '2px solid #008080',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: '#f0f8f8',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, textAlign: 'center' }}>Asset</div>
                  <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                    i.e. closed-end funds, real estate, permanent life insurance, etc.
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: '#fff',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, textAlign: 'center' }}>Line-of-Credit</div>
                  <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                    i.e. home equity loan, margin loan, personal line of credit, etc.
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
      </div>
    </div>
  );
};

export default StepAsset; 