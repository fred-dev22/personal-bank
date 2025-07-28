import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepReserve: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 32,
      width: 800,
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
                         <Input
               value={vaultData.reserve ?? ''}
               onChange={(value: string) => setVaultData({ ...vaultData, reserve: value === '' ? undefined : Number(value) })}
               placeholder="$1,000.00"
               style={{ width: '100%' }}
               required
               type="currency"
               error={validationErrors.reserve}
             />
          </div>
        </form>
      </div>
      {/* Colonne droite : résumé */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: '#fbfbfd',
          borderRadius: 8,
          padding: 24,
          minWidth: 260,
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>${Number(vaultData.amount ?? vaultData.balance ?? 0)}</div>
          <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Account balance</div>
          <div style={{ width: 120, height: 120, background: '#e0e7ef', borderRadius: '50%' }} />
          <div style={{ marginTop: 16 }}>
            <div>Available: ${Number(vaultData.amount ?? vaultData.balance ?? 0) - (Number(vaultData.reserve) || 0)}</div>
            <div>Reserve: ${vaultData.reserve || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepReserve; 