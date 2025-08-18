import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault, CreditLimitType } from '../../../types/types';

export const StepDebt: React.FC<{
  vaultData: Vault;
  setVaultData: React.Dispatch<React.SetStateAction<Vault>>;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  // Calculer l'Equity en soustrayant le debt balance de la valeur totale de l'asset
  const assetValue = Number(vaultData.amount) || 30000;
  const debtBalance = Number(vaultData.debtBalance) || 0;
  const equity = assetValue - debtBalance;
  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Debt configuration</h2>
        <p style={{ color: '#666', marginBottom: 0 }}>Your Super Vault uses a line of credit against the asset to lend funds. Let's configure it now.</p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 32, maxWidth: 1200 }}>
          {/* Left Section - Debt Details Input */}
          <div style={{ width: 350 }}>
            <div style={{ marginBottom: 24 }}>
              <Input
                label="Outstanding balance"
                placeholder="Enter outstanding balance"
                required
                value={vaultData.debtBalance || '0.00'}
                onChange={(value: string) => setVaultData(prev => ({ ...prev, debtBalance: value }))}
                error={validationErrors.debtBalance}
                type="currency"
                style={{ height: '40px' }}
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                The loan's current balance. This is any existing line of credit already in use and not available for new lending.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Input
                label="Interest rate"
                placeholder="Enter interest rate"
                required
                value={vaultData.debtCeilingRate || '5.00'}
                onChange={(value: string) => setVaultData(prev => ({ ...prev, debtCeilingRate: value }))}
                error={validationErrors.debtCeilingRate}
                type="percentage"
                style={{ height: '40px' }}
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Enter the ceilling rate if applicable.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, textAlign: 'left' }}>
                Credit limit <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ 
                display: 'flex', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                overflow: 'hidden',
                height: '40px'
              }}>
                <div 
                  onClick={() => {
                    const newType = vaultData.creditLimitType === 'percentage' ? 'amount' : 'percentage';
                    setVaultData(prev => ({ ...prev, creditLimitType: newType as CreditLimitType }));
                  }}
                  style={{ 
                    width: '47px',
                    backgroundColor: '#DFDFE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid #ddd',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#000',
                    cursor: 'pointer',
                    position: 'relative',
                    userSelect: 'none',
                    gap: '4px'
                  }}
                >
                  <span>{vaultData.creditLimitType === 'percentage' ? '%' : '$'}</span>
                  <span style={{ 
                    fontSize: '10px',
                    lineHeight: '1'
                  }}>▼</span>
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Enter credit limit"
                    value={String(vaultData.debtLtv ?? '')}
                    onChange={(value: string) => setVaultData(prev => ({ ...prev, debtLtv: value }))}
                    error={validationErrors.debtLtv}
                    type={vaultData.creditLimitType === 'amount' ? 'currency' : 'percentage'}
                    style={{ 
                      height: '40px',
                      border: 'none',
                      borderRadius: '0',
                      paddingLeft: '12px'
                    }}
                  />
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Maximum borrowable: 90.00% of the value of the underlying asset. For example, a HELOC's limit might be $90k for a $100k property, or 90.00%.
              </p>
            </div>
          </div>

          {/* Right Section - Summary Information */}
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
                 <div style={{ fontSize: 24, fontWeight: 700, color: '#000' }}>${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                 <div style={{ fontSize: 12, color: '#666' }}>Equity</div>
               </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>Cash Value</div>
                      <div style={{ fontSize: 12, color: '#666' }}>Asset</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>$30,000.00</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  border: '2px solid #008080',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: '#f0f8f8',
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

export default StepDebt; 