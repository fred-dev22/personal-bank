import React from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepDebt: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
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
            <div style={{ marginBottom: 16 }}>
              <Input
                label="Outstanding balance"
                placeholder="Enter outstanding balance"
                required
                value={vaultData.debtBalance || '0.00'}
                onChange={(value: string) => setVaultData({ ...vaultData, debtBalance: value })}
                error={validationErrors.debtBalance}
                type="currency"
                style={{ height: '40px' }}
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                The loan's current balance. This is any existing line of credit already in use and not available for new lending.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Input
                label="Interest rate"
                placeholder="Enter interest rate"
                required
                value={vaultData.debtCeilingRate || '5.00'}
                onChange={(value: string) => setVaultData({ ...vaultData, debtCeilingRate: value })}
                error={validationErrors.debtCeilingRate}
                type="percentage"
                style={{ height: '40px' }}
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Enter the ceilling rate if applicable.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, textAlign: 'left' }}>
                Credit limit <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: '30%' }}>
                  <PopupButton
                    defaultValue="%"
                    items={[
                      { id: '%', label: '%' },
                      { id: '$', label: '$' }
                    ]}
                    label="Type"
                    menuStyle="text"
                    onSelect={(selectedId: string) => {
                      setVaultData({ ...vaultData, creditLimitType: selectedId });
                    }}
                    width="100%"
                    menuMaxHeight="100px"
                    style={{ height: '40px' }}
                  />
                </div>
                <div style={{ width: '70%' }}>
                  <Input
                    placeholder="Enter credit limit"
                    value={vaultData.debtLtv || '90.00'}
                    onChange={(value: string) => setVaultData({ ...vaultData, debtLtv: value })}
                    error={validationErrors.debtLtv}
                    type="percentage"
                    style={{ height: '40px' }}
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
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#000' }}>$30,000.00</div>
              <div style={{ fontSize: 14, color: '#666' }}>Equity</div>
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
                backgroundColor: '#f0f8f8'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Line-of-Credit</div>
                <div style={{ fontSize: 14, color: '#666' }}>
                  i.e. home equity loan, margin loan, personal line of credit, etc.
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