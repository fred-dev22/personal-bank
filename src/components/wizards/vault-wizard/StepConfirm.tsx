import React, { useState } from 'react';
import { Tabs } from '@jbaluch/components';
import type { Vault } from '../../../types/types';

export const StepConfirm: React.FC<{ vaultData: Vault; gatewayMode?: boolean }> = ({ vaultData, gatewayMode }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const isSuperVault = vaultData.type === 'super';

  // Détermine le nom à afficher
  const vaultName = gatewayMode ? 'Gateway' : (vaultData.name || 'Vault');
  // Détermine le type d'account
  const accountTypeLabel = vaultData.accountType === 'savings' ? 'Savings' : 'Checking';
  // Taux d'intérêt
  const appreciation = vaultData.interestRate ? `${String(vaultData.interestRate).replace(/%$/, '')}%` : '0.00%';
  // Montant
  const accountAmount = Number(vaultData.amount ?? vaultData.balance ?? 0);

  // Calculs pour Super Vault
  const parseCurrency = (val: string | number | undefined) => Number(String(val || '0').replace(/[^0-9.-]+/g, ''));
  const creditLimit = parseCurrency(vaultData.debtLtv); // Traité comme montant pour l'instant
  const reserve = parseCurrency(vaultData.reserve);
  const hold = parseCurrency(vaultData.hold);
  const debtBalance = parseCurrency(vaultData.debtBalance);
  const availableToLend = creditLimit - reserve - hold - debtBalance;
  const cashValue = parseCurrency(vaultData.assetName);
  const equity = cashValue - debtBalance;

  return (
    <div style={{
      width: 488,
      margin: '0 auto',
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
        }}>{vaultName}</div>
        <div style={{
          color: '#595959',
          fontFamily: 'var(--body-text-body-2-regular-font-family)',
          fontSize: 'var(--body-text-body-2-regular-font-size)',
        }}>{isSuperVault ? 'Super vault' : 'Cash vault'}</div>
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
          // Résumé Super Vault avec sections Accounts et Equity
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Section commune avec Hold/Reserve pour Super Vault (même format que Cash Vault) */}
            <div style={{
              width: '100%',
              background: '#fbfbfd',
              borderRadius: 8,
              boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
              border: '1px solid #dfdfe6',
              padding: 32,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 24 }}>${availableToLend.toLocaleString()}</div>
              </div>
              <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Available to lend</div>
              <div style={{ height: 1, background: '#eeeef2', width: 200, margin: '16px 0' }} />
              <div style={{ paddingLeft: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#297598', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>Credit limit</div>
                  <div style={{ color: '#595959' }}>${creditLimit.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#b49d47', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>Hold</div>
                  <div style={{ color: '#595959' }}>-${hold.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#ff7f50', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>Safety buffer</div>
                  <div style={{ color: '#595959' }}>-${reserve.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#595959', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>LOC outstanding balance</div>
                  <div style={{ color: '#595959' }}>-${debtBalance.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #0d1728', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#00b5ae', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#0d1728', fontWeight: 700, flex: 1 }}>Available to lend</div>
                  <div style={{ color: '#0d1728', fontWeight: 700 }}>${availableToLend.toLocaleString()}</div>
                </div>
              </div>
            </div>
            {/* Section Accounts */}
            <div style={{
              background: '#fbfbfd',
              borderRadius: 8,
              boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
              border: '1px solid #dfdfe6',
              padding: 24,
            }}>
              <div style={{ color: '#595959', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Accounts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Cash Value */}
                <div style={{
                  background: '#fff',
                  border: '1px solid #00b5ae',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Cash Value</div>
                  <div style={{ color: '#595959', fontSize: 14, marginBottom: 4 }}>Asset</div>
                  <div style={{ color: '#595959', fontSize: 14, marginBottom: 4 }}>Appreciation: {appreciation}</div>
                  <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 18 }}>${cashValue.toLocaleString()}</div>
                </div>
                {/* Line-of-Credit */}
                <div style={{
                  background: '#fff',
                  border: '1px solid #00b5ae',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Line-of-Credit</div>
                  <div style={{ color: '#595959', fontSize: 14, marginBottom: 4 }}>Strategic debt</div>
                  <div style={{ color: '#595959', fontSize: 14, marginBottom: 4 }}>Interest rate: {vaultData.debtCeilingRate || '0.00%'}</div>
                  <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 18 }}>${debtBalance.toLocaleString()}</div>
                </div>
              </div>
            </div>
            {/* Section Equity */}
            <div style={{
              background: '#fbfbfd',
              borderRadius: 8,
              boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
              border: '1px solid #dfdfe6',
              padding: 24,
            }}>
              <div style={{ color: '#595959', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Equity</div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>${equity.toLocaleString()}</div>
                <div style={{ color: '#595959', fontSize: 14 }}>Equity</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#595959' }}>Cash Value</div>
                  <div style={{ color: '#0d1728', fontWeight: 600 }}>${cashValue.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#595959' }}>Line of credit</div>
                  <div style={{ color: '#0d1728', fontWeight: 600 }}>-${debtBalance.toLocaleString()}</div>
                </div>
                <div style={{ height: 1, background: '#eeeef2', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#0d1728', fontWeight: 700 }}>Equity</div>
                  <div style={{ color: '#0d1728', fontWeight: 700 }}>${equity.toLocaleString()}</div>
                </div>
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
              <div style={{ fontWeight: 600, fontSize: 16 }}>Setup:</div>
            </div>
            <div style={{ color: '#000', marginBottom: 4 }}>
              • Open a {accountTypeLabel} account at your local bank.
            </div>
            <div style={{ color: '#000' }}>
              • Dedicate this account to the bank. This will make it easy to review the ledger and reconcile activity in the bank.
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
              • Schedule time every month to reconcile this vault's activity with your bank statement.
            </div>
          </div>
        </div>
      )}
      {/* Account section : visible seulement sur Summary et pour Cash Vault */}
      {activeTab === 'summary' && !isSuperVault && (
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
            <div style={{ color: '#0d1728', fontWeight: 600 }}>{accountTypeLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#595959', fontSize: 14 }}>Appreciation</div>
              <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 18 }}>{appreciation}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#000', fontWeight: 700, fontSize: 18 }}>${accountAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepConfirm; 