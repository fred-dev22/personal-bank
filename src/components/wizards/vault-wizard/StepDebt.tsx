import React from 'react';
import { Input } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepDebt: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
}> = ({ vaultData, setVaultData }) => {
  return (
    <div style={{ display: 'flex', gap: 32, width: 900, margin: '0 auto' }}>
      {/* Colonne gauche */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '32px 0 0 0', width: 400 }}>
        <div style={{ fontFamily: 'var(--headings-h3-font-family)', fontSize: 'var(--headings-h3-font-size)', fontWeight: 'var(--headings-h3-font-weight)' }}>Debt Configuration</div>
        <div style={{ color: '#595959', fontFamily: 'var(--body-text-body-2-regular-font-family)', fontSize: 'var(--body-text-body-2-regular-font-size)' }}>
          Your Super Vault uses a line of credit against the asset to lend funds. Let's configure it now.
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {/* Loan balance */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Outstanding balance</span>
            </div>
            <Input
              value={vaultData.debtBalance || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, debtBalance: value })}
              placeholder="$0.00"
              style={{ width: '100%' }}
              required
              type="currency"
            />
            <div style={{ color: '#595959', fontSize: 12, marginTop: 4 }}>
              The loan's current balance. This is any existing line of credit already in use and not available for new lending.
            </div>
          </div>
          {/* Ceiling rate */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Interest rate</span>
            </div>
            <Input
              value={vaultData.debtCeilingRate || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, debtCeilingRate: value })}
              placeholder="5.00%"
              style={{ width: '100%' }}
              required
              type="percentage"
            />
            <div style={{ color: '#595959', fontSize: 12, marginTop: 4 }}>
              Enter the ceiling rate if applicable.
            </div>
          </div>
          {/* LTV (max borrowable) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Credit limit</span>
            </div>
            <Input
              value={vaultData.debtLtv || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, debtLtv: value })}
              placeholder="90.00%"
              style={{ width: '100%' }}
              required
              type="percentage"
            />
            <div style={{ color: '#595959', fontSize: 12, marginTop: 4 }}>
              Maximum borrowable: 90% of the value of the underlying asset. For example, a HELOC's limit might be $90k for a $100k property, or 90.00%.
            </div>
          </div>
        </form>
      </div>
      {/* Colonne droite : résumé */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e7ef', borderRadius: 8, padding: 24, minWidth: 320, minHeight: 260 }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>${vaultData.assetName || '0.00'}</div>
          <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Equity</div>
          <div style={{ border: '1px solid #00b5ae', borderRadius: 8, padding: 16, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Cash Value</div>
            <div style={{ color: '#595959', fontSize: 14 }}>${vaultData.assetName || '0.00'}</div>
          </div>
          <div style={{ border: '1px solid #00b5ae', borderRadius: 8, padding: 16, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Line-of-Credit</div>
            <div style={{ color: '#595959', fontSize: 14 }}>i.e. home equity loan, margin loan, personal line of credit, etc.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDebt; 