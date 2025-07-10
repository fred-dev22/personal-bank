import React, { useState } from 'react';
import { Tabs } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepConfirm: React.FC<{ vaultData: Vault }> = ({ vaultData }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const isSuperVault = vaultData.type === 'super';

  return (
    <div style={{
      width: 488,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      alignItems: 'center',
      padding: '0 0 32px 0',
    }}>
      {/* Header */}
      <div style={{
        alignItems: 'center',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '32px 24px 16px',
        width: '100%',
      }}>
        <div style={{
          color: '#0d1728',
          fontFamily: 'var(--headings-h3-font-family)',
          fontSize: 'var(--headings-h3-font-size)',
          fontWeight: 'var(--headings-h3-font-weight)',
          textAlign: 'center',
        }}>Vault ABC</div>
        <div style={{
          color: '#595959',
          fontFamily: 'var(--body-text-body-2-regular-font-family)',
          fontSize: 'var(--body-text-body-2-regular-font-size)',
        }}>Cash vault</div>
      </div>
      {/* Tabs */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        <div style={{ minWidth: 320 }}>
          <Tabs
            activeTabId={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'summary', label: 'Summary' },
              { id: 'instructions', label: 'Instructions' }
            ]}
          />
        </div>
      </div>
      {/* Content */}
      {activeTab === 'summary' ? (
        isSuperVault ? (
          // Résumé Super Vault
          <div style={{
            width: '100%',
            background: '#fbfbfd',
            borderRadius: 8,
            boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
            border: '1px solid #dfdfe6',
            padding: 32,
            marginBottom: 24,
          }}>
            <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
              ${vaultData.assetName || '0.00'} Available to lend
            </div>
            <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Credit limit: ${vaultData.assetName || '0.00'}</div>
            <div style={{ height: 1, background: '#eeeef2', width: 200, margin: '16px 0' }} />
            <div style={{ paddingLeft: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ color: '#595959', flex: 1 }}>Hold</div>
                <div style={{ color: '#595959' }}>-${vaultData.hold || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ color: '#595959', flex: 1 }}>Reserve</div>
                <div style={{ color: '#595959' }}>-${vaultData.reserve || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ color: '#595959', flex: 1 }}>LOC outstanding balance</div>
                <div style={{ color: '#595959' }}>-${vaultData.debtBalance || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #0d1728', padding: '12px 16px' }}>
                <div style={{ color: '#0d1728', fontWeight: 700, flex: 1 }}>Available to lend</div>
                <div style={{ color: '#0d1728', fontWeight: 700 }}>${vaultData.assetName || '0.00'}</div>
              </div>
            </div>
          </div>
        ) : (
          // Résumé Cash Vault (déjà existant)
          <div style={{
            width: '100%',
            background: '#fbfbfd',
            borderRadius: 8,
            boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
            border: '1px solid #dfdfe6',
            padding: 32,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 24 }}>${Number(vaultData.amount ?? vaultData.balance ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0)}</div>
            </div>
            <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Available to lend</div>
            <div style={{ height: 1, background: '#eeeef2', width: 200, margin: '16px 0' }} />
            <div style={{ paddingLeft: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#297598', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#595959', flex: 1 }}>Balance</div>
                <div style={{ color: '#595959' }}>${vaultData.amount || vaultData.balance || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#b49d47', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#595959', flex: 1 }}>Hold</div>
                <div style={{ color: '#595959' }}>-${vaultData.hold || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#ff7f50', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#595959', flex: 1 }}>Reserve</div>
                <div style={{ color: '#595959' }}>-${vaultData.reserve || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #0d1728', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#00b5ae', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#0d1728', fontWeight: 700, flex: 1 }}>Available to lend</div>
                <div style={{ color: '#0d1728', fontWeight: 700 }}>${Number(vaultData.amount ?? vaultData.balance ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0)}</div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div style={{
          width: '100%',
          background: '#fbfbfd',
          border: '1px solid #eeeef2',
          borderRadius: 8,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* Setup */}
          <div style={{
            borderBottom: '1px solid #eeeef2',
            paddingBottom: 12,
            marginBottom: 12,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Setup</div>
              {/* <Pdf className="pdf-instance" /> */}
              <button style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}>
                {/* Remplace par <Pdf /> si tu as le composant */}
                <span role="img" aria-label="pdf">📄</span>
              </button>
            </div>
            <div style={{ color: '#000', marginBottom: 4 }}>
              Open a [account type] account at your local bank.
            </div>
            <div style={{ color: '#000' }}>
              Dedicate this account to the bank. This will make it easy to review the ledger and reconcile activity in the bank.
            </div>
          </div>
          {/* Reconcile */}
          <div>
            <div style={{
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 8,
            }}>Reconcile</div>
            <div style={{ color: '#000' }}>
              Schedule time every month to reconcile this vault’s activity with your bank statement.
            </div>
          </div>
        </div>
      )}
      {/* Account section : visible seulement sur Summary */}
      {activeTab === 'summary' && (
        <div style={{ width: '100%' }}>
          <div style={{ color: '#595959', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Account</div>
          <div style={{
            background: '#ffffffa6',
            border: '1px solid #dfdfe6',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
          }}>
            <div style={{ color: '#0d1728', fontWeight: 600 }}>Checking</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ color: '#595959', fontSize: 14 }}>Appreciation</div>
              <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 18 }}>3.50%</div>
              <div style={{ color: '#000', fontWeight: 700, fontSize: 18 }}>$10,000.00</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepConfirm; 