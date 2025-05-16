import React from "react";
import { Button, Input } from '@jbaluch/components';
// @ts-ignore
import '@jbaluch/components/styles';
import "./OnboardingCard.css";

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
    icon: "✏️",
  },
  {
    key: "two",
    label: "Setup the gateway",
    icon: "🏦",
  },
  {
    key: "three",
    label: "Add your vaults",
    icon: "💼",
  },
  {
    key: "four",
    label: "Upload your loans",
    icon: "🔄",
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
        <div className="onboarding-progress-col">
          <div className="onboarding-progress-title">Bank setup</div>
          <ul className="onboarding-progress-list">
            {steps.map((s, idx) => (
              <li
                key={s.key}
                className={`onboarding-progress-item${idx === currentStepIdx ? ' active' : ''}${idx < currentStepIdx ? ' done' : ''}`}
              >
                <span className="onboarding-progress-icon">{s.icon}</span>
                <span className="onboarding-progress-label">
                  {idx < currentStepIdx ? (
                    <span style={{ textDecoration: 'line-through', color: '#b0b0b0' }}>{s.label}</span>
                  ) : s.label}
                </span>
                {idx < currentStepIdx && <span className="onboarding-progress-check">✔️</span>}
                {idx === currentStepIdx && <span className="onboarding-progress-radio" />}
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