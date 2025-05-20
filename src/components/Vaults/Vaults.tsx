import React from "react";
import { VaultRow } from "./VaultRow";
import "./style.css";
import type { Vault } from "../../types/types";

const vaultsData: Vault[] = [
  {
    id: "v1",
    name: "Vault 123",
    balance: 29000.00,
    issues: 1,
    financials: {
      paidIn: 35000.00,
      paidOut: 6000.00
    },
    health: {
      reserves: 29000.00,
      loanToValue: 0.65,
      incomeDSCR: 1.43,
      growthDSCR: 1.43
    }
  },
  {
    id: "v2",
    name: "Vault XYZ",
    balance: 45000.00,
    issues: 2,
    financials: {
      paidIn: 50000.00,
      paidOut: 5000.00
    },
    health: {
      reserves: 45000.00,
      loanToValue: 0.55,
      incomeDSCR: 1.65,
      growthDSCR: 1.75
    }
  },
  {
    id: "v3",
    name: "Vault ABC",
    balance: 15000.00,
    issues: 0,
    financials: {
      paidIn: 20000.00,
      paidOut: 5000.00
    },
    health: {
      reserves: 15000.00,
      loanToValue: 0.45,
      incomeDSCR: 1.85,
      growthDSCR: 1.95
    }
  },
  {
    id: "v4",
    name: "Vault DEF",
    balance: 75000.00,
    issues: 3,
    financials: {
      paidIn: 80000.00,
      paidOut: 5000.00
    },
    health: {
      reserves: 75000.00,
      loanToValue: 0.75,
      incomeDSCR: 1.25,
      growthDSCR: 1.35
    }
  },
  {
    id: "v5",
    name: "Vault GHI",
    balance: 35000.00,
    issues: 1,
    financials: {
      paidIn: 40000.00,
      paidOut: 5000.00
    },
    health: {
      reserves: 35000.00,
      loanToValue: 0.60,
      incomeDSCR: 1.50,
      growthDSCR: 1.60
    }
  }
];

export const Vaults: React.FC = () => {
  return (
    <div className="center-stage">
      <div className="header">
        <div className="top">
          <div className="frame">
            <div className="text-wrapper-2">Vaults</div>
          </div>

          <div className="text-wrapper-3">Thursday, June 13</div>
        </div>

        <div className="edit-loan-wrapper">
          <div className="edit-loan">
            <div className="action-button">Add Vault</div>
          </div>
        </div>
      </div>

      <div className="gateways">
        <div className="text-wrapper-4">Gateways</div>

        <div className="vault-table">
          <div className="div-2">
            <div className="table-header-row">
              <div className="label-4">Name</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Issues</div>
            </div>

            <div className="table-header-row-2">
              <div className="label-5">Total Spread</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Equity Trend</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Available</div>
            </div>

            <div className="table-header-row-3" />
          </div>

          <VaultRow
            className="vault-row-instance"
            state="default"
            status="good"
          />
        </div>
      </div>

      <div className="vaults">
        <div className="text-wrapper-4">Vaults</div>

        <div className="vault-table">
          <div className="div-2">
            <div className="table-header-row">
              <div className="label-4">Name</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Issues</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Total Spread</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Equity Trend</div>
            </div>

            <div className="table-header-row">
              <div className="label-4">Available</div>
            </div>

            <div className="table-header-row-3" />
          </div>

          {vaultsData.map((vault) => (
            <div key={vault.id} className="div-2">
              <div className="table-cell-3">
                <div className="label-6">{vault.name}</div>
                <div className="label-7">Cash vault</div>
              </div>

              <div className="table-cell-4">
                <div className={`metric-tag-${vault.issues ? '2' : '4'}`}>
                  <div className={`tag-${vault.issues ? '3' : '4'}`}>
                    <div className={`label-${vault.issues ? '8' : '10'}`}>
                      {vault.issues || '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-cell-5">
                <div className="label-9">
                  {(vault.health.incomeDSCR * 100).toFixed(2)}%
                </div>
              </div>

              <div className="table-cell-6">
                <div className={`metric-tag-${vault.issues ? '3' : '4'}`}>
                  <div className="tag-4">
                    <div className="label-10">
                      {vault.health.growthDSCR.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-cell-7">
                <div className="label-7">
                  ${vault.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>

              <div className="table-cell-8">
                <div className="icon-button-2">
                  <div className="information-circle-wrapper">
                    <img className="img" alt="Information circle" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};