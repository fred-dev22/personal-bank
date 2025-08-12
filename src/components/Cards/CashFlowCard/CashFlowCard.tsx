import React from "react";
import "./style.css";
import { DottedUnderline } from "../../ui/DottedUnderline";
import { HelpTooltip } from "../../ui/HelpTooltip";

interface CashFlowCardProps {
  amount: number;
  paid: string;
  nextDue: string;
  rate: number;
  balance: number;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({ amount, paid, nextDue, rate, balance }) => {
  return (
    <div className="payment-card">
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
                <div className="label-3">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
              <div className="label-2">
                <HelpTooltip 
                  term="Loan constant" 
                  definition="The loan constant is the percentage of the original loan amount that must be paid annually, including both principal and interest. It represents the total annual payment as a percentage of the loan balance."
                  position="top"
                >
                  <DottedUnderline>Loan constant</DottedUnderline>
                </HelpTooltip>
              </div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{rate.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          <div className="row-5">
            <div className="data-table-row">
              <div className="label-2">
                <HelpTooltip 
                  term="Unpaid" 
                  definition="This is the amount that still needs to be paid to the loan. It is not the payoff amount, which includes interest that will be due at the end of the period."
                  position="top">
                  <DottedUnderline>Unpaid</DottedUnderline>
                </HelpTooltip>
              </div>
            </div>
            <div className="frame-wrapper">
              <div className="label-wrapper">
                <div className="label-3">{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 