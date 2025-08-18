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
  onVaultUpdate?: (updatedVault: Vault) => void;
  onEditVault?: (vault: Vault) => void;
}

function getIssues(vault: Vault) {
  const growth = Number(vault.growth_issue_count || 0);
  const income = Number(vault.income_issue_count || 0);
  const ltv = vault.is_ltv_issue_count === 'yes' ? 1 : 0;
  const arbitrary = vault.arbitrary_text ? Number(vault.arbitrary_text) : 0;
  return growth + income + ltv + arbitrary;
}

function getEquityTrend(vault: Vault) {
  if (vault.type === 'super vault') {
    if (vault.payment_projection?.summary?.equityIncreasing) return 'Increasing';
    return 'Decreasing';
  }
  if (vault.type === 'cash vault') return 'n/a';
  return 'n/a';
}

function getAvailable(vault: Vault) {
  if (typeof vault.available_for_lending_amount === 'number') {
    return `$${vault.available_for_lending_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return vault.available_for_lending_amount || '';
}

function getTotalSpread(vault: Vault) {
  if (vault.type === 'super vault') {
    if (vault.spread !== undefined && vault.spread !== null && vault.spread !== '') {
      return `${Number(vault.spread).toFixed(2)}%`;
    }
    return 'TBD';
  }
  if (vault.liquidity_source && typeof vault.liquidity_source.appreciation === 'number') {
    return `${vault.liquidity_source.appreciation.toFixed(2)}%`;
  }
  return 'n/a';
}

export const Vaults: React.FC<VaultsProps> = ({ vaults, loans, borrowers, activities = [], selectedVaultId, onBackToList, onSelectVault, onShowLoanDetails, onAddVault, onAddLoan, onVaultUpdate, onEditVault }) => {
  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Fonction pour trier les vaults par date (plus récent en premier)
  const sortVaultsByDate = (vaultList: Vault[]) => {
    return vaultList.sort((a, b) => {
      // Utiliser modified_date en priorité, sinon created_date
      const dateA = new Date(a.modified_date || a.created_date || '1970-01-01');
      const dateB = new Date(b.modified_date || b.created_date || '1970-01-01');
      
      // Tri décroissant (plus récent en premier)
      return dateB.getTime() - dateA.getTime();
    });
  };

  // Séparation des vaults par type et tri par date (exclure les vaults archivés)
  const gateways = sortVaultsByDate(vaults.filter(v => v.is_gateway && !v.archived));
  const otherVaults = sortVaultsByDate(vaults.filter(v => !v.is_gateway && !v.archived));

  if (selectedVaultId) {
    const vault = vaults.find(v => v.id === selectedVaultId);
    if (vault) {
      return <VaultDetails 
        vault={vault} 
        loans={loans} 
        borrowers={borrowers} 
        activities={activities} 
        onBack={onBackToList || (() => {})} 
        onShowLoanDetails={onShowLoanDetails} 
        onAddLoan={onAddLoan} 
        onVaultUpdate={onVaultUpdate} 
        onEditVault={onEditVault}
        onAddActivity={(data) => {
          console.log('Activity added:', data);
          // TODO: Implement activity creation logic
        }}
        accounts={[
          { value: 'line_of_credit', label: 'Line of Credit' },
          { value: 'checking', label: 'Checking Account' },
          { value: 'savings', label: 'Savings Account' },
        ]}
        vaults={vaults}
        onSelectVault={onSelectVault}
      />;
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
        {otherVaults.length > 0 ? (
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
        ) : (
          <div className="empty-vaults-state">
            <div className="empty-vault-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="12" width="36" height="24" rx="4" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                <circle cx="36" cy="24" r="3" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                <path d="M12 18h12M12 22h8M12 26h10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="empty-vault-title">No vaults yet</h3>
            <p className="empty-vault-description">
              A vault is a secure space for both storing and leveraging your money. This allows the same 
              dollars to be in two places at once. You must add a vault before you can add loans.
            </p>
            <Button
              icon="iconless"
              iconComponent={undefined}
              interaction="default"
              justified="center"
              size="medium"
              onClick={onAddVault}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="primary"
              ariaLabel={undefined}
              aria-label="Add Vault"
              name="add-vault-empty"
              form=""
              className="empty-vault-button"
            >
              Add Vault
            </Button>
          </div>
        )}
      </section>
    </section>
  );
};