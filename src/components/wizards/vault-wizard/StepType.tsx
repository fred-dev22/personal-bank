import React from "react";
import "./StepType.css";

interface StepTypeProps {
  onSelect: (type: string) => void;
  selectedType: string;
  onTypeSelected?: () => void;
}

export const StepType: React.FC<StepTypeProps> = ({ onSelect, selectedType, onTypeSelected }) => {
  const handleSelect = (type: string) => {
    onSelect(type);
    if (onTypeSelected) onTypeSelected();
  };

  return (
    <div className="frame">
      <div className="step-title-instance">
        <div className="design-component-instance-node">Choose a Type</div>
        <div className="step-title-2">Which type of vault are you adding?</div>
      </div>
      <div className="options">
        <div
          className={`selection-button${selectedType === "super" ? " selected" : ""}`}
          onClick={() => handleSelect("super")}
        >
          <div className="wizard-vault-card-row">
            <div className="vault-card-left">
              <div className="vault-card-title">Super</div>
              <div className="vault-card-title">Vault</div>
            </div>
            <div className="vault-card-right">
              <div className="vault-card-desc">
                Advanced vaults that allow your money to be in two places at once while it grows.
              </div>
              <div className="vault-card-examples">
                Examples include permanent life insurance, real estate and closed-end funds.
              </div>
            </div>
          </div>
        </div>
        <div
          className={`selection-button${selectedType === "cash" ? " selected" : ""}`}
          onClick={() => handleSelect("cash")}
        >
          <div className="wizard-vault-card-row">
            <div className="vault-card-left">
              <div className="vault-card-title">Cash</div>
              <div className="vault-card-title">Vault</div>
            </div>
            <div className="vault-card-right">
              <div className="vault-card-desc">
                Simple vaults with the lowest potential for growth. Your money is either lent out or stored here.
              </div>
              <div className="vault-card-examples">
                Examples include checking, savings, money market and high-yield deposit accounts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 