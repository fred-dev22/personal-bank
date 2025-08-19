import React from 'react';
import { calculateMonthlyPayment } from '../../../utils/loanUtils';
import './PaymentTable.css';

interface PaymentTableProps {
  balance: number;
  selectedRate: number;
  selectedPeriod: number;
  onSelectionChange: (rate: number, period: number) => void;
}

const rates = [5, 6, 7, 8, 9, 10];
const periods = [12, 18, 24, 30, 36, 48];

export const PaymentTable: React.FC<PaymentTableProps> = ({
  balance,
  selectedRate,
  selectedPeriod,
  onSelectionChange
}) => {
  const calculatePayment = (rate: number, period: number) => {
    return calculateMonthlyPayment(balance, period, rate / 100);
  };

  const isSelected = (rate: number, period: number) => {
    return rate === selectedRate && period === selectedPeriod;
  };

  return (
    <div className="payment-table">
      <div className="payment-table__header">
        <div className="payment-table__period-label">
          <div>
            <div>Period (months) ↓</div>
            <div>Rate →</div>
          </div>
        </div>
        {rates.map(rate => (
          <div key={rate} className="payment-table__rate-header">
            {rate}%
          </div>
        ))}
      </div>

      <div className="payment-table__body">
        {periods.map(period => (
          <div key={period} className="payment-table__row">
            <div className="payment-table__period-cell">
              {period}
            </div>
            {rates.map(rate => {
              const payment = calculatePayment(rate, period);
              const selected = isSelected(rate, period);
              
              return (
                <div
                  key={`${period}-${rate}`}
                  className={`payment-table__cell ${selected ? 'payment-table__cell--selected' : ''}`}
                  onClick={() => onSelectionChange(rate, period)}
                >
                  ${payment.toFixed(2)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
