import React, { useState } from "react";
import { Button, Table, TextCell, MetricCell, TagCell } from "@jbaluch/components";
// import { Transfers } from "./Vault Widgets/Transfers"; // Commented out - Transfers section hidden
import { VaultFinancials } from "./Vault Widgets/VaultFinancials";
import { SuperVaultGraphIframe } from "./Vault Widgets/SuperVaultGraphIframe";
import { DSCRCard, MonthlyPaymentCard } from "./Vault Widgets";
import type { Vault, Loan, Borrower, Activity } from "../../types/types";
import { EditVault } from "./EditVault";
import { DottedUnderline } from "../ui/DottedUnderline";
import { AddEditActivity } from "../Activities/AddEditActivity";
import { createSimpleVaultConfig } from "../Activities/activityConfigs";
import "./VaultDetails.css";
import summaryIcon from "../../assets/summary.svg";
import activityIcon from "../../assets/activity.svg";
import loansIcon from "../../assets/leverage-loans.svg";
import { TabNavigation } from "../ui/TabNavigation";

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
  <div style={{textAlign:"center"}}>
    <span>{status}</span>
  </div>
);

interface VaultDetailsProps {
  vault: Vault;
  loans: Loan[];
  borrowers: Borrower[];
  activities: Activity[];
  onBack: () => void;
  onShowLoanDetails?: (loanId: string) => void;
  onAddLoan?: () => void;
  onVaultUpdate?: (updatedVault: Vault) => void;
  onEditVault?: (vault: Vault) => void;
  onAddActivity?: (data: any) => void;
  accounts?: Array<{ value: string; label: string }>;
}

export const VaultDetails: React.FC<VaultDetailsProps> = ({
  vault,
  loans,
  borrowers,
  activities,
  onBack,
  onShowLoanDetails,
  onAddLoan,
  onVaultUpdate,
  onEditVault,
  onAddActivity,
  accounts = []
}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleSetupVault = (vault: Vault) => {
    if (onEditVault) {
      onEditVault(vault);
    }
  };

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

  // Create activity configuration for this vault
  const activityConfig = createSimpleVaultConfig(vault, accounts);

  // Handle activity submission
  const handleAddActivity = (data: any) => {
    if (onAddActivity) {
      onAddActivity(data);
    }
    setShowAddActivityModal(false);
  };

  // Filtrage des activités liées à ce vault
  const vaultActivityIds = vault.activities || [];
  // Log pour debug
  console.log('vault.activities:', vaultActivityIds);
  console.log('activities ids:', activities.map(a => a.id));
  const vaultActivities = activities.filter(a => vaultActivityIds.includes(a.id));
  
  // Sample activity data for demonstration (similar to Documents tab)
  const sampleActivityRows = [
    {
      id: 'sample-activity-1',
      name: 'Loan name',
      category: 'Loan funding',
      date: 'Aug 11',
      amount: 2000,
      type: 'loan'
    }
  ];
  
  const activityRows = vaultActivities.length > 0 
    ? vaultActivities.map(a => ({
        id: a.id, // Add the id property for click handling
        name: a.name,
        category: a.tag || '',
        date: a.date ? new Date(a.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '',
        amount: a.amount,
        type: a.type,
      }))
    : sampleActivityRows;

  // Fonction pour obtenir le vrai balance depuis l'account associé
  const getRealBalance = () => {
    // Pour Cash Vault et Gateway, utiliser le balance de l'account associé
    if ((vault.type === 'cash vault' || vault.is_gateway) && vault.accounts_json && vault.accounts_json.length > 0) {
      const cashAccount = vault.accounts_json.find(acc => 
        acc.type === 'Savings' || acc.type === 'Cash' || vault.accounts_json!.length === 1
      ) || vault.accounts_json[0];
      
      return cashAccount?.balance || 0;
    }
    
    // Pour Super Vault, calculer le credit limit
    if (vault.type === 'super vault' && vault.accounts_json && vault.accounts_json.length > 0) {
      const assetAccount = vault.accounts_json.find(acc => acc.nickname === 'Asset super vault');
      const debtAccount = vault.accounts_json.find(acc => acc.nickname === 'Debt');
      
      const assetValue = assetAccount?.balance || 0;
      const creditLimitValue = debtAccount?.credit_limit || 0;
      const creditLimitType = debtAccount?.credit_limit_type || 'percentage';
      
      let creditLimit = 0;
      if (creditLimitType === 'percentage') {
        creditLimit = (creditLimitValue / 100) * assetValue;
      } else {
        creditLimit = creditLimitValue;
      }
      
      console.log('Super Vault Credit Limit calculation:', {
        assetValue,
        creditLimitValue,
        creditLimitType,
        creditLimit
      });
      
      return creditLimit;
    }
    
    // Fallback sur vault.balance
    return vault.balance ?? 0;
  };

  const renderSummaryContent = () => {
    // Debug: afficher le type du vault
    console.log('Vault type:', vault.type, 'Is gateway:', vault.is_gateway, 'Vault:', vault);
    
    const realBalance = getRealBalance();
    console.log('Real balance calculation:', {
      vaultBalance: vault.balance,
      realBalance,
      accountsJson: vault.accounts_json
    });
    
    // Gateway : VaultFinancials only (Transfers section hidden)
    if (vault.is_gateway) {
      return (
        <VaultFinancials
          balance={realBalance}
          held={vault.hold ?? 0}
          reserve={vault.reserve ?? 0}
          pending={0}
          available={availableToLend}
          balanceLabel="Balance" // Label par défaut pour Gateway
        />
      );
    }

    // Cash Vault (non-gateway)
    if (vault.type === 'cash vault' || !vault.type) {
      return (
        <VaultFinancials
          balance={realBalance}
          held={vault.hold ?? 0}
          reserve={vault.reserve ?? 0}
          pending={0}
          available={availableToLend}
          balanceLabel="Balance" // Label par défaut pour Cash Vault
        />
      );
    }

    // Super Vault
    console.log('Checking Super Vault condition:', vault.type === 'super vault', 'Vault type:', vault.type);
    if (vault.type === 'super vault') {
      return (
        <div style={{ overflow: 'visible', position: 'relative' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            marginBottom: '20px',
            overflow: 'visible',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#6B7280', 
                marginBottom: '4px',
                fontWeight: '500'
              }}>
                Growth projection
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: '12px',
                marginBottom: '8px'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#111827',
                  margin: 0
                }}>
                  Divergent lines
                </h2>
                <span style={{ 
                  fontSize: '14px', 
                  color: '#6B7280',
                  fontWeight: '400'
                }}>
                  Equity is increasing
                </span>
              </div>
              
              {/* Legend */}
              <div style={{ 
                display: 'flex', 
                gap: '20px',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#1B4A7B' 
                  }}></div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Cash value</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#999F9E' 
                  }}></div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Line of credit</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#00B5AE' 
                  }}></div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Equity</span>
                </div>
              </div>
            </div>

            {/* Graph */}
            <div style={{ 
              overflow: 'visible', 
              position: 'relative',
              zIndex: 10
            }}>
              {vault.payment_projection ? (
                (() => {
                  console.log('📊 Vault projection data:', vault.payment_projection);
                  console.log('📊 Future cash values:', vault.payment_projection.trends?.futureCashValues);
                  console.log('📊 Future loan amounts:', vault.payment_projection.trends?.futureLoanAmounts);
                  console.log('📊 Future equities:', vault.payment_projection.trends?.futureEquities);
                  
                  return (
                    <SuperVaultGraphIframe
                      futureCashValues={vault.payment_projection.trends?.futureCashValues || []}
                      futureLoanAmounts={vault.payment_projection.trends?.futureLoanAmounts || []}
                      futureEquities={vault.payment_projection.trends?.futureEquities || []}
                      withTooltip={true}
                    />
                  );
                })()
              ) : (
                <SuperVaultGraphIframe
                  futureCashValues={[10000, 15000, 22000, 30000, 39000, 50000, 62000, 76000, 92000, 110000, 130000, 152000, 176000, 202000, 230000, 260000, 292000, 326000, 362000, 400000, 440000]}
                  futureLoanAmounts={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
                  futureEquities={[10000, 15000, 22000, 30000, 39000, 50000, 62000, 76000, 92000, 110000, 130000, 152000, 176000, 202000, 230000, 260000, 292000, 326000, 362000, 400000, 440000]}
                  withTooltip={true}
                />
              )}
            </div>

            {/* Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#1B4A7B',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                What is divergence?
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#9CA3AF'
              }}>
                20 years
              </div>
            </div>
          </div>

          {/* Dashboard Title */}
          <div style={{ 
            marginBottom: '20px',
            marginTop: '24px'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#111827',
              margin: 0
            }}>
              Dashboard
            </h2>
          </div>

          {/* DSCR Cards Section */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px', 
            marginBottom: '24px'
          }}>
            {/* Income DSCR Card */}
            <DSCRCard
              title="Income DSCR"
              value={0} // TODO: Get from vault data
              zone1Label="loss"
              zone2Label="low profit"
              zone3Label="high profit"
              zone2Value={1.00}
              zone3Value={1.50}
              zone1Color="#E5E7EB"
              zone2Color="#E5E7EB"
              zone3Color="#00B5AE"
              minValue={0}
              maxValue={3}
              percentage={false}
              decimalPlaces={true}
              hideValue={true}
            />

            {/* Payment Application Card */}
            <MonthlyPaymentCard
              title="Payment application"
              lineOfCredit="tbd"
              cashValue="tbd"
              buttonText="Apply to August Payments"
              onApplyClick={() => {
                console.log('Apply to August Payments clicked');
                // TODO: Implement payment application logic
              }}
            />

            {/* Growth DSCR Card */}
            <DSCRCard
              title="Growth DSCR"
              value={10.00}
              zone1Label="loss"
              zone2Label="slow"
              zone3Label="fast"
              zone2Value={1.00}
              zone3Value={1.50}
              zone1Color="#E5E7EB"
              zone2Color="#E5E7EB"
              zone3Color="#00B5AE"
              minValue={0}
              maxValue={15}
              percentage={false}
              decimalPlaces={true}
              hideValue={false}
            />

            {/* Debt to Asset Card */}
            <DSCRCard
              title="Debt to asset"
              value={0}
              zone1Label="too slow"
              zone2Label="optimal"
              zone3Label="too fast"
              zone2Value={30}
              zone3Value={72}
              zone1Color="#1B4A7B"
              zone2Color="#00B5AE"
              zone3Color="#E5E7EB"
              minValue={0}
              maxValue={100}
              percentage={true}
              decimalPlaces={false}
              hideValue={false}
            />
          </div>

          <VaultFinancials
            balance={realBalance}
            held={vault.hold ?? 0}
            reserve={vault.reserve ?? 0}
            pending={0}
            available={availableToLend}
            balanceLabel="Credit limit" // Label spécifique pour Super Vault
          />
        </div>
      );
    }

    // Other types
    return (
        <div className="coming-soon">
            Graphs for this vault type will be displayed here soon.
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
          <section className="all-activities-table">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {getRealBalance().toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span style={{ color: '#6b6b70', fontWeight: 400, fontSize: 14, marginLeft: 8 }}>
                  <DottedUnderline>balance</DottedUnderline>
                </span>
              </div>
              <Button
                icon="iconless"
                iconComponent={undefined}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                name="add-activity"
                form=""
                ariaLabel="Add"
                type="primary"
                style={{ width: 120, height: 40, fontWeight: 600 }}
                onClick={() => setShowAddActivityModal(true)}
              >
                Add Activity
              </Button>
            </div>
            <Table
              columns={[
                { 
                  key: 'name', 
                  label: 'Name', 
                  width: '100%', 
                  cellComponent: TextCell, 
                  alignment: 'left', 
                  getCellProps: (row: typeof activityRows[0]) => ({ text: row.name }) 
                },
                { 
                  key: 'category', 
                  label: 'Category', 
                  width: '100%', 
                  cellComponent: TagCell, 
                  alignment: 'center', 
                  getCellProps: (row: typeof activityRows[0]) => ({ 
                    label: row.category,
                    emoji: '💰',
                    size: 'small',
                    backgroundColor: 'rgb(221, 229, 245)',
                    textColor: '#1976D2',
                    severity: 'info'
                  }) 
                },
                { 
                  key: 'date', 
                  label: 'Date', 
                  width: '100%', 
                  cellComponent: TextCell, 
                  alignment: 'center', 
                  getCellProps: (row: typeof activityRows[0]) => ({ text: row.date }) 
                },
                { 
                  key: 'amount', 
                  label: 'Amount', 
                  width: '100%', 
                  cellComponent: TextCell, 
                  alignment: 'right', 
                  getCellProps: (row: typeof activityRows[0]) => ({ 
                    text: row.amount.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: 'USD', 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    }) 
                  }) 
                },
              ]}
              data={activityRows}
              className="activities-table"
              clickableRows
              onRowClick={(row: any) => {
                // Handle sample activities (for demonstration)
                if (row.id === 'sample-activity-1') {
                  // Create a sample activity object for the edit modal
                  const sampleActivity: Activity = {
                    id: 'sample-activity-1',
                    name: 'Loan name',
                    type: 'loan',
                    date: new Date('2025-08-11'),
                    amount: 2000,
                    tag: 'Loan funding'
                  };
                  setSelectedActivity(sampleActivity);
                  return;
                }
                
                // Find the actual activity data from the activities array
                const activity = activities.find(a => a.id === row.id);
                if (activity) {
                  setSelectedActivity(activity);
                }
              }}
            />
          </section>
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
                  onClick={onAddLoan}
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
                { key: 'loan_number', label: 'ID', cellComponent: TextCell, width: '100%', alignment: 'center',getCellProps: (row: Loan) => ({ text: row ? `Loan ${row.loan_number}` : '' }) },
                { key: 'status', label: 'Status',alignment: 'center', width: '100%',  cellComponent: StatusCell, getCellProps: (row: Loan) => ({ status: row?.status ?? 'Unknown' })},
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
                { key: 'initial_annual_rate', label: 'Loan constant',alignment: 'center', cellComponent: TextCell, getCellProps: (row: Loan) => ({ text: row ? `${(row.initial_annual_rate * 100).toFixed(2)}%` : '0.00%' }), width: '100%'},
                { key: 'current_balance', label: 'Unpaid balance',alignment: 'right', cellComponent: TextCell, getCellProps: () => ({ text: 'Not available yet' }), width: '100%' },
              ]}
              data={vaultLoans}
              className="loans-table"
              onRowClick={onShowLoanDetails ? (row: Loan) => onShowLoanDetails(row.id) : undefined}
              clickableRows={true}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="vault-details-container" style={{ 
      marginRight: selectedActivity ? '400px' : '0px',
      transition: 'margin-right 0.3s ease'
    }}>
      <style>
        {`
          .dscr-card, .monthly-payment-card {
            height: 280px !important;
            min-height: 280px !important;
            max-height: 280px !important;
          }
        `}
      </style>
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

      <TabNavigation
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        tabs={[
            { id: 'summary', label: 'Summary', icon: <SummaryIcon /> },
            { id: 'activity', label: 'Activity', icon: <ActivityIcon /> },
            { id: 'loans', label: 'Loans', icon: <LoansIcon /> },
        ]}
      />

      {renderTabContent()}

      <EditVault
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vault={vault}
        onSetupVault={handleSetupVault}
        onSave={(updatedData) => {
          if (onVaultUpdate) {
            onVaultUpdate({ ...vault, ...updatedData });
          }
        }}
        onVaultUpdate={(updatedVault) => {
          if (onVaultUpdate) {
            onVaultUpdate(updatedVault);
          }
          // Fermer les détails du vault et retourner à la liste
          onBack();
        }}
      />

      <AddEditActivity
        open={showAddActivityModal}
        mode="add"
        config={activityConfig}
        onClose={() => setShowAddActivityModal(false)}
        onSubmit={handleAddActivity}
      />

      <AddEditActivity
        open={!!selectedActivity}
        mode="edit"
        config={activityConfig}
        initialData={selectedActivity ? {
          ...selectedActivity,
          borrowerId: (() => {
            // Handle sample activity
            if (selectedActivity.id === 'sample-activity-1') {
              return loans[0]?.borrower_id || loans[0]?.borrowerId;
            }
            const loan = loans.find(l => l.activities?.includes(selectedActivity.id));
            return loan?.borrower_id || loan?.borrowerId;
          })(),
          borrowerName: (() => {
            // Handle sample activity
            if (selectedActivity.id === 'sample-activity-1') {
              const borrowerId = loans[0]?.borrower_id || loans[0]?.borrowerId;
              return borrowers.find(b => b.id === borrowerId)?.fullName || 'My borrower';
            }
            const loan = loans.find(l => l.activities?.includes(selectedActivity.id));
            const borrowerId = loan?.borrower_id || loan?.borrowerId;
            return borrowers.find(b => b.id === borrowerId)?.fullName || 'My borrower';
          })(),
          loanId: (() => {
            // Handle sample activity
            if (selectedActivity.id === 'sample-activity-1') {
              return loans[0]?.id;
            }
            const loan = loans.find(l => l.activities?.includes(selectedActivity.id));
            return loan?.id;
          })(),
          loanName: (() => {
            // Handle sample activity
            if (selectedActivity.id === 'sample-activity-1') {
              return loans[0]?.nickname || 'Loan name';
            }
            const loan = loans.find(l => l.activities?.includes(selectedActivity.id));
            return loan?.nickname || 'Loan name';
          })(),
          vaultId: vault.id,
          vaultName: vault.nickname || vault.name || 'Gateway',
          accountName: (() => {
            // Handle sample activity
            if (selectedActivity.id === 'sample-activity-1') {
              return accounts.find(a => a.value === loans[0]?.accountId)?.label || 'Savings';
            }
            const loan = loans.find(l => l.activities?.includes(selectedActivity.id));
            return accounts.find(a => a.value === loan?.accountId)?.label || 'Savings';
          })()
        } : {}}
        onClose={() => setSelectedActivity(null)}
        onSubmit={() => {
          setSelectedActivity(null);
        }}
      />
      
    </div>
  );
};
