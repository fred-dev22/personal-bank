import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault, HoldReserveType } from '../../../types/types';
import VaultChart from './VaultChart';

export const StepHold: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  const isSuperVault = vaultData.type === 'super vault';
  return (
    <div style={{ display: 'flex', gap: 0, width: 750, margin: '0 auto' }}>
      {/* Colonne gauche */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '32px 0 0 0', width: 384 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            color: '#0d1728',
            fontFamily: 'var(--headings-h3-font-family)',
            fontSize: 'var(--headings-h3-font-size)',
            fontWeight: 'var(--headings-h3-font-weight)',
            lineHeight: 'var(--headings-h3-line-height)',
          }}>
            Hold
          </div>
          <p style={{
            color: 'var(--grey-100)',
            fontFamily: 'var(--body-text-body-2-regular-font-family)',
            fontSize: 'var(--body-text-body-2-regular-font-size)',
            lineHeight: 'var(--body-text-body-2-regular-line-height)',
            margin: 0,
          }}>
            Set a hold on your vault account for added safety or other purposes, such as maintaining a minimum balance. Your bank cannot use this allocation of money.
          </p>
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 333 }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Hold</span>
            </div>
            {isSuperVault ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: '20%' }}>
                  <select
                    value={vaultData.hold_type || 'amount'}
                    onChange={(e) => setVaultData({ ...vaultData, hold_type: e.target.value as HoldReserveType })}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="amount">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                <div style={{ width: '80%' }}>
                  <Input
                    value={vaultData.hold ?? ''}
                    onChange={(value: string) => setVaultData({ ...vaultData, hold: value === '' ? undefined : Number(value) })}
                    placeholder="5.00"
                    style={{ height: '40px' }}
                    required
                    type={vaultData.hold_type === 'percentage' ? "percentage" : "currency"}
                    error={validationErrors.hold}
                  />
                </div>
              </div>
            ) : (
              <Input
                value={vaultData.hold ?? ''}
                onChange={(value: string) => setVaultData({ ...vaultData, hold: value === '' ? undefined : Number(value) })}
                placeholder="$500.00"
                style={{ width: '100%' }}
                required
                type="currency"
                error={validationErrors.hold}
              />
            )}
            {validationErrors.hold && (
              <div style={{ color: '#b50007', fontSize: 12, marginTop: 4 }}>
                {validationErrors.hold}
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Colonne droite : graphique */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px 0'
      }}>
        <VaultChart
          totalAmount={Number(vaultData.amount ?? vaultData.balance ?? 0)}
          reserve={Number(vaultData.reserve) || 0}
          hold={Number(vaultData.hold) || 0}
          title="Account balance"
          isSuperVault={isSuperVault}
          debtBalance={Number(vaultData.debtBalance) || 0}
          vaultData={vaultData}
        />
      </div>
    </div>
  );
};

export default StepHold; 