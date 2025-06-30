import React, { useState } from "react";
import { Tabs, Button, Table, TextCell, MetricCell } from "@jbaluch/components";
import { Transfers } from "./Vault Widgets/Transfers";
import { VaultFinancials } from "./Vault Widgets/VaultFinancials";
import type { Vault, Loan, Borrower } from "../../types/types";
import { EditVault } from "./EditVault";
import "./VaultDetails.css";
import summaryIcon from "../../assets/summary.svg";
import activityIcon from "../../assets/activity.svg";
import loansIcon from "../../assets/leverage-loans.svg";

const SummaryIcon = () => <img src={summaryIcon} alt="Summary" style={{ width: 16, height: 16 }} />;
const ActivityIcon = () => <img src={activityIcon} alt="Activity" style={{ width: 16, height: 16 }} />;
const LoansIcon = () => <img src={loansIcon} alt="Loans" style={{ width: 16, height: 16 }} />;

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() ?? '';
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

// Custom Cell for Name with Avatar
const NameCell = ({ name, avatarUrl, borrowerName }: { name: string; avatarUrl?: string, borrowerName: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    {avatarUrl ? (
      <img src={avatarUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
    ) : (
      <div className="vault-loan-avatar-initials">
        {getInitials(borrowerName)}
      </div>
    )}
    <span style={{ fontWeight: 500 }}>{name}</span>
  </div>
);

// Custom Cell for Status
const StatusCell = ({ status }: { status: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#eef7ff', borderRadius: '12px', color: '#175cd3', fontWeight: 500, fontSize: '13px' }}>
    <span style={{ fontFamily: 'Material Icons', fontSize: '14px' }}>◆</span>
    <span>{status}</span>
  </div>
);

interface VaultDetailsProps {
  vault: Vault;
  loans: Loan[];
  borrowers: Borrower[];
  onBack: () => void;
}

export const VaultDetails: React.FC<VaultDetailsProps> = ({
  vault,
  loans,
  borrowers,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const vaultLoans = loans.filter(
    (loan) => loan.vault_id === vault.id || loan.vaultId === vault.id
  );

  const totalUnpaid = vaultLoans.reduce((acc, loan) => acc + (loan?.current_balance ?? 0), 0);
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const availableToLend =
    typeof vault.available_for_lending_amount === "string"
      ? parseFloat(vault.available_for_lending_amount)
      : vault.available_for_lending_amount ?? 0;

  const renderSummaryContent = () => {
    if (vault.is_gateway) {
      return (
        <>
          <Transfers />
          <VaultFinancials
            balance={vault.balance ?? 0}
            held={vault.hold ?? 0}
            reserve={vault.reserve ?? 0}
            pending={0}
            available={availableToLend}
          />
        </>
      );
    }

    if (vault.type === 'Cash Vault') {
      return (
        <VaultFinancials
          balance={vault.balance ?? 0}
          held={vault.hold ?? 0}
          reserve={vault.reserve ?? 0}
          pending={0}
          available={availableToLend}
        />
      );
    }

    // Super Vault or other types
    return (
        <div className="coming-soon">
            Graphs for Super Vault will be displayed here soon.
        </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="vault-summary-content">
            {renderSummaryContent()}
          </div>
        );
      case "activity":
        return (
          <div className="tab-content">
            <div className="coming-soon">Activity content coming soon</div>
          </div>
        );
      case "loans":
        return (
          <div className="vault-loans-content">
            <div className="loans-header">
                <div className="loans-header-info">
                  <div className="unpaid-info">
                    <div className="unpaid-amount">{formatCurrency(totalUnpaid)}</div>
                    <div className="unpaid-label-container">
                      <div className="unpaid-label">unpaid</div>
                    </div>
                  </div>
                  <div className="loans-count-info">
                    <div className="loans-count-text">viewing {vaultLoans.length} loans</div>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  style={{ width: '100px', height: '36px', borderRadius: '18px' }}
                  icon="iconless"
                  iconComponent={undefined}
                  onClick={() => {}}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  name="add-loan"
                  form=""
                  ariaLabel="Add Loan"
                >
                  Add Loan
                </Button>
            </div>
            <Table
              columns={[
                { 
                  key: 'nickname', 
                  label: 'Name', 
                  cellComponent: NameCell, 
                  getCellProps: (row: Loan) => {
                    const borrower = borrowers.find(b => b.id === row.borrower_id || b.id === row.borrowerId);
                    return { name: row?.nickname ?? 'N/A', borrowerName: borrower?.fullName ?? '' };
                  }, 
                  width: '100%' ,
                alignment: 'left'
                },
                { key: 'loan_number', label: 'ID', cellComponent: TextCell, alignment: 'center',getCellProps: (row: Loan) => ({ text: row ? `Loan ${row.loan_number}` : '' }) , width: '100%'},
                { key: 'status', label: 'Status',alignment: 'center', cellComponent: StatusCell, getCellProps: (row: Loan) => ({ status: row?.status ?? 'Unknown' }), width: '100%' },
                { 
                  key: 'dscr_limit', 
                  label: 'DSCR', 
                  alignment: 'center',
                  cellComponent: MetricCell, 
                  getCellProps: (row: Loan) => {
                    const value = row?.dscr_limit;
                    const status = value === null || typeof value === 'undefined' ? 'neutral' : value < 1 ? 'bad' : 'good';
                    return { value: value ?? 'N/A', status: status };
                  }, 
                  width: '100%' 
                },
                { key: 'initial_annual_rate', label: 'Loan constant',alignment: 'center', cellComponent: TextCell, getCellProps: (row: Loan) => ({ text: row ? `${row.initial_annual_rate}%` : '0%' }), width: '100%'},
                { key: 'current_balance', label: 'Unpaid balance',alignment: 'right', cellComponent: TextCell, getCellProps: () => ({ text: 'Not available yet' }), width: '100%' },
              ]}
              data={vaultLoans}
              className="loans-table"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="vault-details-container">
      <div className="vault-details-header">
        <div className="header-left">
          <button className="icon-button" onClick={onBack}>
            <img src="/nav_arrow_back.svg" alt="Back" />
          </button>
          <div className="vault-title">{vault.is_gateway ? 'Gateway' : vault.nickname}</div>
        </div>
        <Button
          type="secondary"
          icon="iconless"
          style={{ width: '110px', height: '36px' }}
          onClick={() => setIsEditModalOpen(true)}
          name="edit-vault"
          iconComponent={undefined}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          form=""
          ariaLabel="Edit Vault"
        >
          Edit Vault
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        tabs={[
            { id: 'summary', label: 'Summary', iconComponent: SummaryIcon },
            { id: 'activity', label: 'Activity', iconComponent: ActivityIcon },
            { id: 'loans', label: 'Loans', iconComponent: LoansIcon },
        ]}
      />

      {renderTabContent()}

      <EditVault
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vault={vault}
      />
    </div>
  );
};
