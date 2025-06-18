import React from "react";
import { Button } from '@jbaluch/components';
import "./Transfers.css";

export const Transfers: React.FC = () => {
  return (
    <div>
      <div className="transfers-header">
        <div className="transfers-left">
          <div className="transfers-title">Transfers</div>
          <div className="transfers-date">May 1 - May 31, 2024</div>
        </div>
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="right"
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="view-breakdown"
          form=""
          ariaLabel="View breakdown"
          style={{ width: '150px' }}
        >
          View breakdown
        </Button>
      </div>
      <div className="transfers-content">
        <div className="transfers-column">
          <div className="transfers-column-header">Vault</div>
          <div className="transfers-placeholder">Coming soon</div>
        </div>
        <div className="transfers-column">
          <div className="transfers-column-header">Transfer to</div>
          <div className="transfers-placeholder">Coming soon</div>
        </div>
        <div className="transfers-column">
          <div className="transfers-column-header">Transfer from</div>
          <div className="transfers-placeholder">Coming soon</div>
        </div>
      </div>
    </div>
  );
}; 