import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault } from '../../../types/types';
import VaultChart from './VaultChart';

export const StepHold: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  validationErrors?: {[key: string]: string};
}> = ({ vaultData, setVaultData, validationErrors = {} }) => {
  return (
    <div style={{ display: 'flex', gap: 32, width: 800, margin: '0 auto' }}>
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
                         <Input
               value={vaultData.hold ?? ''}
               onChange={(value: string) => setVaultData({ ...vaultData, hold: value === '' ? undefined : Number(value) })}
               placeholder="$500.00"
               style={{ width: '100%' }}
               required
               type="currency"
               error={validationErrors.hold}
             />
          </div>
        </form>
      </div>
      {/* Colonne droite : graphique */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <VaultChart
          totalAmount={Number(vaultData.amount ?? vaultData.balance ?? 0)}
          reserve={Number(vaultData.reserve) || 0}
          hold={Number(vaultData.hold) || 0}
          title="Account balance"
        />
      </div>
    </div>
  );
};

export default StepHold; 