import React, { useState } from 'react';
import { Button, Tabs, Table, TextCell, TagCell } from '@jbaluch/components';
import './LoanDetails.css';
import vaultIcon from '../../assets/vault.svg';
import borrowerIcon from '../../assets/borrower.svg';
import summaryIcon from '../../assets/summary.svg';
import activityIcon from '../../assets/activity.svg';
import scheduleIcon from '../../assets/schedule.svg';
import documentIcon from '../../assets/document.svg';
import mailIcon from '../../assets/mail.svg';
import uploadIcon from '../../assets/upload.svg';
import type { Loan, Borrower, Activity } from '../../types/types';
import { DSCRCard } from '../Vaults/Vault Widgets/DSCRCard';
import { CashFlowCard } from '../Cards/CashFlowCard/CashFlowCard';
import { TermsCard } from '../Cards/TermsCard/TermsCard';
import { EditLoan } from './EditLoan';
import { Modal } from '../Modal/Modal';
import { AddEditActivity } from '../Activities/AddEditActivity';
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

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, borrower, onBack, onShowBorrowerDetails, onShowVaultDetails, activities, loans, activeTabId, onRecastLoan }) => {
  const [activeTab, setActiveTab] = useState(activeTabId || 'summary');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[] | null>(null);
  const [lastFetchedLoanId, setLastFetchedLoanId] = useState<string | null>(null);
  const { showActivity, hideActivity } = useActivity();

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

  // Mapping pour la table
  const activityRows = loanActivities.map(a => ({
    name: a.name,
    category: a.tag || '',
    date: a.date ? new Date(a.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '',
    amount: a.amount,
    type: a.type,
  }));

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
      <Tabs
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            iconComponent: SummaryIcon,
            id: 'summary',
            label: 'Summary',
          },
          {
            iconComponent: ActivityIcon,
            id: 'activity',
            label: 'Activity',
          },
          {
            iconComponent: ScheduleIcon,
            id: 'schedule',
            label: 'Schedule',
          },
          {
            iconComponent: DocumentIcon,
            id: 'documents',
            label: 'Documents',
          },
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
                onClick={() => {}}
              >
                Add
              </Button>
            </div>
            <Table
              columns={[
                { key: 'name', label: 'Name', width: '100%', cellComponent: TextCell, alignment: 'left', getCellProps: (row: typeof activityRows[0]) => ({ text: row.name }) },
                { key: 'category', label: 'Category', width: '100%', cellComponent: TagCell, alignment: 'center', getCellProps: (row: typeof activityRows[0]) => ({ text: row.category }) },
                { key: 'date', label: 'Date', width: '100%', cellComponent: TextCell, alignment: 'center', getCellProps: (row: typeof activityRows[0]) => ({ text: row.date }) },
                { key: 'amount', label: 'Amount', width: '100%', cellComponent: TextCell, alignment: 'right', getCellProps: (row: typeof activityRows[0]) => ({ text: row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }) },
              ]}
              data={activityRows}
              className="activities-table-fullwidth"
            />
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
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditLoan
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            note_id: loan.note_id,
            nickname: loan.nickname || '',
            lateFee: '$5.00',
            gracePeriod: '10 days',
            dscr_limit: loan.dscr_limit || 1.50,
            paymentDue: 'Last day of the month',
            initial_balance: loan.initial_balance,
            current_balance: loan.current_balance,
            initial_annual_rate: loan.initial_annual_rate,
            initial_number_of_payments: loan.initial_number_of_payments,
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
          context: 'loan',
          contextId: loan.id,
          contextName: loan.nickname || 'Loan',
          availableCategories: [
            { value: 'payment', label: 'Payment', emoji: '💰' },
            { value: 'fee', label: 'Fee', emoji: '📋' },
            { value: 'other', label: 'Other', emoji: '📝' }
          ],
          showVaultField: false,
          showAccountField: false,
          showLoanField: false,
          showApplyToLoan: false,
          defaultCategory: 'payment'
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