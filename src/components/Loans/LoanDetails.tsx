import React, { useState } from 'react';
import { Button, Tabs, Table,TextCell } from '@jbaluch/components';
import './LoanDetails.css';
import vaultIcon from '../../assets/vault.svg';
import borrowerIcon from '../../assets/borrower.svg';
import summaryIcon from '../../assets/summary.svg';
import activityIcon from '../../assets/activity.svg';
import scheduleIcon from '../../assets/schedule.svg';
import documentIcon from '../../assets/document.svg';
import mailIcon from '../../assets/mail.svg';
import uploadIcon from '../../assets/upload.svg';
import type { Loan, Borrower } from '../../types/types';
import { IncomeDscrCard } from '../Cards/IncomeDscrCard/IncomeDscrCard';
import { CashFlowCard } from '../Cards/CashFlowCard/CashFlowCard';
import { TermsCard } from '../Cards/TermsCard/TermsCard';
import { EditLoan } from './EditLoan';
import { Modal } from '../Modal/Modal';
import { fetchLoanById } from '../../controllers/loanController';
import { EmptyState } from '@jbaluch/components';
import { useAuth } from '../../contexts/AuthContext';
import { useActivity } from '../../contexts/ActivityContext';

interface LoanDetailsProps {
  loan: Loan;
  borrower: Borrower;
  onBack: () => void;
  onShowBorrowerDetails: () => void;
  onShowVaultDetails?: (vaultId: string) => void;
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

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, borrower, onBack, onShowBorrowerDetails, onShowVaultDetails }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[] | null>(null);
  const [lastFetchedLoanId, setLastFetchedLoanId] = useState<string | null>(null);
  const { user } = useAuth();
  const { showActivity, hideActivity } = useActivity();

  React.useEffect(() => {
    if (
      activeTab === 'schedule' &&
      (scheduleRows === null || loan.id !== lastFetchedLoanId)
    ) {
      setScheduleLoading(true);
      setScheduleError(null);
      showActivity('Payments are loading...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setScheduleError('Vous devez être connecté pour voir le schedule.');
        setScheduleLoading(false);
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
          setScheduleLoading(false);
          hideActivity();
        })
        .catch(() => {
          setScheduleError('Erreur lors du chargement du schedule.');
          setScheduleLoading(false);
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
        <span className="loan-name">{loan.nickname || 'Loan'}</span>
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
            <div className="row">
              <IncomeDscrCard
                status={
                  loan.dscr_limit === undefined || loan.dscr_limit === null
                    ? 'no-DSCR'
                    : loan.dscr_limit < 1
                    ? 'bad'
                    : loan.dscr_limit < 1.25
                    ? 'mediocre'
                    : 'good'
                }
              />
              <CashFlowCard
                amount={loan.initial_payment_amount}
                paid={`${loan.payments?.length || 0} of ${loan.initial_number_of_payments}`}
                nextDue={formatDateMD(loan.start_date)}
                rate={loan.initial_annual_rate}
                balance={loan.current_balance}
              />
            </div>
            <div className="row">
              <TermsCard
                amount={loan.initial_balance}
                rate={loan.initial_annual_rate}
                type={loan.loan_type}
                startDate={formatDateMD(loan.start_date)}
                payoffDate={formatDateMD(loan.funded_date)}
              />
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div className="activity-section">
            <Table
              columns={[
                { key: 'name', label: 'Name', cellComponent: TextCell, width: '100%', alignment: 'left', getCellProps: (row: any) => ({ text: row.name }) },
                { key: 'category', label: 'Category', cellComponent: TextCell, width: '100%', alignment: 'center', getCellProps: (row: any) => ({ text: row.category, style: { fontWeight: 'bold', color: row.categoryColor, background: row.categoryBg, borderRadius: 8, padding: '2px 8px', display: 'inline-block' } }) },
                { key: 'date', label: 'Date', cellComponent: TextCell, width: '100%', alignment: 'center', getCellProps: (row: any) => ({ text: row.date }) },
                { key: 'amount', label: 'Amount', cellComponent: TextCell, width: '100%', alignment: 'right', getCellProps: (row: any) => ({ text: row.amount, style: { color: row.amountColor || undefined } }) },
              ]}
              data={[
                { name: 'Paypal', category: 'Transfer fee', categoryColor: '#e53935', categoryBg: '#fdeaea', date: 'Nov 8', amount: '$2.55' },
                { name: 'Paypal', category: 'Interest fee', categoryColor: '#757575', categoryBg: '#f3f3f3', date: 'Nov 8', amount: '$2.55' },
                { name: 'Paypal', category: 'Transfer fee', categoryColor: '#e53935', categoryBg: '#fdeaea', date: 'Nov 8', amount: '$2.55' },
                { name: 'Interest 9', category: 'Interest fee', categoryColor: '#757575', categoryBg: '#f3f3f3', date: 'Nov 8', amount: '$5.00' },
                { name: 'Interest 9', category: 'Interest fee', categoryColor: '#757575', categoryBg: '#f3f3f3', date: 'Nov 8', amount: '$5.00' },
                { name: 'Payment 9', category: 'Loan payment', categoryColor: '#388e3c', categoryBg: '#eafaf1', date: 'Nov 8', amount: '$3000.00', amountColor: '#388e3c' },
                { name: 'Payment 9', category: 'Interest fee', categoryColor: '#757575', categoryBg: '#f3f3f3', date: 'Nov 8', amount: '$300.00' },
                { name: 'Payment 9', category: 'Loan payment', categoryColor: '#388e3c', categoryBg: '#eafaf1', date: 'Nov 8', amount: '$3000.00', amountColor: '#388e3c' },
              ]}
              className="activity-table"
            />
          </div>
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
          }}
          env={import.meta.env.VITE_ENV || 'dev'}
          onSave={() => {}}
        />
      </Modal>
    </div>
  );
};

export default LoanDetails; 