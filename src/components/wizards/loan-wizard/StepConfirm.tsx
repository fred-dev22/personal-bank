import React, { useState } from 'react';
import type { Loan, Vault } from '../../../types/types';
import { formatCurrency } from '../../../utils/currencyUtils';
import { TabNavigation } from '../../ui/TabNavigation';

export const StepConfirm: React.FC<{
  loanData: Partial<Loan>;
  vaults: Vault[];
}> = ({ loanData, vaults }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Trouver le vault sélectionné
  const selectedVault = vaults.find(vault => vault.id === loanData.vault_id);

  // Icon components - same as vault wizard
  const SummaryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_15560_39860)">
        <path d="M15.1516 6.35389C15.1516 5.93968 14.8158 5.60389 14.4016 5.60389C13.9873 5.60389 13.6516 5.93968 13.6516 6.35389H15.1516ZM9.64728 2.34961C10.0615 2.34961 10.3973 2.01382 10.3973 1.59961C10.3973 1.1854 10.0615 0.849609 9.64728 0.849609V2.34961ZM4.4149 9.68294C4.16637 10.0143 4.23353 10.4844 4.5649 10.7329C4.89627 10.9815 5.36637 10.9143 5.6149 10.5829L4.4149 9.68294ZM7.5749 6.71961L8.10512 6.18918C7.95137 6.03549 7.7385 5.95607 7.52166 5.9715C7.30481 5.98693 7.10533 6.0957 6.9749 6.26961L7.5749 6.71961ZM9.28223 8.42628L8.752 8.95671C8.90576 9.11041 9.11866 9.18983 9.33552 9.17438C9.55238 9.15893 9.75186 9.05014 9.88229 8.8762L9.28223 8.42628ZM12.4416 5.46287C12.6901 5.13147 12.6229 4.66137 12.2915 4.41289C11.9601 4.1644 11.49 4.23162 11.2415 4.56302L12.4416 5.46287ZM14.4016 6.35389H13.6516V12.6929H14.4016H15.1516V6.35389H14.4016ZM14.4016 12.6929H13.6516C13.6516 13.2213 13.2232 13.6496 12.6949 13.6496V14.3996V15.1496C14.0517 15.1496 15.1516 14.0497 15.1516 12.6929H14.4016ZM12.6949 14.3996V13.6496H3.30823V14.3996V15.1496H12.6949V14.3996ZM3.30823 14.3996V13.6496C2.77988 13.6496 2.35156 13.2213 2.35156 12.6929H1.60156H0.851562C0.851562 14.0497 1.95145 15.1496 3.30823 15.1496V14.3996ZM1.60156 12.6929H2.35156V3.30628H1.60156H0.851562V12.6929H1.60156ZM1.60156 3.30628H2.35156C2.35156 2.77792 2.77988 2.34961 3.30823 2.34961V1.59961V0.849609C1.95145 0.849609 0.851562 1.9495 0.851562 3.30628H1.60156ZM3.30823 1.59961V2.34961H9.64728V1.59961V0.849609H3.30823V1.59961ZM13.5482 3.30628V4.05628C14.4337 4.05628 15.1516 3.33844 15.1516 2.45294H14.4016H13.6516C13.6516 2.51001 13.6053 2.55628 13.5482 2.55628V3.30628ZM14.4016 2.45294H15.1516C15.1516 1.56745 14.4337 0.849609 13.5482 0.849609V1.59961V2.34961C13.6053 2.34961 13.6516 2.39587 13.6516 2.45294H14.4016ZM13.5482 1.59961V0.849609C12.6627 0.849609 11.9449 1.56745 11.9449 2.45294H12.6949H13.4449C13.4449 2.39587 13.4912 2.34961 13.5482 2.34961V1.59961ZM12.6949 2.45294H11.9449C11.9449 3.33844 12.6627 4.05628 13.5482 4.05628V3.30628V2.55628C13.4912 2.55628 13.4449 2.51001 13.4449 2.45294H12.6949ZM5.0149 10.1329L5.6149 10.5829L8.1749 7.16961L7.5749 6.71961L6.9749 6.26961L4.4149 9.68294L5.0149 10.1329ZM7.5749 6.71961L7.04467 7.25004L8.752 8.95671L9.28223 8.42628L9.81246 7.89584L8.10512 6.18918L7.5749 6.71961ZM9.28223 8.42628L9.88229 8.8762L12.4416 5.46287L11.8416 5.01294L11.2415 4.56302L8.68217 7.97635L9.28223 8.42628Z"/>
      </g>
      <defs>
        <clipPath id="clip0_15560_39860">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
  
  const InstructionsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_15588_35511)">
        <path d="M13.4008 13.5988H2.60078V2.60078H13.4008C13.4008 2.60078 13.4008 1.50372 13.4008 0.800781C9.18312 0.800781 2.60078 0.800781 2.60078 0.800781C1.61078 0.800781 0.800781 1.61078 0.800781 2.60078C0.800781 3.59078 0.800781 13.4008 0.800781 13.4008C0.800781 14.3908 1.61078 15.2008 2.60078 15.2008H13.4008C14.3908 15.2008 15.2008 14.3908 15.2008 13.4008C15.2008 13.4008 15.2008 3.55249 15.2008 2.60078C15.2008 1.64907 14.3008 0.800781 13.4008 0.800781C13.4008 5.79871 13.4008 13.5988 13.4008 13.5988Z"/>
        <path d="M11.6008 4.40078H4.40078V6.20078H11.6008V4.40078Z"/>
        <path d="M4.40078 7.10078V8.90078H11.6008V7.10078H4.40078Z"/>
        <path d="M11.6008 9.80078H4.40078V11.6008H11.6008V9.80078Z"/>
      </g>
      <defs>
        <clipPath id="clip0_15588_35511">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const tabs = [
    { 
      id: 'summary', 
      label: 'Summary',
      icon: <SummaryIcon />
    },
    { 
      id: 'instructions', 
      label: 'Instructions',
      icon: <InstructionsIcon />
    }
  ];

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 24
        }}>
          <div style={{ minWidth: 320 }}>
            <TabNavigation
              tabs={tabs}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
              className="loan-confirm-tabs"
            />
          </div>
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