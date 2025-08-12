import React from "react";
import "./VaultFinancials.css";
import checkIcon from "../../../assets/Wavy_Check.svg";
import { HelpTooltip } from "../../ui/HelpTooltip";

export interface VaultFinancialsProps {
  balance: number;
  held: number;
  reserve: number;
  pending: number;
  available: number;
  balanceLabel?: string; // Label personnalisé pour le balance
}

export const VaultFinancials: React.FC<VaultFinancialsProps> = ({
  balance,
  held,
  reserve,
  pending,
  available,
  balanceLabel = "Balance", // Valeur par défaut
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="funds-section">
      <div className="funds-header">
        <div className="funds-title">Funds</div>
      </div>

      <div className="vault-financials-card">
        <div className="vault-financials-content">
          <div className="financials-top">
            <div className="financials-main-info">
              <div className="amount-display">
                <img
                  src={checkIcon}
                  alt="Available"
                  className="checkmark-icon"
                />
                <div className="main-amount">{formatCurrency(available)}</div>
              </div>
              <div className="amount-label">Available to lend</div>
            </div>
          </div>

          <div className="divider" />

          <div className="financials-body">
            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot balance-dot" />
                <HelpTooltip 
                  term="Balance" 
                  definition="Balance is the current amount of money in your vault, reflecting all credits and debits. It includes the amounts set aside as reserves and holds, as well as the available funds after accounting for all transactions."
                  position="top"
                >
                  <div className="row-label">{balanceLabel}</div>
                </HelpTooltip>
              </div>
              <div className="row-value">{formatCurrency(balance)}</div>
            </div>

            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot hold-dot" />
                <HelpTooltip 
                  term="Hold" 
                  definition="A hold is money that can't be lent. You might set it to keep a minimum balance. Or, you might set it to preserve some liquidity for another strategy."
                  position="top"
                >
                  <div className="row-label row-label-dashed">Hold</div>
                </HelpTooltip>
              </div>
              <div className="row-value">-{formatCurrency(held)}</div>
            </div>

            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot reserve-dot" />
                <HelpTooltip 
                  term="Safety buffer" 
                  definition="A safety buffer is extra cash. It helps you cover the unexpected. For example, you might use it to cover the debt service of another line of credit. You are using some of this vault's liquidity as a safety buffer."
                  position="top"
                >
                  <div className="row-label row-label-dashed">Reserve</div>
                </HelpTooltip>
              </div>
              <div className="row-value">-{formatCurrency(reserve)}</div>
            </div>

            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot pending-dot" />
                <HelpTooltip 
                  term="Loan funding" 
                  definition="is the process of transferring approved loan funds to the borrower. The pending loan funding is the amount that still needs to be transferred to the borrower."
                  position="top"
                >
                  <div className="row-label row-label-dashed">Pending loan funding</div>
                </HelpTooltip>
              </div>
              <div className="row-value">-{formatCurrency(pending)}</div>
            </div>

            <div className="financials-row total-row">
              <div className="row-left">
                <div className="indicator-dot available-dot" />
                <div className="row-label">Available to lend</div>
              </div>
              <div className="row-value total-value">
                {formatCurrency(available)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
