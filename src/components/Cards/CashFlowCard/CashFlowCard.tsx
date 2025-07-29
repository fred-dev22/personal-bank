import React from "react";
import "./style.css";

interface CashFlowCardProps {
  amount: number;
  paid: string;
  nextDue: string;
  rate: number;
  balance: number;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({ amount, paid, nextDue, rate, balance }) => {
  return (
    <div className="cash-flow-card">
      <div className="card">
        <div className="frame">
          <div className="title-3">Payment</div>
          <div className="text-wrapper-2">Monthly</div>
        </div>

        <div className="rectangle" />

        <div className="static-table">
          <div className="row">
            <div className="data-table-row">
              <div className="label-2">Amount</div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
              </div>
            </div>
          </div>

          <div className="row-2">
            <div className="data-table-row">
              <div className="label-2">Paid</div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{paid}</div>
              </div>
            </div>
          </div>

          <div className="row-3">
            <div className="data-table-row">
              <div className="label-2">Next due</div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{nextDue}</div>
              </div>
            </div>
          </div>

          <div className="row-4">
            <div className="data-table-row">
              <div className="label-2">Rate</div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{rate.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          <div className="row-5">
            <div className="data-table-row">
              <div className="label-2">Balance</div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 