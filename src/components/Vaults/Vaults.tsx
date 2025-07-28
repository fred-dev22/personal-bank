// import React from "react";
import { Button, Table, TextCell, MetricCell, TagCell } from "@jbaluch/components";
import { VaultDetails } from "./VaultDetails";
import "./style.css";
import type { Vault, Loan, Borrower, Activity } from '../../types/types';

interface VaultsProps {
  vaults: Vault[];
  loans: Loan[];
  borrowers: Borrower[];
  activities?: Activity[];
  selectedVaultId?: string | null;
  onBackToList?: () => void;
  onSelectVault?: (vaultId: string) => void;
  onShowLoanDetails?: (loanId: string) => void;
  onAddVault?: () => void;
  onAddLoan?: () => void;
}

function getIssues(vault: Vault) {
  const growth = Number(vault.growth_issue_count || 0);
  const income = Number(vault.income_issue_count || 0);
  const ltv = vault.is_ltv_issue_count === 'yes' ? 1 : 0;
  const arbitrary = vault.arbitrary_text ? Number(vault.arbitrary_text) : 0;
  return growth + income + ltv + arbitrary;
}

function getEquityTrend(vault: Vault) {
  if (vault.type === 'Super Vault') {
    if (vault.payment_projection?.summary?.equityIncreasing === 'yes') return 'Increasing';
    return 'Decreasing';
  }
  if (vault.type === 'Cash Vault') return 'n/a';
  return 'n/a';
}

function getAvailable(vault: Vault) {
  if (typeof vault.available_for_lending_amount === 'number') {
    return `$${vault.available_for_lending_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return vault.available_for_lending_amount || '';
}

function getTotalSpread(vault: Vault) {
  if (vault.type === 'Super Vault') {
    if (vault.spread !== undefined && vault.spread !== null && vault.spread !== '') {
      return `${Number(vault.spread).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
    }
    return 'TBD';
  }
  if (vault.liquidity_source && typeof vault.liquidity_source.appreciation === 'number') {
    return `${vault.liquidity_source.appreciation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }
  return 'n/a';
}

export const Vaults: React.FC<VaultsProps> = ({ vaults, loans, borrowers, activities = [], selectedVaultId, onBackToList, onSelectVault, onShowLoanDetails, onAddVault, onAddLoan }) => {
  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Séparation des vaults par type (mock pour l'instant)
  const gateways = vaults.filter(v => v.is_gateway);
  const otherVaults = vaults.filter(v => !v.is_gateway);

  if (selectedVaultId) {
    const vault = vaults.find(v => v.id === selectedVaultId);
    if (vault) {
      return <VaultDetails vault={vault} loans={loans} borrowers={borrowers} activities={activities} onBack={onBackToList || (() => {})} onShowLoanDetails={onShowLoanDetails} onAddLoan={onAddLoan} />;
    }
  }

  return (
    <section className="loans">
      <header className="page-toolbar">
        <div className="title-parent">
          <div className="title">Vaults</div>
          <div className="subtitle">{formattedDate}</div>
        </div>
        <div className="search-filter-action">
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            justified="right"
            onClick={onAddVault}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="primary"
            ariaLabel={undefined}
            aria-label="Add Vault"
            name="add-vault"
            form=""
            className="add-loan-btn"
          >
            Add Vault
          </Button>
        </div>
      </header>
      {/* Gateways Block */}
      <section className="vaults-block">
        <div className="table-title">Gateways</div>
        <Table
          columns={[
            {
              key: 'nickname',
              label: 'Name',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'left',
              getCellProps: (row: Vault) => ({ text: row.is_gateway ? 'Gateway' : row.nickname}),
            },
            {
              key: 'issues',
              label: 'Issues',
              cellComponent: MetricCell,
              width: '100%',
              alignment: 'center',
              getCellProps: (row: Vault) => {
                const issues = getIssues(row);
                return {
                  value: issues,
                  status: issues > 0 ? 'bad' : 'good',
                  style: issues > 0 ? { background: '#5b3122', color: '#FF7F50' } : undefined
                };
              },
            },
            {
              key: 'total_spread',
              label: 'Total Spread',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'center',
              getCellProps: (row: Vault) => ({ text: getTotalSpread(row) }),
            },
            {
              key: 'equity_trend',
              label: 'Equity Trend',
              cellComponent: TagCell,
              width: '100%',
              alignment: 'center',
              getCellProps: (row: Vault) => ({ label: getEquityTrend(row), size: 'small' }),
            },
            {
              key: 'available',
              label: 'Available',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'right',
              getCellProps: (row: Vault) => ({ text: getAvailable(row) }),
            },
          ]}
          data={gateways}
          clickableRows
          onRowClick={(row: Vault) => onSelectVault && onSelectVault(row.id)}
        />
      </section>
      {/* Vaults Block */}
      <section className="vaults-block">
        <div className="table-title">Vaults</div>
        <Table
          columns={[
            {
              key: 'nickname',
              label: 'Name',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'left',
              getCellProps: (row: Vault) => ({ text: row.is_gateway ? 'Gateway' : row.nickname }),
            },
            {
              key: 'issues',
              label: 'Issues',
              cellComponent: MetricCell,
              width: '100%',
              alignment: 'center',
              getCellProps: (row: Vault) => {
                const issues = getIssues(row);
                return {
                  value: issues,
                  status: issues > 0 ? 'bad' : 'good',
                  style: issues > 0 ? { background: '#5b3122', color: '#FF7F50' } : undefined
                };
              },
            },
            {
              key: 'total_spread',
              label: 'Total Spread',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'center',
              getCellProps: (row: Vault) => ({ text: getTotalSpread(row) }),
            },
            {
              key: 'equity_trend',
              label: 'Equity Trend',
              cellComponent: TagCell,
              width: '100%',
              alignment: 'center',
              getCellProps: (row: Vault) => ({ label: getEquityTrend(row), size: 'small' }),
            },
            {
              key: 'available',
              label: 'Available',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'right',
              getCellProps: (row: Vault) => ({ text: getAvailable(row) }),
            },
          ]}
          data={otherVaults}
          clickableRows
          onRowClick={(row: Vault) => onSelectVault && onSelectVault(row.id)}
        />
      </section>
    </section>
  );
};