import React from 'react';
import { Input, PopupButton } from '@jbaluch/components';
import { calculateMonthlyPayment } from '../../../utils/loanUtils';
import { formatCurrency as formatCurrencyGlobal } from '../../../utils/currencyUtils';
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
      <div className="manual-entry__header">
        <h1 className="recast-loan-wizard__title">Change the terms manually</h1>
        <p className="recast-loan-wizard__subtitle">The new payment will be calculated based on these inputs.</p>
      </div>

      <div className="manual-entry__main">
        <div className="manual-entry__form">
          <div className="loan-wizard-form-group">
            <Input
              label="Unpaid Balance"
              value={formatCurrencyGlobal(balance)}
              readOnly
            />
          </div>

          <div className="loan-wizard-form-group">
            <Input
              label="New Rate"
              placeholder="Enter rate"
              required
              type="percentage"
              value={rate.toString()}
              onChange={(value: string) => {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                  onRateChange(numValue);
                }
              }}
            />
          </div>

          <div className="loan-wizard-form-group">
            <Input
              label="Total term in months"
              placeholder="Enter term"
              required
              value={period.toString()}
              onChange={(value: string) => {
                const numValue = parseInt(value);
                if (!isNaN(numValue) && numValue > 0) {
                  onPeriodChange(numValue);
                }
              }}
            />
          </div>

          <div className="loan-wizard-form-group">
            <PopupButton
              defaultValue="Amortized: Due-Date"
              items={[
                {
                  id: 'Amortized: Due-Date',
                  label: 'Amortized: Due-Date'
                },
                {
                  id: 'Interest-only',
                  label: 'Interest-only'
                },
                {
                  id: 'Revolving',
                  label: 'Revolving'
                }
              ]}
              label="Type"
              menuStyle="text"
              onSelect={() => {
                // Type selection logic if needed
              }}
              width="100%"
              menuMaxHeight="200px"
            />
          </div>
        </div>

        <div className="recast-loan-wizard__summary-card">
          <div className="recast-loan-wizard__summary-item">
            <div className="recast-loan-wizard__summary-value">
              ${newPayment.toFixed(2)}
            </div>
            <div className="recast-loan-wizard__summary-label">New Monthly Payment</div>
          </div>
          <div className="recast-loan-wizard__summary-item">
            <div className="recast-loan-wizard__summary-value">
              ${oldPayment.toFixed(2)}
            </div>
            <div className="recast-loan-wizard__summary-label">Old Monthly Payment</div>
          </div>
        </div>
      </div>
    </div>
  );
};
