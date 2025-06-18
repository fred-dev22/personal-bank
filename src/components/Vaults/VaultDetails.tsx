import React, { useState } from 'react';
import { Button, Tabs, Table, TextCell, TagCell, MetricCell } from '@jbaluch/components';
import { VaultFinancials } from './Vault Widgets/VaultFinancials';
import type { Loan, Vault } from '../../types/types';
import { EditVault } from './EditVault';
import './VaultDetails.css';

interface VaultDetailsProps {
  vault: Vault;
  loans: Loan[];
  onBack: () => void;
}

export const VaultDetails: React.FC<VaultDetailsProps> = ({
  vault,
  loans,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState("loans");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const vaultLoans = loans.filter(loan => loan.vault_id === vault.id || loan.vaultId === vault.id);

  // Calculate financial values
  const balance = 100000.00;
  const held = 20000.00;
  const reserve = 10000.00;
  const pending = 1000.00;
  const available = 29000.00;

  const renderContent = () => {
    switch (activeTab) {
      case "loans":
        return (
          <div className="vault-details-content">
            <VaultFinancials
              balance={balance}
              held={held}
              reserve={reserve}
              pending={pending}
              available={available}
            />
            <div className="loans-section">
              <Table
                data={vaultLoans}
                columns={[
                  {
                    header: 'Name',
                    width: '100%',
                    alignment: 'left',
                    cellComponent: TextCell,
                    getCellProps: (loan: Loan) => ({ 
                      text: loan.nickname || 'Unnamed Loan', 
                      alignment: 'left' 
                    }),
                  },
                  {
                    header: 'Status',
                    width: '100%',
                    alignment: 'left',
                    cellComponent: TagCell,
                    getCellProps: (loan: Loan) => ({ 
                      label: loan.status || 'Unknown',
                      alignment: 'left',
                      size: 'small'
                    }),
                  },
                  {
                    header: 'Balance',
                    width: '100%',
                    alignment: 'left',
                    cellComponent: MetricCell,
                    getCellProps: (loan: Loan) => ({ 
                      value: loan.current_balance || 0,
                      alignment: 'left'
                    }),
                  }
                ]}
              />
            </div>
          </div>
        );
      case "activity":
        return <div>Activity content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="vault-details">
      <div className="vault-header">
        <button className="back-button" onClick={onBack}>
          <img src="/nav_arrow_back.svg" alt="Back" />
        </button>
        <h1>{vault.is_gateway ? 'Gateway' : (vault.nickname || vault.name || 'Vault')}</h1>
        <Button
          type="secondary"
          onClick={() => setIsEditModalOpen(true)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          name="edit-vault"
          iconComponent={undefined}
          interaction="default"
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
          { id: "loans", label: "Loans" },
          { id: "activity", label: "Activity" }
        ]}
      />
      {renderContent()}
      <EditVault open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} vault={vault} />
    </div>
  );
}; 