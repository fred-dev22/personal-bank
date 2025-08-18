import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault, HoldReserveType } from '../../../types/types';
import VaultChart from './VaultChart';

export const StepReserve: React.FC<{
  vaultData: Vault;
  setVaultData: React.Dispatch<React.SetStateAction<Vault>>;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  const isSuperVault = vaultData.type === 'super vault';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0,
      width: 750,
      margin: '0 auto',
    }}>
      {/* Colonne gauche */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: '32px 0 0 0',
        width: 384,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            color: '#0d1728',
            fontFamily: 'var(--headings-h3-font-family)',
            fontSize: 'var(--headings-h3-font-size)',
            fontWeight: 'var(--headings-h3-font-weight)',
            lineHeight: 'var(--headings-h3-line-height)',
          }}>
            Reserve
          </div>
          <p style={{
            color: 'var(--grey-100)',
            fontFamily: 'var(--body-text-body-2-regular-font-family)',
            fontSize: 'var(--body-text-body-2-regular-font-size)',
            lineHeight: 'var(--body-text-body-2-regular-line-height)',
            margin: 0,
          }}>
            A reserve creates a financial buffer. It ensures your vault has enough funds for unexpected expenses. This setup focuses on this vault account, not your entire personal bank.
          </p>
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 333 }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Reserve</span>
            </div>
            {isSuperVault ? (
              <div style={{ 
                display: 'flex', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                overflow: 'hidden',
                height: '40px'
              }}>
                <div 
                  onClick={() => {
                    const newType = vaultData.reserve_type === 'percentage' ? 'amount' : 'percentage';
                    setVaultData(prev => ({ ...prev, reserve_type: newType as HoldReserveType }));
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
                  <span>{vaultData.reserve_type === 'percentage' ? '%' : '$'}</span>
                  <span style={{ 
                    fontSize: '10px',
                    lineHeight: '1'
                  }}>▼</span>
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    value={String(vaultData.reserve ?? '')}
                    onChange={(value: string) => setVaultData(prev => ({ ...prev, reserve: value === '' ? undefined : Number(value) }))}
                    placeholder={vaultData.reserve_type === 'percentage' ? "10.00" : "1,000.00"}
                    style={{ 
                      height: '40px',
                      border: 'none',
                      borderRadius: '0',
                      paddingLeft: '12px'
                    }}
                    required
                    type={vaultData.reserve_type === 'percentage' ? "percentage" : "currency"}
                    error={validationErrors.reserve}
                  />
                </div>
              </div>
            ) : (
              <Input
                value={String(vaultData.reserve ?? '')}
                onChange={(value: string) => setVaultData(prev => ({ ...prev, reserve: value === '' ? undefined : Number(value) }))}
                placeholder="$1,000.00"
                style={{ width: '100%' }}
                required
                type="currency"
                error={validationErrors.reserve}
              />
            )}
            {validationErrors.reserve && (
              <div style={{ color: '#b50007', fontSize: 12, marginTop: 4 }}>
                {validationErrors.reserve}
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
          hold={0}
          title="Account balance"
          isSuperVault={isSuperVault}
          debtBalance={Number(vaultData.debtBalance) || 0}
          vaultData={vaultData}
        />
      </div>
    </div>
  );
};

export default StepReserve; 