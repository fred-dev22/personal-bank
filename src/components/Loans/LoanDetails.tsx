import React, { useState } from 'react';
import { Button, Table, TextCell, TagCell } from '@jbaluch/components';
import './LoanDetails.css';
import vaultIcon from '../../assets/vault.svg';
import borrowerIcon from '../../assets/borrower.svg';
import summaryIcon from '../../assets/summary.svg';
import activityIcon from '../../assets/activity.svg';
import scheduleIcon from '../../assets/schedule.svg';
import documentIcon from '../../assets/document.svg';
import mailIcon from '../../assets/mail.svg';
import uploadIcon from '../../assets/upload.svg';
import type { Loan, Borrower, Activity, Vault } from '../../types/types';
import { DSCRCard } from '../Vaults/Vault Widgets/DSCRCard';
import { CashFlowCard } from '../Cards/CashFlowCard/CashFlowCard';
import { TermsCard } from '../Cards/TermsCard/TermsCard';
import { EditLoan } from './EditLoan';
import { Modal } from '../Modal/Modal';
import { AddEditActivity } from '../Activities/AddEditActivity';
import { createSimpleLoanConfig, ACTIVITY_CATEGORIES } from '../Activities/activityConfigs';
import { TabNavigation } from '../ui/TabNavigation';
import { fetchLoanById } from '../../controllers/loanController';
import { EmptyState } from '@jbaluch/components';
import { useActivity } from '../../contexts/ActivityContext';
import { calculateMonthlyPayment } from '../../utils/loanUtils';

interface LoanDetailsProps {
  loan: Loan;
  borrower: Borrower;
  onBack: () => void;
  onShowBorrowerDetails: () => void;
  onShowVaultDetails?: (vaultId: string) => void;
  activities: Activity[];
  loans: Loan[];
  activeTabId?: string;
  onRecastLoan?: (loan: Loan) => void;
  onAddActivity?: (data: any) => void;
  vaults?: Vault[];
  accounts?: Array<{ value: string; label: string }>;
}

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDateMD(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

const SummaryIcon = () => <img src={summaryIcon} alt="Summary" style={{ width: 16, height: 16 }} />;
const ActivityIcon = () => <img src={activityIcon} alt="Activity" style={{ width: 16, height: 16 }} />;
const ScheduleIcon = () => <img src={scheduleIcon} alt="Schedule" style={{ width: 16, height: 16 }} />;
const DocumentIcon = () => <img src={documentIcon} alt="Documents" style={{ width: 16, height: 16 }} />;

type ScheduleRow = {
  due_date: string;
  payment: string;
  fees: string;
  balance: string;
  status: string;
};

type DocumentRow = {
  name: string;
  description: string;
  uploadDate: string;
};

const documentsData: DocumentRow[] = [
  { name: 'Promissory Note.pdf', description: 'Original note', uploadDate: 'April 1, 2023' },
  { name: 'Promissory Note Signed.pdf', description: "Clovis' signed note", uploadDate: 'April 1, 2023' },
];

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, borrower, onBack, onShowBorrowerDetails, onShowVaultDetails, activities, loans, activeTabId, onRecastLoan, onAddActivity, vaults = [], accounts = [] }) => {
  const [activeTab, setActiveTab] = useState(activeTabId || 'summary');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[] | null>(null);
  const [lastFetchedLoanId, setLastFetchedLoanId] = useState<string | null>(null);
  const { showActivity, hideActivity } = useActivity();

  // Category lookup for emoji + label and dynamic colors
  const categoryLookup = React.useMemo(() => {
    const all = [
      ...ACTIVITY_CATEGORIES.general,
      ...ACTIVITY_CATEGORIES.loan,
      ...ACTIVITY_CATEGORIES.vault,
      ...ACTIVITY_CATEGORIES.payment,
    ];
    return all.reduce((acc, c) => {
      acc[c.value] = c;
      return acc;
    }, {} as Record<string, { value: string; label: string; emoji?: string }>);
  }, []);

  const TAG_BG_COLORS: Record<string, string> = {
    income: '#C8EBEA',
    payment_received: '#C8EBEA',
    vault_income: '#C8EBEA',
    contribution: '#C8EBEA',
    vault_contribution: '#C8EBEA',

    expense: '#FFCCCE',
    transfer_fee: '#FFCCCE',
    late_fee: '#FFCCCE',
    vault_fee: '#FFCCCE',
    withdrawal: '#FFCCCE',
    vault_withdrawal: '#FFCCCE',
    payment_sent: '#FFCCCE',

    transfer: '#DDE5F5',
    vault_transfer: '#DDE5F5',
    loan_payment: '#DDE5F5',
    principal_payment: '#DDE5F5',
    interest_payment: '#DDE5F5',
  };
  const resolveTagBackground = (tag?: string, type?: string) => TAG_BG_COLORS[(tag || type || '').toLowerCase()] || '#f0f0f1';

  // Fonction pour gérer le clic sur Confirm Funding
  const handleConfirmFunding = () => {
    setIsActivityModalOpen(true);
  };

  // Filtrage des activités liées à ce loan à partir de la liste globale de loans
  const currentLoan = loans.find(l => l.id === loan.id);
  const loanActivityIds = currentLoan?.activities || [];
  // Log pour debug
  console.log('loan.activities:', loanActivityIds);
  console.log('activities ids:', activities.map(a => a.id));
  const loanActivities = activities.filter(a => loanActivityIds.includes(a.id));

  // Dev-only demo rows when no data exists, to preview design
  const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.MODE !== 'production';
  const demoActivities: Activity[] = [
    { id: 'd1', name: 'Paypal', type: 'loan', date: new Date('2024-11-08') as any, amount: 2.55, tag: 'transfer_fee' },
    { id: 'd2', name: 'Interest 9', type: 'loan', date: new Date('2024-11-08') as any, amount: 5.00, tag: 'interest_fee' as any },
    { id: 'd3', name: 'Payment 9', type: 'loan', date: new Date('2024-11-08') as any, amount: 300.00, tag: 'loan_payment' },
  ];
  const sourceActivities = loanActivities.length > 0 ? loanActivities : (isDev ? demoActivities : loanActivities);

  const activityRows = sourceActivities.map(a => ({
    id: a.id,
    name: a.name,
    category: a.tag || '',
    date: a.date ? new Date(a.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '',
    amount: a.amount,
    type: a.type,
  }));

  // Create activity configuration for this loan
  const activityConfig = createSimpleLoanConfig(loan, accounts);

  // Handle activity submission
  const handleAddActivity = (data: any) => {
    if (onAddActivity) {
      onAddActivity(data);
    }
    setShowAddActivityModal(false);
  };

  React.useEffect(() => {
    if (
      activeTab === 'schedule' &&
      (scheduleRows === null || loan.id !== lastFetchedLoanId)
    ) {
      setScheduleError(null);
      showActivity('Payments are loading...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setScheduleError('Vous devez être connecté pour voir le schedule.');
        hideActivity();
        return;
      }
      fetchLoanById(loan.id, token)
        .then(data => {
          if (Array.isArray(data.actual_payments_scheduled)) {
            setScheduleRows(data.actual_payments_scheduled.map((row: any) => ({
              due_date: row.date ? new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
              payment: row.amount_due !== undefined ? `$${row.amount_due}` : '',
              fees: row.fees !== undefined ? `$${row.fees}` : '',
              balance: row.unpaid_balance !== undefined ? `$${row.unpaid_balance}` : '',
              status: row.status || '',
            })));
          } else {
            setScheduleRows([]);
          }
          setLastFetchedLoanId(loan.id);
          hideActivity();
        })
        .catch(() => {
          setScheduleError('Erreur lors du chargement du schedule.');
          hideActivity();
        });
    }
  }, [activeTab, loan.id]);

  // Helper pour formater les montants avec 2 décimales
  const formatMoney = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.\-]/g, '')) : val;
    if (isNaN(num)) return '$0.00';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Utiliser le montant mensuel stocké ou le calculer si nécessaire
  const getMonthlyPayment = () => {
    if (loan.monthly_payment_amount) {
      return loan.monthly_payment_amount;
    }
    return calculateMonthlyPayment(
      loan.initial_balance,
      loan.initial_number_of_payments,
      loan.initial_annual_rate
    );
  };

  // Helper pour le header du schedule
  const payoffDate = (scheduleRows && scheduleRows.length > 0)
    ? new Date(scheduleRows[scheduleRows.length - 1].due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const paidToDate = scheduleRows && scheduleRows.length > 0
    ? scheduleRows.filter(r => r.status.toLowerCase() === 'paid').reduce((sum, r) => sum + (parseFloat((r.payment || '').toString().replace(/[^\d.\-]/g, '')) || 0), 0)
    : 0;

  const remaining = scheduleRows && scheduleRows.length > 0
    ? formatMoney(
        scheduleRows
          .filter(r => r.status.toLowerCase() !== 'paid')
          .reduce((sum, r) => sum + (parseFloat((r.payment || '').toString().replace(/[^\d.\-]/g, '')) || 0), 0)
      )
    : formatMoney(0);

  // Permet de changer d'onglet dynamiquement si activeTabId change
  React.useEffect(() => {
    if (activeTabId && activeTab !== activeTabId) {
      setActiveTab(activeTabId);
    }
  }, [activeTabId]);

  // Debug: Log loan status and activities
  React.useEffect(() => {
    if (activeTab === 'activity') {
      console.log('Loan status:', loan.status);
      console.log('Loan activities count:', loanActivities.length);
      console.log('Source activities count:', sourceActivities.length);
    }
  }, [activeTab, loan.status, loanActivities.length, sourceActivities.length]);

  return (
    <div className="loan-details" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="loan-header">
        <button className="loan-back-btn" onClick={onBack} aria-label="Back">
          <img src="/nav_arrow_back.svg" alt="Back" className="loan-back-icon" />
        </button>
        <div className="loan-avatar loan-avatar-initials">
          {getInitials(borrower.fullName)}
        </div>
        <span className="loan-name">
          {loan.nickname || 'Loan'} - {loan.id}
        </span>
        <div className="loan-header-spacer" />
        <Button
          icon="icon"
          iconComponent={() => <img src={vaultIcon} alt="Vault" style={{ width: 18, height: 18 }} />}
          interaction="default"
          justified="left"
          onClick={() => {
            if (onShowVaultDetails && loan.vaultId) onShowVaultDetails(loan.vaultId);
          }}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="vault"
          form=""
          ariaLabel="Vault"
          style={{ width: 120 }}
        >
          Vault
        </Button>
        <Button
          icon="icon"
          iconComponent={() => <img src={borrowerIcon} alt="Borrower" style={{ width: 18, height: 18 }} />}
          interaction="default"
          justified="left"
          onClick={onShowBorrowerDetails}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="borrower"
          form=""
          ariaLabel="Borrower"
          style={{ width: 130 }}
        >
          Borrower
        </Button>
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          onClick={() => setIsEditModalOpen(true)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="edit-loan"
          form=""
          ariaLabel="Edit"
          style={{ width: 100 }}
        >
          Edit
        </Button>
      </div>
      {/* Tabs */}
      <TabNavigation
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'summary', label: 'Summary', icon: <SummaryIcon /> },
          { id: 'activity', label: 'Activity', icon: <ActivityIcon /> },
          { id: 'schedule', label: 'Schedule', icon: <ScheduleIcon /> },
          { id: 'documents', label: 'Documents', icon: <DocumentIcon /> },
        ]}
      />
      {/* Content (placeholder) */}
      <div className="loan-tab-content">
        {activeTab === 'summary' && (
          <div className="content">
            {/* Carte de confirmation de funding pour les loans en statut "Funding" */}
            {loan.status === 'Funding' && (
              <div className="funding-confirmation-card">
                <div className="funding-confirmation-content">
                  <div className="funding-confirmation-left">
                    <div className="funding-confirmation-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#00B5AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="funding-confirmation-text">
                      Verify that you transferred funds to the borrower.
                    </div>
                  </div>
                  <Button
                    icon="iconless"
                    iconComponent={undefined}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    name="confirm-funding"
                    form=""
                    ariaLabel="Confirm Funding"
                    type="primary"
                    style={{ 
                      backgroundColor: '#00B5AE', 
                      borderColor: '#00B5AE',
                      color: 'white',
                      fontWeight: 600,
                      padding: '12px 24px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      minWidth: '160px',
                      maxWidth: '200px',
                      height: '44px',
                      boxShadow: '0 2px 4px rgba(0, 181, 174, 0.2)'
                    }}
                    onClick={handleConfirmFunding}
                  >
                    Confirm Funding
                  </Button>
                </div>
              </div>
            )}
            <div className="row">
              <DSCRCard
                title="Income DSCR"
                value={loan.dscr_limit || 0}
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
                hideValue={loan.dscr_limit === undefined || loan.dscr_limit === null}
              />
              <CashFlowCard
                amount={getMonthlyPayment()}
                paid={`${loan.payments?.length || 0} of ${loan.initial_number_of_payments}`}
                nextDue={formatDateMD(loan.start_date)}
                rate={loan.initial_annual_rate * 100}
                balance={loan.current_balance}
              />
            </div>
            <div className="row">
                             <TermsCard
                 amount={loan.initial_balance}
                 rate={loan.initial_annual_rate * 100}
                 type={loan.loan_type}
                 startDate={loan.start_date}
                 numberOfMonths={loan.initial_number_of_payments}
                 isRecast={loan.is_recast}
                 recastDate={loan.recast_date}
               />
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <section className="all-activities-table">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                ${loanActivities.reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span style={{ color: '#6b6b70', fontWeight: 400, fontSize: 14, marginLeft: 8 }}>payoff amount</span>
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
                Add
              </Button>
            </div>
            {/* Show EmptyState when loan is not funded */}
            {(loan.status === 'Funding' || loan.status === 'Not Funded' || sourceActivities.length === 0) ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <EmptyState
                  imageName="NoLoans"
                  title="Not yet funded"
                  description="This loan needs funded first."
                  customImage={undefined}
                  children={undefined}
                  className=""
                  position=""
                />
              </div>
            ) : (
            <Table
              columns={[
                { key: 'name', label: 'Name', width: '100%', cellComponent: TextCell, alignment: 'left', getCellProps: (row: typeof activityRows[0]) => ({ text: row.name || '—' }) },
                { key: 'category', label: 'Category', width: '100%', cellComponent: TagCell, alignment: 'center', getCellProps: (row: typeof activityRows[0]) => {
                  const cat = categoryLookup[row.category];
                  return {
                    label: cat?.label || row.category,
                    emoji: cat?.emoji || '🏷️',
                    size: 'small',
                    backgroundColor: resolveTagBackground(row.category, row.type),
                    textColor: '#595959',
                    severity: 'info',
                  };
                } },
                { key: 'date', label: 'Date', width: '100%', cellComponent: TextCell, alignment: 'center', getCellProps: (row: typeof activityRows[0]) => ({ text: row.date }) },
                { key: 'amount', label: 'Amount', width: '100%', cellComponent: TextCell, alignment: 'right', getCellProps: (row: typeof activityRows[0]) => ({ text: row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }) },
              ]}
              data={activityRows}
              className="activities-table-fullwidth"
              clickableRows
              onRowClick={(row: any) => {
                let activity = activities.find(a => a.id === row.id);
                if (!activity) {
                  const demo = sourceActivities.find(a => a.id === row.id);
                  if (demo) activity = demo;
                }
                if (activity) setSelectedActivity(activity);
              }}
            />
            )}
          </section>
        )}
        {activeTab === 'schedule' && (
          <div className="schedule-section">
            {scheduleError ? (
              <EmptyState title="Erreur" description={scheduleError} imageName="empty" severity="info" customImage={undefined} />
            ) : scheduleRows && scheduleRows.length > 0 ? (
              <>
                <div className="table-header">
                  <div className="vaults-description">
                    <div className="subtitle">Payoff date</div>
                    <div className="title">{payoffDate}</div>
                  </div>
                  <div className="vaults-description">
                    <div className="subtitle">Paid to date</div>
                    <div className="text-wrapper">{formatMoney(paidToDate)}</div>
                  </div>
                  <div className="vaults-description">
                    <div className="subtitle">Remaining</div>
                    <div className="title">{remaining}</div>
                  </div>
                </div>
                <Table
                  columns={[
                    {
                      key: 'due_date',
                      label: 'Due date',
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'left',
                      getCellProps: (row: ScheduleRow) => ({ text: row.due_date })
                    },
                    {
                      key: 'payment',
                      label: 'Payment',
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'center',
                      getCellProps: (row: ScheduleRow) => ({ text: formatMoney(row.payment) })
                    },
                    {
                      key: 'fees',
                      label: 'Fees',
                      width: '100%',
                      cellComponent: TextCell,
                      alignment: 'center',
                      getCellProps: (row: ScheduleRow) => ({ text: formatMoney(row.fees) })
                    },
                    {
                      key: 'balance',
                      label: 'Balance',
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'center',
                      getCellProps: (row: ScheduleRow) => ({ text: formatMoney(row.balance) })
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'right',
                      getCellProps: (row: ScheduleRow) => ({ text: row.status, style: { fontWeight: row.status === 'On Time' ? 'bold' : 'normal' } })
                    },
                  ]}
                  data={scheduleRows || []}
                  className="schedule-table"
                />
              </>
            ) : null}
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="documents-section">
            <div className="documents-actions">
              <Button
                icon="icon"
                iconComponent={() => <img src={mailIcon} alt="Send Documents" style={{ width: 18, height: 18 }} />}
                interaction="default"
                justified="left"
                onClick={() => {}}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="secondary"
                name="send-documents"
                form=""
                ariaLabel="Send Documents"
                style={{ minWidth: 210, width: 210 }}
              >
                Send Documents
              </Button>
              <Button
                icon="icon"
                iconComponent={() => <img src={uploadIcon} alt="Upload" style={{ width: 18, height: 18 }} />}
                interaction="default"
                justified="left"
                onClick={() => {}}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="primary"
                name="upload"
                form=""
                ariaLabel="Upload"
                style={{ minWidth: 123, width: 123 }}
              >
                Upload
              </Button>
            </div>
            <Table
              columns={[
                { key: 'name', label: 'Name', width: '100%', cellComponent: TextCell, alignment: 'left', getCellProps: (row: DocumentRow) => ({ text: row.name, style: { fontWeight: 'bold' } }) },
                { key: 'description', label: 'Description', width: '100%', cellComponent: TextCell, alignment: 'center', getCellProps: (row: DocumentRow) => ({ text: row.description }) },
                { key: 'uploadDate', label: 'Upload date', width: '100%', cellComponent: TextCell, alignment: 'right', getCellProps: (row: DocumentRow) => ({ text: row.uploadDate}) },
              ]}
              data={documentsData}
              className="documents-table"
            />
          </div>
        )}
      </div>
      {/* Add/Edit Activity Modals */}
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
          borrowerId: loan.borrower_id || loan.borrowerId,
          borrowerName: borrower.fullName || (borrower as any).firstName || 'Borrower',
          loanId: loan.id,
          loanName: loan.nickname || 'Loan',
          vaultId: (loan as any).vault_id || (loan as any).vaultId,
          vaultName: vaults.find(v => v.id === ((loan as any).vault_id || (loan as any).vaultId))?.nickname || 'Gateway'
        } : {}}
        onNavigateBorrower={() => onShowBorrowerDetails()}
        onNavigateLoan={() => { /* already on loan page */ }}
        onNavigateVault={(id?: string) => { if (id && onShowVaultDetails) onShowVaultDetails(id); }}
        minimalEdit
        minimalEditShowAmount
        onClose={() => setSelectedActivity(null)}
        onSubmit={() => {
          setSelectedActivity(null);
        }}
      />
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditLoan
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            ...loan,
            nickname: loan.nickname || '',
            lateFee: '$5.00',
            gracePeriod: '10 days',
            dscr_limit: loan.dscr_limit || 1.50,
            paymentDue: 'Last day of the month',
            monthly_payment_amount: loan.monthly_payment_amount || getMonthlyPayment(),
          }}
          env={import.meta.env.VITE_ENV || 'dev'}
          onSave={() => {}}
          onRecastLoan={onRecastLoan}
        />
      </Modal>
      <AddEditActivity
        open={isActivityModalOpen}
        mode="add"
        initialData={{}}
        config={{
          context: 'loan_funding',
          contextId: loan.id,
          contextName: loan.nickname || 'Loan',
          loanAmount: loan.initial_balance,
          borrowerName: borrower.fullName || (borrower as any).firstName || 'Borrower',
          vaultName: vaults.find(v => v.id === ((loan as any).vault_id || (loan as any).vaultId))?.nickname || 'Gateway',
          vaultId: (loan as any).vault_id || (loan as any).vaultId,
          borrowerId: loan.borrower_id || loan.borrowerId,
          availableCategories: [
            { value: 'loan_funding', label: 'Loan funding', emoji: '💸' }
          ],
          showVaultField: false,
          showAccountField: false,
          showLoanField: false,
          showApplyToLoan: false,
          defaultCategory: 'loan_funding'
        }}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={(data) => {
          console.log('Activity submitted:', data);
          setIsActivityModalOpen(false);
        }}
      />
    </div>
  );
};

export default LoanDetails; 