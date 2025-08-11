import React, { useState } from "react";
import { Button, Input } from '@jbaluch/components';
// @ts-expect-error - Styles import required for component styling
import '@jbaluch/components/styles';
import "./OnboardingCard.css";
import bankNameIcon from '../../assets/bank-name.svg';
import gatewayIcon from '../../assets/gateway.svg';
import walletIcon from '../../assets/wallet.svg';
import loanIcon from '../../assets/loan.svg';
import doneIcon from '../../assets/done.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useActivity } from '../../contexts/ActivityContext';
import { createBank } from '../../controllers/bankController';
import { updateUser } from '../../controllers/userController';
import { addBorrower } from '../../controllers/borrowerController';
import type { BankCreateInput, UserUpdateInput } from '../../types/types';

export interface OnboardingCardProps {
  step: 'bank-name' | 'setup-gateway' | 'add-vault' | 'add-loan' | 'done';
  gatewayClassName?: string;
  accountsVaultsClassName?: string;
  leverageLoansClassName?: string;
  onStepChange?: (step: string) => void;
  onAddVault?: () => void;
  onShowGatewayWizard?: () => void;
  onGatewayCreated?: (bankId: string) => void;
  onAddLoan?: () => void;
}

const steps = [
  {
    key: "bank-name",
    label: "Name your bank",
    icon: bankNameIcon,
  },
  {
    key: "setup-gateway",
    label: "Setup the gateway",
    icon: gatewayIcon,
  },
  {
    key: "add-vault",
    label: "Add your vaults",
    icon: walletIcon,
  },
  {
    key: "add-loan",
    label: "Upload your loans",
    icon: loanIcon,
  }
];

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  step,
  onStepChange,
  onAddVault,
  onShowGatewayWizard,
  onGatewayCreated,
  onAddLoan
}) => {
  const currentStepIdx = steps.findIndex(s => s.key === step);
  const { user } = useAuth();
  const { showActivity, hideActivity } = useActivity();
  const [bankName, setBankName] = useState('');


  const handleBankNameChange = (value: string) => {
    setBankName(value);
  };

  const handleNextStep = async () => {
    if (!user) return;
    showActivity('Creating bank...');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');
      
      // 1. Create the bank
      const bankData: BankCreateInput = {
        name: bankName,
        user_id: user.id,
        onboarding_state: 'setup-gateway',
      } as BankCreateInput & { onboarding_state: string };
      const newBank = await createBank(token, bankData);
      
      // 2. Create the first borrower with user's information
      const borrowerData = {
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone_number: '', // Pas disponible sur User, laisser vide
        annual_income: 0, // Pas disponible sur User, laisser à 0
        // Utiliser les propriétés disponibles sur User
      };
      await addBorrower(token, newBank.id, borrowerData);
      
      // 3. Update the user
      const updatedBanks = Array.isArray(user.banks) ? [...user.banks, newBank.id] : [newBank.id];
      const userUpdate: UserUpdateInput = {
        current_pb: newBank.id,
        banks: updatedBanks
      };
      await updateUser(token, user.id, userUpdate);
      
      hideActivity();
      if (onStepChange) onStepChange('setup-gateway');
      if (onGatewayCreated) onGatewayCreated(newBank.id);
    } catch (err) {
      hideActivity();
      showActivity((err as Error).message || 'An error occurred');
    }
  };

  const handleAddVaultClick = () => {
    if (onAddVault) onAddVault();
  };

  const nextStep = async () => {
    if (!onStepChange) return;
    if (currentStepIdx === -1) return;
    if (currentStepIdx < steps.length - 1) {
      if (step === 'setup-gateway') {
        if (onShowGatewayWizard) onShowGatewayWizard();
        return;
      }
      onStepChange(steps[currentStepIdx + 1].key);
    } else {
      onStepChange('done');
    }
  };

  return (
    <>
      <div className="onboarding-card">
        <div className="onboarding-main-row onboarding-frame-row">
          {/* Progress column */}
          <div className="onboarding-progress-col">
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
                    marginBottom: 4,
                    minWidth: 0, // Allow shrinking
                    width: '100%'
                  }}
                >
                  <span className="onboarding-progress-icon" style={{ marginRight: 16, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img src={s.icon} alt="" style={{ width: 20, height: 20 }} />
                  </span>
                  <span className="onboarding-progress-label" style={{ flex: 1, fontWeight: idx === currentStepIdx ? 700 : 500, color: idx < currentStepIdx ? '#b0b0b0' : '#23263B', textDecoration: idx < currentStepIdx ? 'line-through' : 'none', minWidth: 0, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {s.label}
                  </span>
                  {idx < currentStepIdx && (
                    <span className="onboarding-progress-check" style={{ marginLeft: 16, flexShrink: 0 }}>
                      <img src={doneIcon} alt="done" style={{ width: 20, height: 20 }} />
                    </span>
                  )}
                  {(idx === currentStepIdx || idx > currentStepIdx) && (
                    <span style={{ marginLeft: 16, width: 20, height: 20, borderRadius: 10, background: '#DFDFE6', display: 'inline-block', flexShrink: 0 }} />
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Step content */}
          <div className="onboarding-step-content">
            {step === 'bank-name' && (
              <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <div className="step-title">Name your bank</div>
                <div className="step-desc">Give your bank a name. You can change this later under Settings.</div>
                <div className="step-input-button-container">
                  <Input placeholder="bank name" value={bankName} onChange={handleBankNameChange} />
                  <Button
                    className="step-btn fit-content-btn"
                    icon="iconless"
                    iconComponent={undefined}
                    interaction="default"
                    justified="center"
                    name="next-step"
                    form=""
                    ariaLabel="Next Step"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    type="primary"
                    onClick={handleNextStep}
                    disabled={!bankName}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}
            {step === 'setup-gateway' && (
              <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <div className="step-title">Setup the gateway</div>
                <div className="step-desc">The Gateway is a bank account that acts as the entrance to the bank. All money flows into and out of it. No account yet? No problem, we can proceed as if you do.</div>
                <Button
                  className="step-btn fit-content-btn"
                  icon="iconless"
                  iconComponent={undefined}
                  interaction="default"
                  justified="center"
                  name="setup-gateway"
                  form=""
                  ariaLabel="Setup Gateway"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="primary"
                  onClick={onShowGatewayWizard}
                >
                  Setup Gateway
                </Button>
              </div>
            )}
            {step === 'add-vault' && (
              <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <div className="step-title">Add your vaults</div>
                <div className="step-desc">A vault is a secure space for both storing and leveraging your money. This allows the same dollars to be in two places at once. You must add a vault before you can add or upload loans.</div>
                <Button
                  className="step-btn fit-content-btn"
                  icon="iconless"
                  iconComponent={undefined}
                  interaction="default"
                  justified="center"
                  name="add-vault"
                  form=""
                  ariaLabel="Add Vault"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="primary"
                  onClick={handleAddVaultClick}
                >
                  Add Vault
                </Button>
                <Button
                  className="step-btn fit-content-btn"
                  icon="iconless"
                  iconComponent={undefined}
                  interaction="default"
                  justified="center"
                  name="next-step"
                  form=""
                  ariaLabel="Next Step"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="secondary"
                  onClick={nextStep}
                >
                  Next Step
                </Button>
              </div>
            )}
            {step === 'add-loan' && (
              <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <div className="step-title">Upload your loans</div>
                <div className="step-desc">Loans make income for your bank. You re-lend the payments to build wealth. Funding loans with the right kind of vault builds it faster.</div>
                <Button
                  className="step-btn fit-content-btn"
                  icon="iconless"
                  iconComponent={undefined}
                  interaction="default"
                  justified="center"
                  name="bulk-upload"
                  form=""
                  ariaLabel="Bulk Upload"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="primary"
                  onClick={() => { }}
                >
                  Bulk Upload
                </Button>
                <Button
                  className="step-btn fit-content-btn"
                  icon="iconless"
                  iconComponent={undefined}
                  interaction="default"
                  justified="center"
                  name="add-new-loan"
                  form=""
                  ariaLabel="Add New Loan"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="secondary"
                  onClick={onAddLoan}
                >
                  Add New Loan
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};