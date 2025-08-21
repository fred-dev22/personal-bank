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
import { fetchLoanById, updateLoan } from '../../controllers/loanController';
import { updateVault } from '../../controllers/vaultController';
import { createActivity } from '../../controllers/activityController';
import { updateBorrower } from '../../controllers/borrowerController';


import { EmptyState } from '@jbaluch/components';
import { useActivity } from '../../contexts/ActivityContext';
import { calculateMonthlyPayment } from '../../utils/loanUtils';
import { DottedUnderline } from '../ui/DottedUnderline';

// Small visual cell to render the left timeline with status dots
const ScheduleDueCell: React.FC<{ text: string; status: string; index: number; totalCount: number; isCurrent: boolean }> = ({ text, status, index, totalCount, isCurrent }) => {
  const isCompleted = status === 'On Time';
  const connectorColor = isCompleted || isCurrent ? '#00B5AE' : '#CFCFD5';
  const dotStyle: React.CSSProperties = isCompleted
    ? { backgroundColor: '#00B5AE' }
    : isCurrent
      ? { backgroundColor: '#FFFFFF', border: '2px solid #00B5AE' }
      : { backgroundColor: '#CFCFD5' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* top connector */}
        {index > 0 && <div style={{ width: 2, height: 10, backgroundColor: connectorColor }} />}
        <div style={{ width: 12, height: 12, borderRadius: 6, ...dotStyle }} />
        {/* bottom connector */}
        {index < totalCount - 1 && <div style={{ width: 2, height: 10, backgroundColor: connectorColor }} />}
      </div>
      <span style={{ fontWeight: 500, color: '#0D1728' }}>{text}</span>
    </div>
  );
};

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
  onAddActivity?: (data: Partial<Activity> & { vault?: string; account?: string; loan?: string; note?: string; applyToLoan?: boolean }) => void;
  vaults?: Vault[];
  accounts?: Array<{ value: string; label: string }>;
  onLoansUpdate?: () => void;
  onVaultsUpdate?: () => void;
  onLoanUpdate?: (updatedLoan: Loan) => void;
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

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, borrower, onBack, onShowBorrowerDetails, onShowVaultDetails, activities, loans, activeTabId, onRecastLoan, onAddActivity, vaults = [], accounts = [], onLoansUpdate, onVaultsUpdate, onLoanUpdate }) => {
  const [activeTab, setActiveTab] = useState(activeTabId || 'summary');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[] | null>(null);
  const [lastFetchedLoanId, setLastFetchedLoanId] = useState<string | null>(null);
  const [localLoan, setLocalLoan] = useState<Loan>(loan);
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
   const currentLoan = loans.find(l => l.id === localLoan.id);
  const loanActivityIds = currentLoan?.activities || [];
  // Log pour debug
  console.log('loan.activities:', loanActivityIds);
  console.log('activities ids:', activities.map(a => a.id));
  const loanActivities = activities.filter(a => loanActivityIds.includes(a.id));

  // Dev-only demo rows when no data exists, to preview design
  const isDev = typeof import.meta !== 'undefined' && (import.meta as { env?: { MODE?: string } }).env?.MODE !== 'production';
  const demoActivities: Activity[] = [
    { id: 'd1', name: 'Paypal', type: 'loan', date: new Date('2024-11-08'), amount: 2.55, tag: 'transfer_fee' },
    { id: 'd2', name: 'Interest 9', type: 'loan', date: new Date('2024-11-08'), amount: 5.00, tag: 'interest_fee' },
    { id: 'd3', name: 'Payment 9', type: 'loan', date: new Date('2024-11-08'), amount: 300.00, tag: 'loan_payment' },
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
   const activityConfig = createSimpleLoanConfig(localLoan, accounts);

  // Handle activity submission
  const handleAddActivity = (data: Partial<Activity> & { vault?: string; account?: string; loan?: string; note?: string; applyToLoan?: boolean }) => {
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
             fetchLoanById(localLoan.id, token)
        .then(data => {
          if (Array.isArray(data.actual_payments_scheduled)) {
                         setScheduleRows((data.actual_payments_scheduled as Array<{
               date?: string;
               amount_due?: number;
               fees?: number;
               unpaid_balance?: number;
               status?: string;
             }>).map((row) => ({
              due_date: row.date ? new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
              payment: row.amount_due !== undefined ? `$${row.amount_due}` : '',
              fees: row.fees !== undefined ? `$${row.fees}` : '',
              balance: row.unpaid_balance !== undefined ? `$${row.unpaid_balance}` : '',
              status: row.status || '',
            })));
          } else {
            setScheduleRows([]);
          }
                     setLastFetchedLoanId(localLoan.id);
          hideActivity();
        })
        .catch(() => {
          setScheduleError('Erreur lors du chargement du schedule.');
          hideActivity();
        });
    }
     }, [activeTab, localLoan.id]);

  // Helper pour formater les montants avec 2 décimales
     const formatMoney = (val: string | number) => {
     const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
     if (isNaN(num)) return '$0.00';
     return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
   };

     // Utiliser le montant mensuel stocké ou le calculer si nécessaire
   const getMonthlyPayment = () => {
     if (localLoan.monthly_payment_amount) {
       return localLoan.monthly_payment_amount;
     }
     return calculateMonthlyPayment(
       localLoan.initial_balance,
       localLoan.initial_number_of_payments,
       localLoan.initial_annual_rate
     );
   };

  // Helper pour le header du schedule
  const scheduleDataToUse = scheduleRows && scheduleRows.length > 0 ? scheduleRows : [];
  
  const payoffDate = scheduleDataToUse.length > 0
    ? new Date(scheduleDataToUse[scheduleDataToUse.length - 1].due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

     const paidToDate = scheduleRows && scheduleRows.length > 0
     ? scheduleRows.filter(r => r.status.toLowerCase() === 'paid').reduce((sum, r) => sum + (parseFloat((r.payment || '').toString().replace(/[^\d.-]/g, '')) || 0), 0)
     : 0;

   const remaining = scheduleRows && scheduleRows.length > 0
     ? formatMoney(
         scheduleRows
           .filter(r => r.status.toLowerCase() !== 'paid')
           .reduce((sum, r) => sum + (parseFloat((r.payment || '').toString().replace(/[^\d.-]/g, '')) || 0), 0)
       )
     : formatMoney(0);

  // Permet de changer d'onglet dynamiquement si activeTabId change
  React.useEffect(() => {
    if (activeTabId && activeTab !== activeTabId) {
      setActiveTab(activeTabId);
    }
  }, [activeTabId]);

  // Synchronize localLoan with prop loan
  React.useEffect(() => {
    setLocalLoan(loan);
  }, [loan]);

  // Debug: Log loan status and activities
  React.useEffect(() => {
    if (activeTab === 'activity') {
      console.log('Loan status:', localLoan.status);
      console.log('Loan activities count:', loanActivities.length);
      console.log('Source activities count:', sourceActivities.length);
    }
  }, [activeTab, localLoan.status, loanActivities.length, sourceActivities.length]);

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
           {localLoan.nickname || 'Loan'} - {localLoan.id}
         </span>
        <div className="loan-header-spacer" />
        <Button
          icon="icon"
          iconComponent={() => <img src={vaultIcon} alt="Vault" style={{ width: 18, height: 18 }} />}
          interaction="default"
          justified="left"
                     onClick={() => {
             if (onShowVaultDetails && localLoan.vaultId) onShowVaultDetails(localLoan.vaultId);
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
             {localLoan.status === 'Funding' && (
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
                 value={localLoan.dscr_limit || 0}
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
                 hideValue={localLoan.dscr_limit === undefined || localLoan.dscr_limit === null}
               />
               <CashFlowCard
                 amount={getMonthlyPayment()}
                 paid={`${localLoan.payments?.length || 0} of ${localLoan.initial_number_of_payments}`}
                 nextDue={formatDateMD(localLoan.start_date)}
                 rate={localLoan.initial_annual_rate * 100}
                 balance={localLoan.current_balance}
               />
             </div>
             <div className="row">
                              <TermsCard
                  amount={localLoan.initial_balance}
                  rate={localLoan.initial_annual_rate * 100}
                  type={localLoan.loan_type}
                  startDate={localLoan.start_date}
                  numberOfMonths={localLoan.initial_number_of_payments}
                  isRecast={localLoan.is_recast}
                  recastDate={localLoan.recast_date}
                />
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div style={{ 
            display: 'flex', 
            gap: '32px',
            marginRight: selectedActivity ? '400px' : '0px',
            transition: 'margin-right 0.3s ease'
          }}>
            <section className="all-activities-table" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {loanActivities.reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
             {(localLoan.status === 'Funding' || localLoan.status === 'Not Funded' || sourceActivities.length === 0) ? (
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
          </div>
        )}
        {activeTab === 'schedule' && (
          <div className="schedule-section">
            {scheduleError ? (
              <EmptyState title="Erreur" description={scheduleError} imageName="empty" severity="info" customImage={undefined} />
            ) : scheduleDataToUse.length > 0 ? (
              <>
                <div style={{ 
                  display: 'flex', 
                  gap: 48, 
                  marginBottom: 24,
                  padding: '20px 0',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6B6B70', 
                      fontWeight: 400,
                      fontFamily: 'DM Sans',
                      lineHeight: '16px',
                      letterSpacing: '2%'
                    }}>Payoff date</div>
                    <div style={{ 
                      fontSize: '16px',
                      color: '#0D1728', 
                      fontWeight: 600,
                      fontFamily: 'DM Sans',
                      lineHeight: '21px',
                      letterSpacing: '0%'
                    }}>{payoffDate}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6B6B70', 
                      fontWeight: 400,
                      fontFamily: 'DM Sans',
                      lineHeight: '16px',
                      letterSpacing: '2%'
                    }}>Paid to date</div>
                    <div style={{ 
                      fontSize: '16px',
                      color: '#0D1728', 
                      fontWeight: 600,
                      fontFamily: 'DM Sans',
                      lineHeight: '21px',
                      letterSpacing: '0%'
                    }}>{formatMoney(paidToDate)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6B6B70', 
                      fontWeight: 400,
                      fontFamily: 'DM Sans',
                      lineHeight: '16px',
                      letterSpacing: '2%'
                    }}>Remaining</div>
                    <div style={{ 
                      fontSize: '16px',
                      color: '#0D1728', 
                      fontWeight: 600,
                      fontFamily: 'DM Sans',
                      lineHeight: '21px',
                      letterSpacing: '0%'
                    }}>{remaining}</div>
                  </div>
                </div>
                <Table
                  columns={[
                    {
                      key: 'due_date',
                      label: <DottedUnderline>Due date</DottedUnderline> as any,
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'left',
                      getCellProps: (row: ScheduleRow, index: number, totalRows: number) => ({ 
                        // Render our custom cell via React element string fallback
                        text: (ScheduleDueCell({ text: row.due_date, status: row.status, index, totalCount: totalRows, isCurrent: index === 2 }) as unknown) as string
                      })
                    },
                    {
                      key: 'payment',
                      label: 'Payment',
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'center',
                      getCellProps: (row: ScheduleRow) => {
                        const isCompleted = row.status === 'On Time';
                        const paymentAmount = `$${parseFloat(row.payment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        return {
                          text: isCompleted ? `${paymentAmount} / ${paymentAmount}` : paymentAmount,
                          style: { 
                            textAlign: 'center',
                            fontWeight: isCompleted ? 600 : 500
                          }
                        };
                      }
                    },
                    {
                      key: 'fees',
                      label: <DottedUnderline>Fees</DottedUnderline> as any,
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
                      label: <DottedUnderline>Status</DottedUnderline> as any,
                      cellComponent: TextCell,
                      width: '100%',
                      alignment: 'right',
                      getCellProps: (row: ScheduleRow) => ({ 
                        text: row.status,
                        style: { 
                          textAlign: 'right',
                          fontWeight: row.status === 'On Time' ? 600 : 400,
                          color: row.status === 'On Time' ? '#0D1728' : '#6B6B70'
                        }
                      })
                    },
                  ]}
                  data={scheduleDataToUse}
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
           borrowerId: localLoan.borrower_id || localLoan.borrowerId,
           borrowerName: borrower.fullName || (borrower as any).firstName || 'Borrower',
           loanId: localLoan.id,
           loanName: localLoan.nickname || 'Loan',
           vaultId: (localLoan as any).vault_id || (localLoan as any).vaultId,
           vaultName: vaults.find(v => v.id === ((localLoan as any).vault_id || (localLoan as any).vaultId))?.nickname || 'Gateway'
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
             ...localLoan,
             nickname: localLoan.nickname || '',
             lateFee: '$5.00',
             gracePeriod: '10 days',
             dscr_limit: localLoan.dscr_limit || 1.50,
             paymentDue: 'Last day of the month',
             monthly_payment_amount: localLoan.monthly_payment_amount || getMonthlyPayment(),
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
           contextId: localLoan.id,
           contextName: localLoan.nickname || 'Loan',
           loanAmount: localLoan.initial_balance,
           borrowerName: borrower.fullName || (borrower as any).firstName || 'Borrower',
           vaultName: vaults.find(v => v.id === ((localLoan as any).vault_id || (localLoan as any).vaultId))?.nickname || 'Gateway',
           vaultId: (localLoan as any).vault_id || (localLoan as any).vaultId,
           borrowerId: localLoan.borrower_id || localLoan.borrowerId,
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
        onSubmit={async (data) => {
          console.log('Loan funding activity submitted:', data);
          
          try {
            const token = localStorage.getItem('authToken');
            if (!token || !data.amount) {
              showActivity('Missing required data for funding');
              return;
            }

                         // 1. Update loan status from "Funding" to "Funded"
             await updateLoan(token, localLoan.id, {
               status: 'Funded',
               funded_date: data.date instanceof Date ? data.date.toISOString() : data.date
             });
            
            // 2. Update vault balance (debit) - transfer funds OUT of vault
            const vaultId = data.vault;
            if (vaultId) {
              const currentVault = vaults.find(v => v.id === vaultId);
              if (currentVault) {
                // Get current balance safely
                const currentBalance = (currentVault as any).current_balance || (currentVault as any).balance || 0;
                const newVaultBalance = currentBalance - data.amount;
                
                // Update vault with new balance
                const bankId = localStorage.getItem('bankId');
                if (bankId) {
                  await updateVault(token, bankId, vaultId, {
                    ...currentVault,
                    current_balance: newVaultBalance
                  } as any);
                }
                console.log(`Vault ${currentVault.nickname} debited by $${data.amount}. New balance: $${newVaultBalance}`);
              }
            }
            
                         // 3. Update borrower balance (credit) - transfer funds TO borrower
             const borrowerId = localLoan.borrower_id || localLoan.borrowerId;
            if (borrowerId) {
              const bankId = localStorage.getItem('bankId');
              if (bankId) {
                // Get current borrower balance safely
                const currentBorrowerBalance = (borrower as any).current_balance || (borrower as any).balance || 0;
                const newBorrowerBalance = currentBorrowerBalance + data.amount;
                
                await updateBorrower(token, bankId, borrowerId, {
                  ...borrower,
                  current_balance: newBorrowerBalance
                } as any);
                console.log(`Borrower ${borrower.fullName} credited with $${data.amount}. New balance: $${newBorrowerBalance}`);
              }
            }
            
            // 4. Create activity record for audit trail
            const bankIdForActivity = localStorage.getItem('bankId');
            if (bankIdForActivity && data.date) {
              await createActivity(token, {
                name: 'Loan Funding',
                type: 'outgoing',
                date: data.date instanceof Date ? data.date : new Date(data.date),
                amount: data.amount,
                tag: 'loan_funding',
                                 vault: vaultId,
                 loan: localLoan.id,
                note: data.note || `Loan funding: $${data.amount} transferred from ${vaults.find(v => v.id === vaultId)?.nickname || 'Vault'} to ${borrower.fullName}`
              });
              console.log('Activity record created for loan funding');
            }
            
            // 5. Show success message with transfer details
            showActivity(`Loan funded successfully! $${data.amount} transferred from ${vaults.find(v => v.id === vaultId)?.nickname || 'Vault'} to ${borrower.fullName}`);
            
            // 6. Close modal
            setIsActivityModalOpen(false);
            
            // 7. Refresh data to show updated balances and loan status
            // Trigger refresh of loans and vaults data
            if (onLoansUpdate) {
              onLoansUpdate();
            }
            if (onVaultsUpdate) {
              onVaultsUpdate();
            }
            
                         // 8. Fetch the updated loan to refresh the view immediately
             try {
               const updatedLoan = await fetchLoanById(localLoan.id, token);
               console.log('✅ Updated loan after funding:', updatedLoan);
               
               // Update the local loan state to reflect the new status
               // This will trigger a re-render and show the "Funded" status
               if (updatedLoan) {
                 // Update local loan state immediately
                 setLocalLoan(updatedLoan);
                 
                 // Call the onLoanUpdate callback to update the loan in parent component
                 if (onLoanUpdate) {
                   onLoanUpdate(updatedLoan);
                 }
                 
                 // Also trigger the general loans update
                 if (onLoansUpdate) {
                   onLoansUpdate();
                 }
               }
             } catch (fetchError) {
               console.error('❌ Error fetching updated loan:', fetchError);
               // Continue anyway, the onLoansUpdate should handle the refresh
             }
            
          } catch (error) {
            console.error('Error funding loan:', error);
            showActivity('Failed to fund loan. Please try again.');
          }
        }}
      />
    </div>
  );
};

export default LoanDetails; 