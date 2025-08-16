import React from 'react';
import { Input } from '@jbaluch/components';
import { calculateMonthlyPayment } from '../../../utils/loanUtils';
import './ManualEntry.css';

interface ManualEntryProps {
  balance: number;
  rate: number;
  period: number;
  oldPayment: number;
  onRateChange: (rate: number) => void;
  onPeriodChange: (period: number) => void;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({
  balance,
  rate,
  period,
  oldPayment,
  onRateChange,
  onPeriodChange
}) => {
  const newPayment = calculateMonthlyPayment(balance, period, rate / 100);

  return (
    <div className="manual-entry">
      <div className="manual-entry__section">
        <h2>Change the terms manually</h2>
        <p>The new payment will be calculated based on these inputs.</p>
      </div>

      <div className="manual-entry__main">
        <div className="manual-entry__form">
          <div className="form-group">
            <label className="form-label">Unpaid Balance</label>
            <Input
              value={`$${balance.toFixed(2)}`}
              readOnly
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              New Rate <span className="required">*</span>
            </label>
            <Input
              value={rate.toFixed(2)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 100) {
                  onRateChange(value);
                }
              }}
              suffix="%"
              type="number"
              step="0.01"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Total term in months <span className="required">*</span>
            </label>
            <Input
              value={period.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0) {
                  onPeriodChange(value);
                }
              }}
              type="number"
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="select-wrapper">
              <select className="form-select" defaultValue="amortized">
                <option value="amortized">Amortized: Due-Date</option>
                <option value="interest-only">Interest Only</option>
                <option value="balloon">Balloon Payment</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>
        </div>

        <div className="manual-entry__summary">
          <div className="payment-summary">
            <div className="payment-summary__new">
              <div className="payment-summary__amount">${newPayment.toFixed(2)}</div>
              <div className="payment-summary__label">New Monthly Payment</div>
            </div>
            <div className="payment-summary__old">
              <div className="payment-summary__amount">${oldPayment.toFixed(2)}</div>
              <div className="payment-summary__label">Old Monthly Payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
