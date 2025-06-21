import React from "react";
import { Button } from '@jbaluch/components';
import "./Transfers.css";

export const Transfers: React.FC = () => {
  return (
    <div className="transfers-section">
      <div className="transfers-header">
        <div className="transfers-title-group">
          <h2 className="transfers-title">Transfers</h2>
          <p className="transfers-date-range">May 1 - May 31, 2024</p>
        </div>
        <Button
          type="secondary"
          icon="iconless"
          interaction="default"
          justified="right"
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          name="view-breakdown"
          form=""
          ariaLabel="View breakdown"
          iconComponent={undefined}
          style={{ width: '180px' }}
        >
          View breakdown
        </Button>
      </div>
      <div className="transfers-card">
        <div className="transfers-card-header">
          <div className="transfers-column-title">Vault</div>
          <div className="transfers-column-title">Transfer to</div>
          <div className="transfers-column-title">Transfer from</div>
        </div>
        <div className="transfers-card-body">
          <div className="coming-soon-message">Coming soon</div>
        </div>
      </div>
    </div>
  );
};
