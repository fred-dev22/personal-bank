import React from 'react';
import './MonthlyPaymentCard.css';

interface MonthlyPaymentCardProps {
  title: string;
  lineOfCredit: string;
  cashValue: string;
  buttonText: string;
  onApplyClick: () => void;
}

export const MonthlyPaymentCard: React.FC<MonthlyPaymentCardProps> = ({
  title,
  lineOfCredit,
  cashValue,
  buttonText,
  onApplyClick
}) => {
  console.log('MonthlyPaymentCard rendering:', title);
  return (
    <div className="monthly-payment-card">
      <div className="monthly-payment-card-header">
        <h3>{title}</h3>
      </div>
      <div className="monthly-payment-card-content">
        <div className="payment-details">
          <div className="payment-item">
            <span className="payment-label">Line of credit</span>
            <span className="payment-value">{lineOfCredit}</span>
          </div>
          <div className="payment-item">
            <span className="payment-label">Cash value</span>
            <span className="payment-value">{cashValue}</span>
          </div>
        </div>
        <div className="payment-action">
          <button 
            className="apply-button"
            onClick={onApplyClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}; 