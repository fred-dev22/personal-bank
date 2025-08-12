import React from "react";
import "./style.css";

interface TermsCardProps {
  amount: number;
  rate: number;
  type: string;
  startDate: string;
  payoffDate: string;
}

export const TermsCard: React.FC<TermsCardProps> = ({ amount, rate, type, startDate, payoffDate }) => {
  return (
    <div className="terms-card">
      <div className="card">
        <div className="frame">
          <div className="frame-2">
            <div className="title-3">Terms</div>
            <div className="text-wrapper-2">Never recasted</div>
          </div>
          <div className="rectangle" />
          <div className="static-table">
            <div className="row">
              <div className="data-table-row">
                <div className="label-2">Amount</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
            <div className="row-2">
              <div className="data-table-row">
                <div className="label-2">Rate</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{rate.toFixed(2)}%</div>
                </div>
              </div>
            </div>
            <div className="row-3">
              <div className="data-table-row">
                <div className="label-2">Type</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{type}</div>
                </div>
              </div>
            </div>
            <div className="row-4">
              <div className="data-table-row">
                <div className="label-2">Start date</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{startDate}</div>
                </div>
              </div>
            </div>
            <div className="row-5">
              <div className="data-table-row">
                <div className="label-2">Payoff date</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{payoffDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 