import React from "react";
import "./VaultFinancials.css";

export interface VaultFinancialsProps {
  balance: number;
  held: number;
  reserve: number;
  pending: number;
  available: number;
}

export const VaultFinancials: React.FC<VaultFinancialsProps> = ({
  balance,
  held,
  reserve,
  pending,
  available
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="funds-section">
      <h2 className="funds-title">Funds</h2>
      <div className="funds-widget">
        <div className="funds-header">
          <div className="funds-amount">{formatCurrency(available)}</div>
          <div className="funds-label">Available to lend</div>
        </div>
        <div className="funds-table">
          <div className="funds-row">
            <div className="funds-left">
              <span className="funds-dot balance" />
              <span className="funds-name">Balance</span>
            </div>
            <span className="funds-value">{formatCurrency(balance)}</span>
          </div>
          <div className="funds-row">
            <div className="funds-left">
              <span className="funds-dot held" />
              <span className="funds-name">Hold</span>
            </div>
            <span className="funds-value">-{formatCurrency(held)}</span>
          </div>
          <div className="funds-row">
            <div className="funds-left">
              <span className="funds-dot reserve" />
              <span className="funds-name">Reserve</span>
            </div>
            <span className="funds-value">-{formatCurrency(reserve)}</span>
          </div>
          <div className="funds-row">
            <div className="funds-left">
              <span className="funds-dot pending" />
              <span className="funds-name">Pending loan funding</span>
            </div>
            <span className="funds-value">-{formatCurrency(pending)}</span>
          </div>
          <div className="funds-row">
            <div className="funds-left">
              <span className="funds-dot available" />
              <span className="funds-name">Available to lend</span>
            </div>
            <span className="funds-value">{formatCurrency(available)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 