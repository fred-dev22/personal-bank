import React from "react";
import { Button, Input } from '@jbaluch/components';
// @ts-ignore
import '@jbaluch/components/styles';
import "./OnboardingCard.css";
import bankNameIcon from '../../assets/bank-name.svg';
import gatewayIcon from '../../assets/gateway.svg';
import walletIcon from '../../assets/wallet.svg';
import loanIcon from '../../assets/loan.svg';
import doneIcon from '../../assets/done.svg';

export interface OnboardingCardProps {
  step: "one" | "two" | "three" | "four";
  gatewayClassName?: string;
  accountsVaultsClassName?: string;
  leverageLoansClassName?: string;
  onStepChange?: (step: string) => void;
}

const steps = [
  {
    key: "one",
    label: "Name your bank",
    icon: bankNameIcon,
  },
  {
    key: "two",
    label: "Setup the gateway",
    icon: gatewayIcon,
  },
  {
    key: "three",
    label: "Add your vaults",
    icon: walletIcon,
  },
  {
    key: "four",
    label: "Upload your loans",
    icon: loanIcon,
  },
];

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  step,
  onStepChange
}) => {
  const currentStepIdx = steps.findIndex(s => s.key === step);

  const nextStep = () => {
    if (!onStepChange) return;
    if (currentStepIdx === -1) return;
    if (currentStepIdx < steps.length - 1) {
      onStepChange(steps[currentStepIdx + 1].key);
    } else {
      onStepChange('done');
    }
  };

  return (
    <div className="onboarding-card">
      <div className="onboarding-main-row onboarding-frame-row">
        {/* Colonne de progression à gauche */}
        <div className="onboarding-progress-col" style={{ width: 350, minWidth: 350, maxWidth: 350 }}>
          <div className="onboarding-progress-title">Bank setup</div>
          <ul className="onboarding-progress-list">
            {steps.map((s, idx) => (
              <li
                key={s.key}
                className={`onboarding-progress-item${idx === currentStepIdx ? ' active' : ''}${idx < currentStepIdx ? ' done' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 12px',
                  background: idx === currentStepIdx ? '#EEEFF2' : 'transparent',
                  borderRadius: 8,
                  marginBottom: 4
                }}
              >
                <span className="onboarding-progress-icon" style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}>
                  <img src={s.icon} alt="" style={{ width: 20, height: 20 }} />
                </span>
                <span className="onboarding-progress-label" style={{ flex: 1, fontWeight: idx === currentStepIdx ? 700 : 500, color: idx < currentStepIdx ? '#b0b0b0' : '#23263B', textDecoration: idx < currentStepIdx ? 'line-through' : 'none' }}>
                  {s.label}
                </span>
                {idx < currentStepIdx && (
                  <span className="onboarding-progress-check" style={{ marginLeft: 16 }}>
                    <img src={doneIcon} alt="done" style={{ width: 20, height: 20 }} />
                  </span>
                )}
                {(idx === currentStepIdx || idx > currentStepIdx) && (
                  <span style={{ marginLeft: 16, width: 20, height: 20, borderRadius: 10, background: '#DFDFE6', display: 'inline-block' }} />
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Contenu de l'étape à droite */}
        <div className="div onboarding-step-content">
          {step === "one" && (
            <div>
              <div className="step-title">Name your bank</div>
              <div className="step-desc">Give your bank a name. You can change this later under Settings.</div>
              <div className="step-input-container">
                <Input placeholder="bank name" />
                {/*@ts-ignore*/}
                <Button onClick={nextStep}>Next Step</Button>
              </div>
            </div>
          )}
          {step === "two" && (
            <div>
              <div className="step-title">Setup the gateway</div>
              <div className="step-desc">The Gateway is a bank account that acts as the entrance to the bank. All money flows into and out of it. No account yet? No problem, we can proceed as if you do.</div>
              {/*@ts-ignore*/}

              <Button className="step-btn fit-content-btn" onClick={nextStep}>Setup Gateway</Button>
            </div>
          )}
          {step === "three" && (
            <div>
              <div className="step-title">Add your vaults</div>
              <div className="step-desc">A vault is a secure space for both storing and leveraging your money. This allows the same dollars to be in two places at once. You must add a vault before you can add or upload loans.</div>
              {/*@ts-ignore*/}

              <Button className="step-btn fit-content-btn" onClick={() => { }}>Add Vault</Button>
              {/*@ts-ignore*/}

              <Button className="step-btn fit-content-btn" type={"secondary"} onClick={nextStep}>Next Step</Button>
            </div>
          )}
          {step === "four" && (
            <div>
              <div className="step-title">Upload your loans</div>
              <div className="step-desc">Loans make income for your bank. You re-lend the payments to build wealth. Funding loans with the right kind of vault builds it faster.</div>
              {/*@ts-ignore*/}

              <Button className="step-btn fit-content-btn" onClick={() => { }}>Bulk Upload</Button>
              {/*@ts-ignore*/}

              <Button className="step-btn fit-content-btn" type={"secondary"} onClick={() => { }}>Add New Loan</Button>
              {/*@ts-ignore*/}

              <Button className="step-btn fit-content-btn" type={"secondary"} onClick={nextStep}>Finish</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};