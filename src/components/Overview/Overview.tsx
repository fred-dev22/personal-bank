import React, { useState } from "react";
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
import { Button } from '@jbaluch/components';
import '@jbaluch/components/styles';
import "./Overview.css";
import type { Vault } from '../../types/types';

type OnboardingStep = 'one' | 'two' | 'three' | 'four' | 'done';

const vaults = [
  { id: 'vault-abc', name: 'Vault ABC', issues: 2, balance: 15000, financials: { paidIn: 600, paidOut: 10000 }, health: { reserves: 10000, loanToValue: 56, incomeDSCR: 1.4, growthDSCR: 1.43 } },
  { id: 'vault-123', name: 'Vault 123', issues: 1, balance: 12000, financials: { paidIn: 400, paidOut: 8000 }, health: { reserves: 8000, loanToValue: 48, incomeDSCR: 1.2, growthDSCR: 1.3 } },
  { id: 'vault-xyz', name: 'Vault XYZ', issues: 0, balance: 18000, financials: { paidIn: 800, paidOut: 12000 }, health: { reserves: 12000, loanToValue: 64, incomeDSCR: 1.6, growthDSCR: 1.5 } },
  { id: 'gateway', name: 'Gateway', issues: 3, balance: 9000, financials: { paidIn: 300, paidOut: 6000 }, health: { reserves: 6000, loanToValue: 32, incomeDSCR: 1.0, growthDSCR: 1.1 } },
  { id: 'safebox', name: 'SafeBox', issues: 0, balance: 22000, financials: { paidIn: 1000, paidOut: 16000 }, health: { reserves: 16000, loanToValue: 72, incomeDSCR: 2.0, growthDSCR: 1.8 } },
];

export const Overview: React.FC = () => {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('one');
  const [selectedVaultId, setSelectedVaultId] = useState<string>(vaults[0].id);

  const selectedVault = vaults.find(v => v.id === selectedVaultId) ?? vaults[0];

  // Callback pour passer à l'étape suivante de l'onboarding
  const handleOnboardingStepChange = (step: string) => {
    // On sécurise le typage ici
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

  return (
    <div className="frame-overview">
      <div className="page-toolbar">
        <div className="title-parent">
          <div className="title">Hello, John</div>
          <div className="subtitle">Thursday, July 30</div>
        </div>
      </div>
      {onboardingStep !== 'done' ? (
        <OnboardingCard step={onboardingStep} onStepChange={handleOnboardingStepChange} />
      ) : (
        <div className="div">
          <div className="upcoming">
            <div className="div-wrapper">
              <div className="text-wrapper">To Do</div>
            </div>
            <div className="row">
              <div className="overview-actions">
                <div className="text-wrapper-2">Actions</div>
                <div className="div-2">
                  <div className="overview-actions-row">
                    <div className="div-3">
                      <div className="notification-badge"><div className="element">2</div></div>
                      <div className="text-wrapper-3">payments to receive</div>
                      <div className="tag"><div className="label">1 late</div></div>
                    </div>
                    <Button className="button fit-content-btn action-btn" type="secondary" onClick={() => {}}><div className="action-button">Receive</div></Button>
                  </div>
                  <div className="overview-actions-row">
                    <div className="div-3">
                      <div className="notification-badge"><div className="element">1</div></div>
                      <div className="text-wrapper-3">loan to fund</div>
                    </div>
                    <Button className="button fit-content-btn action-btn" type="secondary" onClick={() => {}}><div className="action-button">Fund</div></Button>
                  </div>
                  <div className="overview-actions-row">
                    <div className="div-3">
                      <div className="notification-badge review"><div className="text-wrapper-4">0</div></div>
                      <div className="text-wrapper-3">requests to review</div>
                    </div>
                    <Button className="button fit-content-btn action-btn" type="secondary" disabled onClick={() => {}}><div className="action-button-2">Review</div></Button>
                  </div>
                  <div className="overview-actions-row">
                    <div className="div-3">
                      <div className="notification-badge"><div className="element">2</div></div>
                      <div className="text-wrapper-3">amounts to transfer</div>
                    </div>
                    <Button className="button fit-content-btn action-btn" type="secondary" onClick={() => {}}><div className="action-button-3">Transfer</div></Button>
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
            <div className="title">
              <div className="div">Vaults</div>
            </div>
            <div className="row">
              <div className="vault-financials">
                <div className="table">
                  {vaults.map((vault, idx) => (
                    <div className="vault-card-row-wrapper" key={vault.id}>
                      <div
                        className={
                          (idx === 0 ? "vault-card-row" : "vault-card-row-2") +
                          (selectedVaultId === vault.id ? " selected" : "")
                        }
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedVaultId(vault.id)}
                      >
                        <div className={idx === 0 ? "label-wrapper" : "table-cell-2"}>
                          <div className="label-2">{vault.name}</div>
                        </div>
                        <div className={idx === 0 ? undefined : "table-cell-3"}>
                          <span className={idx === 0 ? "table-cell-instance design-component-instance-node" : "label-4"}>{vault.issues && vault.issues > 0 ? `${vault.issues} issues` : ''}</span>
                        </div>
                        <div className={idx === 0 ? "div-wrapper" : "table-cell-4"}>
                          <div className="label-3">${vault.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', padding: 32, minWidth: 320}}>
                  <div style={{fontWeight: 700, fontSize: 18, marginBottom: 16}}>{selectedVault.name}</div>
                  <div style={{marginBottom: 8}}><b>Issues:</b> {selectedVault.issues}</div>
                  <div style={{marginBottom: 8}}><b>Balance:</b> ${selectedVault.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div style={{marginBottom: 8}}><b>Paid In:</b> ${selectedVault.financials.paidIn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div style={{marginBottom: 8}}><b>Paid Out:</b> ${selectedVault.financials.paidOut.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div style={{marginBottom: 8}}><b>Reserves:</b> ${selectedVault.health.reserves.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div style={{marginBottom: 8}}><b>Loan to Value:</b> {selectedVault.health.loanToValue}%</div>
                  <div style={{marginBottom: 8}}><b>Income DSCR:</b> {selectedVault.health.incomeDSCR.toFixed(2)}</div>
                  <div><b>Growth DSCR:</b> {selectedVault.health.growthDSCR.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};