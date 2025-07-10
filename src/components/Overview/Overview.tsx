import React, { useState, useEffect } from "react";
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
import { Button} from '@jbaluch/components';
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./Overview.css";
import type { Vault } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

type OnboardingStep = 'one' | 'two' | 'three' | 'four' | 'done';

type OverviewProps = {
  vaults: Vault[];
  onAddVault?: () => void;
};

export const Overview: React.FC<OverviewProps> = ({ vaults }) => {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('one');
  const [selectedVaultId, setSelectedVaultId] = useState<string>(vaults[0]?.id || '');
  const { user } = useAuth();

  // Synchronise selectedVaultId avec le premier vault dès que vaults change
  useEffect(() => {
    if (vaults.length > 0) {
      setSelectedVaultId(vaults[0].id);
    }
  }, [vaults]);

  const selectedVault = vaults.find(v => v.id === selectedVaultId) ?? vaults[0];

  // Format current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Callback pour passer à l'étape suivante de l'onboarding
  const handleOnboardingStepChange = (step: string) => {
    if (
      step === 'one' ||
      step === 'two' ||
      step === 'three' ||
      step === 'four' ||
      step === 'done'
    ) {
      setOnboardingStep(step);
    }
  };

  // DEBUG: Affiche le contenu des vaults
  console.log('[DEBUG VAULTS]', vaults);

  return (
    <div className="frame-overview">
      <header className="page-toolbar">
        <div className="page-header">
          <div className="page-header__title">Hello, {user?.firstName || 'User'}</div>
          <div className="page-header__subtitle">{formattedDate}</div>
        </div>
      </header>
      {onboardingStep !== 'done' ? (
        <OnboardingCard step={onboardingStep} onStepChange={handleOnboardingStepChange} />
      ) : (
        <div className="div">
          <div className="upcoming">
            <div className="div-wrapper">
              <div className="text-wrapper" style={{fontWeight: 700, fontSize: 18}}>To Do</div>
            </div>
            <div className="row" style={{display: 'flex', gap: 24}}>
              <div className="overview-actions" style={{background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24, minWidth: 340, flex: 1}}>
                <div className="text-wrapper-2" style={{fontWeight: 600, fontSize: 16, marginBottom: 18}}>Actions</div>
                <div className="div-2" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  {/* Ligne 1 */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{background: '#1AC9A0', color: '#fff', fontWeight: 700, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16}}>2</span>
                    <span style={{fontWeight: 500, fontSize: 15, flex: 1}}>payments to receive</span>
                    <span style={{background: '#F25B5B', color: '#fff', fontWeight: 600, borderRadius: 8, fontSize: 13, padding: '2px 10px', marginRight: 8}}>1 late</span>
                    <Button  style={{ width: 100,height: 32}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="receive" form="" ariaLabel={undefined}>Receive</Button>
                  </div>
                  {/* Ligne 2 */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{background: '#1AC9A0', color: '#fff', fontWeight: 700, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16}}>1</span>
                    <span style={{fontWeight: 500, fontSize: 15, flex: 1}}>loan to fund</span>
                    <Button  style={{ width: 100,height: 32}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="fund" form="" ariaLabel={undefined}>Fund</Button>
                  </div>
                  {/* Ligne 3 */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{background: '#DFDFE6', color: '#7B7B93', fontWeight: 700, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16}}>0</span>
                    <span style={{fontWeight: 500, fontSize: 15, flex: 1, color: '#7B7B93'}}>requests to review</span>
                    <Button style={{ width: 100,height: 32}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="review" form="" ariaLabel={undefined} disabled>Review</Button>
                  </div>
                  {/* Ligne 4 */}
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{background: '#1AC9A0', color: '#fff', fontWeight: 700, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16}}>2</span>
                    <span style={{fontWeight: 500, fontSize: 15, flex: 1}}>amounts to transfer</span>
                    <Button style={{width: 100,height: 32}} type="secondary" iconComponent={undefined} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} name="transfer" form="" ariaLabel={undefined}>Transfer</Button>
                  </div>
                </div>
              </div>
              <div className="upcoming-tasks">
                <div className="top">
                  <div className="title-2">Tasks</div>
                  <div className="icon-button"><div className="add-wrapper"><div className="add" /></div></div>
                </div>
                <div className="text-wrapper-5">Coming soon.</div>
              </div>
            </div>
          </div>
          <div className="vault-summary">
            <div className="div-wrapper">
              <div className="text-wrapper" style={{fontWeight: 700, fontSize: 18, color: '#0d1728'}}>Vaults</div>
            </div>
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
                        margin: '0 16px',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginBottom: 8,
                        minHeight: 48
                      }}
                    >
                      <span style={{flex: 1}}>{vault.nickname || vault.name || '-'}</span>
                      {vault.issues > 0 && (
                        <span style={{color: '#b50007', background: 'transparent', fontWeight: 700, fontSize: 16, marginRight: 16}}>{vault.issues} issues</span>
                      )}
                      <span style={{color: selected ? '#23305e' : '#b5b5b5', fontWeight: 600, fontSize: 16}}>
                        {typeof vault.balance === 'number' ? `$${vault.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Détail du vault sélectionné */}
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
                          {selectedVault.health?.reserves !== undefined ? `$${selectedVault.health.reserves.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};