import React, { useState, useEffect } from "react";
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
import { Button} from '@jbaluch/components';
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./Overview.css";
import type { Vault } from '../../types/types';
import type { OnboardingStep } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

interface OverviewProps {
  vaults: Vault[];
  onAddVault?: () => void;
  onShowGatewayWizard?: () => void;
  onAddLoan?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ vaults, onAddVault, onShowGatewayWizard, onAddLoan }) => {
  const [selectedVaultId, setSelectedVaultId] = useState<string>(vaults[0]?.id || '');
  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();

  // Synchronise selectedVaultId avec le premier vault dès que vaults change
  useEffect(() => {
    if (vaults.length > 0) {
      setSelectedVaultId(vaults[0].id);
    }
  }, [vaults]);

  const selectedVault = vaults.length > 0 ? (vaults.find(v => v.id === selectedVaultId) ?? vaults[0]) : null;

  // Format current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // DEBUG: Affiche le contenu des vaults
  console.log('[DEBUG VAULTS]', vaults);

  // Affichage : si current_pb_onboarding_state n'est pas défini ou n'est pas dans la liste, on affiche l'overview direct
  const showOnboarding = current_pb_onboarding_state && [
    'bank-name',
    'setup-gateway',
    'add-vault',
    'add-loan',
  ].includes(current_pb_onboarding_state);

  return (
    <div className="frame-overview">
      <header className="page-toolbar">
        <div className="page-header">
          <div className="page-header__title">Hello, {user?.firstName || 'User'}</div>
          <div className="page-header__subtitle">{formattedDate}</div>
        </div>
      </header>
      {showOnboarding ? (
        <OnboardingCard
          step={current_pb_onboarding_state as OnboardingStep}
          onStepChange={(step: string) => setCurrentPbOnboardingState(step)}
          onAddVault={onAddVault}
          onShowGatewayWizard={onShowGatewayWizard}
          onAddLoan={onAddLoan}
        />
      ) : (
        <div className="div">
          <div className="to-do-section" style={{width: '100%'}}>
            {/* Header */}
            <div style={{marginBottom: 24}}>
              <h2 style={{fontWeight: 700, fontSize: 18, color: '#0d1728', margin: 0}}>To Do</h2>
            </div>
            
            {/* Cards Container */}
            <div style={{display: 'flex', gap: 24, width: '100%'}}>
              {/* Actions Card */}
              <div style={{
                background: '#fff', 
                borderRadius: 16, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                padding: 24,
                flex: 1,
                width: '50%'
              }}>
                <h3 style={{fontWeight: 600, fontSize: 16, color: '#0d1728', margin: '0 0 20px 0'}}>Actions</h3>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  {/* payments to receive */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{
                      background: '#DFDFE6', 
                      color: '#7B7B93', 
                      fontWeight: 700, 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 12,
                      flexShrink: 0
                    }}>0</span>
                    <span style={{fontWeight: 400, fontSize: 16, color: '#0d1728', flex: 1}}>payments to receive</span>
                    <Button style={{width: 100, height: 32, fontSize: 14}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="receive" form="" ariaLabel={undefined}>Receive</Button>
                  </div>

                  {/* loan to fund */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{
                      background: '#1AC9A0', 
                      color: '#fff', 
                      fontWeight: 700, 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 12,
                      flexShrink: 0
                    }}>1</span>
                    <span style={{fontWeight: 400, fontSize: 16, color: '#0d1728', flex: 1}}>loan to fund</span>
                    <Button style={{width: 100, height: 32, fontSize: 14}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="fund" form="" ariaLabel={undefined}>Fund</Button>
                  </div>

                  {/* requests to review */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{
                      background: '#DFDFE6', 
                      color: '#7B7B93', 
                      fontWeight: 700, 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 12,
                      flexShrink: 0
                    }}>0</span>
                    <span style={{fontWeight: 400, fontSize: 16, color: '#7B7B93', flex: 1}}>requests to review</span>
                    <Button style={{width: 100, height: 32, fontSize: 14}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="review" form="" ariaLabel={undefined} disabled>Review</Button>
                  </div>

                  {/* amounts to transfer */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{
                      background: '#DFDFE6', 
                      color: '#7B7B93', 
                      fontWeight: 700, 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 12,
                      flexShrink: 0
                    }}>0</span>
                    <span style={{fontWeight: 400, fontSize: 16, color: '#7B7B93', flex: 1}}>amounts to transfer</span>
                    <Button style={{width: 100, height: 32, fontSize: 14}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="transfer" form="" ariaLabel={undefined} disabled>Transfer</Button>
                  </div>
                </div>
              </div>

              {/* Tasks Card */}
              <div style={{
                background: '#fff', 
                borderRadius: 16, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                padding: 24,
                flex: 1,
                width: '50%'
              }}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                  <h3 style={{fontWeight: 600, fontSize: 16, color: '#0d1728', margin: 0}}>Tasks</h3>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 16,
                    color: '#666'
                  }}>+</div>
                </div>
                <div style={{color: '#999', fontSize: 14, textAlign: 'center'}}>Coming soon.</div>
              </div>
            </div>
          </div>
          <div className="vault-summary">
            <div className="div-wrapper">
              <div className="text-wrapper" style={{fontWeight: 700, fontSize: 18, color: '#0d1728'}}>Vaults</div>
            </div>
            {vaults.length > 0 ? (
            <div className="vault-summary-block">
              {/* Liste des vaults */}
              <div style={{width:500, background: '#fff', borderRadius: 12, padding: '16px 0', display: 'flex', flexDirection: 'column'}}>
                {vaults.map(vault => {
                  const selected = vault.id === selectedVaultId;
                  return (
                    <div
                      key={vault.id}
                      className="vault-list-row"
                      onClick={() => setSelectedVaultId(vault.id)}
                      style={{
                        background: selected ? '#e8edf7' : 'transparent',
                        color: selected ? '#23305e' : '#232b3a',
                        fontWeight: selected ? 700 : 500,
                        borderRadius: 12,
                        padding: '16px 24px',
                          margin: '0 12px 8px 12px',
                          cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                      }}
                    >
                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                          <span style={{fontSize: 16}}>{vault.nickname || vault.name || 'Unnamed Vault'}</span>
                      {vault.issues > 0 && (
                            <span style={{color: '#b50007', fontWeight: 700, fontSize: 14}}>
                              {vault.issues}
                            </span>
                          )}
                        </div>
                        <div style={{fontSize: 16, fontWeight: 600}}>
                          ${vault.balance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                        </div>
                    </div>
                  );
                })}
              </div>
              {/* Détail du vault sélectionné */}
                {selectedVault ? (
              <div className="vault-summary-details">
                <div style={{width: '100%'}}>
                  {/* Header vault name */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32}}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 24px',
                      borderRadius: 20,
                      border: '1.5px solid #b5b5b5',
                      background: '#fff',
                      color: '#23305e',
                      fontWeight: 600,
                      fontSize: 17,
                      minWidth: 0,
                      width: 'fit-content',
                    }}>{selectedVault.nickname || selectedVault.name || '-'}</span>
                  </div>
                  {/* Financials */}
                  <div style={{marginBottom: 40}}>
                    <div style={{fontWeight: 600, color: '#0d1728', marginBottom: 12, fontSize: 17}}>Financials</div>
                    <div style={{display: 'flex', gap: 48}}>
                      <div>
                        <div style={{fontWeight: 600, color: '#23305e', fontSize: 16}}>
                          {selectedVault.financials?.paidIn !== undefined ? `$${selectedVault.financials.paidIn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                        </div>
                        <div style={{color: '#b5b5b5', fontSize: 14}}>June paid in</div>
                      </div>
                      <div>
                        <div style={{fontWeight: 600, color: '#23305e', fontSize: 16}}>
                          {selectedVault.financials?.paidOut !== undefined ? `$${selectedVault.financials.paidOut.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                        </div>
                        <div style={{color: '#b5b5b5', fontSize: 14}}>June paid out</div>
                      </div>
                    </div>
                  </div>
                  {/* Health */}
                  <div>
                    <div style={{fontWeight: 600, color: '#0d1728', marginBottom: 12, fontSize: 17}}>Health</div>
                    <div style={{display: 'flex', gap: 48}}>
                      <div>
                        <div style={{fontWeight: 600, color: '#00b894', fontSize: 16}}>
                              {selectedVault.health?.reserves !== undefined ? `${selectedVault.health.reserves}%` : '-'}
                        </div>
                        <div style={{color: '#b5b5b5', fontSize: 14}}>Reserves</div>
                      </div>
                      <div>
                        <div style={{fontWeight: 600, color: '#00baff', fontSize: 16}}>
                          {selectedVault.health?.loanToValue !== undefined ? `${selectedVault.health.loanToValue}%` : '-'}
                        </div>
                        <div style={{color: '#b5b5b5', fontSize: 14}}>Loan to value</div>
                      </div>
                      <div>
                        <div style={{fontWeight: 600, color: '#b50007', fontSize: 16}}>
                          {selectedVault.health?.incomeDSCR !== undefined ? selectedVault.health.incomeDSCR : '-'}
                        </div>
                        <div style={{color: '#b5b5b5', fontSize: 14}}>Income DSCR</div>
                      </div>
                      <div>
                        <div style={{fontWeight: 600, color: '#b50007', fontSize: 16}}>
                          {selectedVault.health?.growthDSCR !== undefined ? selectedVault.health.growthDSCR : '-'}
                        </div>
                        <div style={{color: '#b5b5b5', fontSize: 14}}>Growth DSCR</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                ) : (
                  <div className="vault-summary-details" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 40,
                    color: '#666'
                  }}>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: 16, marginBottom: 8}}>No vault selected</div>
                      <div style={{fontSize: 14}}>Select a vault to view details</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: '#fff', 
                borderRadius: 12, 
                padding: 40, 
                textAlign: 'center',
                color: '#666'
              }}>
                <div style={{fontSize: 16, marginBottom: 8}}>No vaults available</div>
                <div style={{fontSize: 14}}>Create your first vault to get started</div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};