import React, { useState } from 'react';
import type { Loan, Vault } from '../../../types/types';
import { formatCurrency } from '../../../utils/currencyUtils';

export const StepConfirm: React.FC<{
  loanData: Partial<Loan>;
  vaults: Vault[];
}> = ({ loanData, vaults }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'instructions'>('summary');
  
  // Trouver le vault sélectionné
  const selectedVault = vaults.find(vault => vault.id === loanData.vault_id);

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Onglets */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setActiveTab('summary')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: activeTab === 'summary' ? '#00B5AE' : '#666',
              borderBottom: activeTab === 'summary' ? '2px solid #00B5AE' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: activeTab === 'instructions' ? '#00B5AE' : '#666',
              borderBottom: activeTab === 'instructions' ? '2px solid #00B5AE' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            Instructions
          </button>
        </div>

        {/* Contenu Summary */}
        {activeTab === 'summary' && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px', textAlign: 'center' }}>
              {loanData.nickname || 'Loan 123'}
            </h2>
            
            {/* Carte de résumé principal */}
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '24px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                    {formatCurrency(loanData.initial_balance || 0)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>funding amount</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                    {formatCurrency((loanData.initial_balance || 0) / (loanData.initial_number_of_payments || 1))}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>1 month</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                    {loanData.initial_annual_rate?.toFixed(0) || '100'}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Amortized: Due-Date</div>
                </div>
              </div>
            </div>

            {/* Carte du vault sélectionné */}
            {selectedVault && (
              <div style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {selectedVault.nickname || selectedVault.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                                            {selectedVault.type || 'cash vault'}
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>
                  {formatCurrency(selectedVault.available_for_lending_amount || selectedVault.balance || 0)}
                </div>
              </div>
            )}

            {/* Section Downloads */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Downloads</h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Download this promissory note, or upload an existing one after the loan is added to the app.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#f9f9f9',
                cursor: 'pointer'
              }}>
                <span style={{ color: '#d32f2f', fontSize: '20px' }}>📄</span>
                <span style={{ fontSize: '16px', fontWeight: '500', flex: 1 }}>Promissory.pdf</span>
                <span style={{ fontSize: '16px', color: '#666' }}>↗</span>
              </div>
            </div>
          </>
        )}

        {/* Contenu Instructions */}
        {activeTab === 'instructions' && (
          <div style={{ padding: '16px 0' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Funding</h3>
                <span style={{ fontSize: '20px' }}>📋</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '8px' }}>Send fred the new Promissory Note and have them sign it.</li>
                <li style={{ marginBottom: '8px' }}>Store the signed Note for your records.</li>
                <li style={{ marginBottom: '8px' }}>Disburse {formatCurrency(loanData.initial_balance || 0)} to {loanData.borrower_id} from {selectedVault?.nickname || selectedVault?.name || 'the selected vault'}.</li>
                <li>We will automatically record the disbursement in {selectedVault?.nickname || selectedVault?.name || 'the selected vault'} ledger after completing this wizard.</li>
              </ul>
            </div>

            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#666' }}>Receiving Payments</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>You will get a {formatCurrency(loanData.initial_payment_amount || 0)} payment from {loanData.borrower_id} every month in your {selectedVault?.nickname || selectedVault?.name || 'selected vault'}.</li>
              </ul>
            </div>

            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#666' }}>Completion</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>This loan ends after 1 timely payments.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 