import React from "react";
import { VaultRow } from "./VaultRow";
import "./style.css";

export const Vaults = (): JSX.Element => {
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

          <VaultRow
            className="vault-row-instance"
            state="default"
            status="bad"
          />
          <div className="div-2">
            <div className="table-cell-3">
              <div className="label-6">Vault 123</div>

              <div className="label-7">Cash vault</div>
            </div>

            <div className="table-cell-4">
              <div className="metric-tag-2">
                <div className="tag-3">
                  <div className="label-8">1.43</div>
                </div>
              </div>
            </div>

            <div className="table-cell-5">
              <div className="label-9">5.04%</div>
            </div>

            <div className="table-cell-6">
              <div className="metric-tag-3">
                <div className="tag-4">
                  <div className="label-10">1.43</div>
                </div>
              </div>
            </div>

            <div className="table-cell-7">
              <div className="label-7">$29,000.00</div>
            </div>

            <div className="table-cell-8">
              <div className="icon-button-2">
                <div className="information-circle-wrapper">
                  <img className="img" alt="Information circle" />
                </div>
              </div>
            </div>
          </div>

          <div className="div-2">
            <div className="table-cell-3">
              <div className="label-6">Vault XYZ</div>

              <div className="label-7">Super vault</div>
            </div>

            <div className="table-cell-6">
              <div className="metric-tag-4">
                <div className="tag-4">
                  <div className="label-10">1.43</div>
                </div>
              </div>
            </div>

            <div className="table-cell-5">
              <div className="label-9">5.04%</div>
            </div>

            <div className="table-cell-6">
              <div className="metric-tag-4">
                <div className="tag-4">
                  <div className="label-10">1.43</div>
                </div>
              </div>
            </div>

            <div className="table-cell-7">
              <div className="label-7">$29,000.00</div>
            </div>

            <div className="table-cell-8">
              <div className="icon-button-2">
                <div className="information-circle-wrapper">
                  <img className="img" alt="Information circle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};