import React, { useState } from "react";
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
import { Button } from '@jbaluch/components';
import '@jbaluch/components/styles';
import "./Overview.css";

export const Overview: React.FC = () => {
  const [onboardingStep, setOnboardingStep] = useState<'one'|'two'|'three'|'four'|'done'>('one');

  // Callback pour passer à l'étape suivante de l'onboarding
  const handleOnboardingStepChange = (step: string) => {
    setOnboardingStep(step as any);
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
                    </div>
                    <div className="tag"><div className="label">1 late</div></div>
                    <Button className="button fit-content-btn" onClick={() => {}}><div className="action-button">Receive</div></Button>
                  </div>
                  <div className="overview-actions-row">
                    <div className="div-3">
                      <div className="notification-badge"><div className="element">1</div></div>
                      <div className="text-wrapper-3">loan to fund</div>
                    </div>
                    <Button className="button fit-content-btn" onClick={() => {}}><div className="action-button">Fund</div></Button>
                  </div>
                  <div className="overview-actions-row-2">
                    <div className="div-3">
                      <div className="notification-badge-2"><div className="text-wrapper-4">0</div></div>
                      <div className="text-wrapper-3">requests to review</div>
                    </div>
                    <Button className="action-button-wrapper fit-content-btn" onClick={() => {}}><div className="action-button-2">Review</div></Button>
                  </div>
                  <div className="overview-actions-row-3">
                    <div className="div-3">
                      <div className="notification-badge"><div className="element">2</div></div>
                      <div className="text-wrapper-3">amounts to transfer</div>
                    </div>
                    <Button className="button fit-content-btn" onClick={() => {}}><div className="action-button-3">Transfer</div></Button>
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
            <div className="div-wrapper"><div className="text-wrapper">Vaults</div></div>
            <div className="row-2">
              <div className="vault-financials">
                <div className="div-2">
                  <div className="vault-card-row-wrapper">
                    <div className="vault-card-row">
                      <div className="table-cell"><div className="label-2">Vault ABC</div></div>
                      <div className="metric-tag-wrapper"><div className="metric-tag"><div className="tag-2"><div className="label">2 issues</div></div></div></div>
                      <div className="table-cell-2"><div className="label-3">$15,000.00</div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="vault-financials-2">
                <Button className="button-2 fit-content-btn" onClick={() => {}}><div className="action-button">Vault ABC</div><div className="arrow-back-ios" /></Button>
                <div className="div-4">
                  <div className="div-5">
                    <div className="text-wrapper-6">Financials</div>
                    <div className="div-6">
                      <div className="div-7"><div className="text-wrapper-3">$600.00</div><div className="text-wrapper-5">June paid in</div></div>
                      <div className="div-7"><div className="text-wrapper-3">$10,000.00</div><div className="text-wrapper-5">June paid out</div></div>
                    </div>
                  </div>
                  <div className="div-8">
                    <div className="text-wrapper-6">Health</div>
                    <div className="div-9">
                      <div className="div-7"><div className="text-wrapper-7">$10,000.00</div><div className="text-wrapper-5">Reserves</div></div>
                      <div className="div-7"><div className="text-wrapper-7">56%</div><div className="text-wrapper-5">Loan to value</div></div>
                      <div className="div-7"><div className="text-wrapper-8">1.40</div><div className="text-wrapper-5">Income DSCR</div></div>
                      <div className="div-7"><div className="text-wrapper-8">1.43</div><div className="text-wrapper-5">Growth DSCR</div></div>
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