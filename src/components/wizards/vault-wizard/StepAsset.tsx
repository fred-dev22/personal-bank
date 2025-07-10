import React from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

const assetTypeOptions = [
  { id: 'iul', label: 'Indexed Universal Life' },
  { id: 'whole_life', label: 'Whole Life' },
  { id: 'real_estate', label: 'Real Estate' },
  // ... autres types si besoin
];

export const StepAsset: React.FC<{
  vaultData: Vault;
  setVaultData: (data: Vault) => void;
}> = ({ vaultData, setVaultData }) => {
  return (
    <div style={{ display: 'flex', gap: 32, width: 900, margin: '0 auto' }}>
      {/* Colonne gauche */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '32px 0 0 0', width: 400 }}>
        <div style={{ fontFamily: 'var(--headings-h3-font-family)', fontSize: 'var(--headings-h3-font-size)', fontWeight: 'var(--headings-h3-font-weight)' }}>Asset Configuration</div>
        <div style={{ color: '#595959', fontFamily: 'var(--body-text-body-2-regular-font-family)', fontSize: 'var(--body-text-body-2-regular-font-size)' }}>
          Your Super Vault contains an appreciating asset. Let's set up its details.
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {/* Asset Type */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Asset Type</span>
            </div>
            <PopupButton
              defaultValue={vaultData.assetType ? assetTypeOptions.find(opt => opt.id === vaultData.assetType)?.label : 'Select asset type'}
              items={assetTypeOptions}
              label="Choose Asset Type"
              menuStyle="text"
              initialSelectedIds={[vaultData.assetType as string]}
              onSelect={(item: { id: string; label: string }) => setVaultData({ ...vaultData, assetType: item.id })}
              width="100%"
              menuMaxHeight="200px"
            />
          </div>
          {/* Name (montant) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ color: '#b50007', fontWeight: 700 }}>*</span>
              <span style={{ color: '#595959', fontWeight: 600 }}>Name</span>
            </div>
            <Input
              value={vaultData.assetName || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, assetName: value })}
              placeholder="$30,000.00"
              style={{ width: '100%' }}
              required
              type="currency"
            />
          </div>
          {/* Start date */}
          <div>
            <div style={{ color: '#595959', fontWeight: 600, marginBottom: 4 }}>Start date</div>
            <Input
              value={vaultData.assetStartDate || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, assetStartDate: value })}
              placeholder="01/20/24"
              style={{ width: '100%' }}
              type="date"
            />
          </div>
          {/* Annual non-MEC limit */}
          <div>
            <div style={{ color: '#595959', fontWeight: 600, marginBottom: 4 }}>Annual non-MEC limit</div>
            <Input
              value={vaultData.annualNonMecLimit || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, annualNonMecLimit: value })}
              placeholder="$15,000.00"
              style={{ width: '100%' }}
              type="currency"
            />
          </div>
          {/* Annual guideline amount */}
          <div>
            <div style={{ color: '#595959', fontWeight: 600, marginBottom: 4 }}>Annual guideline amount</div>
            <Input
              value={vaultData.annualGuidelineAmount || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, annualGuidelineAmount: value })}
              placeholder="$15,000.00"
              style={{ width: '100%' }}
              type="currency"
            />
          </div>
          {/* Annual growth rate */}
          <div>
            <div style={{ color: '#595959', fontWeight: 600, marginBottom: 4 }}>Annual growth rate</div>
            <Input
              value={vaultData.annualGrowthRate || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, annualGrowthRate: value })}
              placeholder="12.00%"
              style={{ width: '100%' }}
              type="percentage"
            />
          </div>
          {/* Premium paid this policy year */}
          <div>
            <div style={{ color: '#595959', fontWeight: 600, marginBottom: 4 }}>Premium paid this policy year</div>
            <Input
              value={vaultData.premiumPaidThisYear || ''}
              onChange={(value: string) => setVaultData({ ...vaultData, premiumPaidThisYear: value })}
              placeholder="$0.00"
              style={{ width: '100%' }}
              type="currency"
            />
          </div>
        </form>
      </div>
      {/* Colonne droite : résumé */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e7ef', borderRadius: 8, padding: 24, minWidth: 320, minHeight: 260 }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>${vaultData.assetName || '0.00'}</div>
          <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Equity</div>
          <div style={{ border: '1px solid #00b5ae', borderRadius: 8, padding: 16, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Asset</div>
            <div style={{ color: '#595959', fontSize: 14 }}>i.e. closed-end funds, real estate, permanent life insurance, etc.</div>
          </div>
          <div style={{ color: '#bdbdbd', textAlign: 'center' }}>Line-of-Credit</div>
        </div>
      </div>
    </div>
  );
};

export default StepAsset; 