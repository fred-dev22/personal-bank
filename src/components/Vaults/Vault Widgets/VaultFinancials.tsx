import React from "react";
import "./VaultFinancials.css";
import checkIcon from "../../../assets/Wavy_Check.svg";

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
                <div className="row-label">{balanceLabel}</div>
              </div>
              <div className="row-value">{formatCurrency(balance)}</div>
            </div>

            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot hold-dot" />
                <div className="row-label row-label-dashed">Hold</div>
              </div>
              <div className="row-value">-{formatCurrency(held)}</div>
            </div>

            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot reserve-dot" />
                <div className="row-label row-label-dashed">Reserve</div>
              </div>
              <div className="row-value">-{formatCurrency(reserve)}</div>
            </div>

            <div className="financials-row">
              <div className="row-left">
                <div className="indicator-dot pending-dot" />
                <div className="row-label row-label-dashed">Pending loan funding</div>
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
