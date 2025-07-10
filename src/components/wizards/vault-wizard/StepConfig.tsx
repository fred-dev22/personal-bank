import React from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

const accountTypeOptions = [
  { id: 'savings', label: 'Savings' },
  { id: 'checking', label: 'Checking' },
];

export const StepConfig: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
  onNext?: () => void;
  onPrev?: () => void;
}> = ({ vaultData, setVaultData }) => {
  const isSuperVault = vaultData.type === 'super';
  return (
    <div style={{ alignItems: 'center', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 32, overflow: 'hidden', padding: '32px 0 0 0', position: 'relative', width: 800, margin: '0 auto' }}>
      <div style={{ flex: '0 0 auto', width: 320 }}>
        <div style={{ fontFamily: 'var(--headings-h3-font-family)', fontSize: 'var(--headings-h3-font-size)', fontWeight: 'var(--headings-h3-font-weight)', textAlign: 'center' }}>Vault Configuration</div>
        <div style={{ fontFamily: 'var(--body-text-body-2-regular-font-family)', fontSize: 'var(--body-text-body-2-regular-font-size)', color: '#595959', textAlign: 'center', marginTop: 4 }}>A Cash Vault uses a bank account. Let&apos;s define what that is.</div>
      </div>
      <form style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 320, gap: 16 }}>
        {/* Name */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
            <span style={{ color: '#595959', fontWeight: 600 }}>Name</span>
          </div>
          <Input
            value={vaultData.name || ''}
            onChange={(value: string) => setVaultData({ ...vaultData, name: value })}
            placeholder={isSuperVault ? 'Super Vault' : 'Cash Vault'}
            style={{ width: '100%' }}
            required
            type="text"
          />
        </div>
        {/* Les autres champs sont masqués pour super vault */}
        {!isSuperVault && <>
        {/* Amount */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
            <span style={{ color: '#595959', fontWeight: 600 }}>Amount</span>
          </div>
          <Input
            value={vaultData.amount || ''}
            onChange={(value: string) => setVaultData({ ...vaultData, amount: value })}
            placeholder="$10,000.00"
            style={{ width: '100%' }}
            required
            type="currency"
          />
        </div>
        {/* Interest Rate */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
            <span style={{ color: '#595959', fontWeight: 600 }}>Interest Rate</span>
          </div>
          <Input
            value={vaultData.interestRate || ''}
            onChange={(value: string) => setVaultData({ ...vaultData, interestRate: value })}
            placeholder="5.00%"
            style={{ width: '100%' }}
            required
            type="percentage"
          />
        </div>
        {/* Account Type (PopupButton) */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
            <span style={{ color: '#595959', fontWeight: 600 }}>Account Type</span>
          </div>
          <PopupButton
            defaultValue={vaultData.accountType ? accountTypeOptions.find(opt => opt.id === vaultData.accountType)?.label : 'Select account type'}
            items={accountTypeOptions}
            label="Choose Account Type"
            menuStyle="text"
            initialSelectedIds={[vaultData.accountType as string]}
            onSelect={(item: { id: string; label: string }) => {
              setVaultData({ ...vaultData, accountType: item.id });
            }}
            width="100%"
            menuMaxHeight="200px"
          />
          <div style={{ color: '#595959', fontFamily: 'var(--captions-caption-regular-font-family)', fontSize: 'var(--captions-caption-regular-font-size)', marginTop: 4 }}>
            Examples include savings and checking accounts.
          </div>
        </div>
        </>}
      </form>
    </div>
  );
};

export default StepConfig; 