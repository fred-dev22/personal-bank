import React, { useState } from 'react';
import { Button, Tabs, Table } from '@jbaluch/components';
import './LoanDetails.css';
import vaultIcon from '../../assets/vault.svg';
import borrowerIcon from '../../assets/borrower.svg';
import summaryIcon from '../../assets/summary.svg';
import activityIcon from '../../assets/activity.svg';
import scheduleIcon from '../../assets/schedule.svg';
import documentIcon from '../../assets/document.svg';
import type { Loan, Borrower } from '../../types/types';
import { IncomeDscrCard } from '../Cards/IncomeDscrCard/IncomeDscrCard';
import { CashFlowCard } from '../Cards/CashFlowCard/CashFlowCard';
import { TermsCard } from '../Cards/TermsCard/TermsCard';

interface LoanDetailsProps {
  loan: Loan;
  borrower: Borrower;
  onBack: () => void;
  onShowBorrowerDetails: () => void;
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

const scheduleData: ScheduleRow[] = [
  { due_date: 'Oct 8', payment: '$300.00 / $300.00', fees: '$35.00', balance: '$2,135.00', status: 'On Time' },
  { due_date: 'Nov 8', payment: '$300.00 / $300.00', fees: '$40.00', balance: '$1,870.00', status: 'On Time' },
  { due_date: 'Dec 8', payment: '$300.00', fees: '$35.00', balance: '$1,605.00', status: 'Upcoming' },
  { due_date: 'Jan 8', payment: '$300.00', fees: '$35.00', balance: '$1,340.00', status: 'Upcoming' },
  { due_date: 'Feb 8', payment: '$300.00', fees: '$35.00', balance: '$1,075.00', status: 'Upcoming' },
  { due_date: 'Mar 8', payment: '$300.00', fees: '$35.00', balance: '$810.00', status: 'Upcoming' },
];

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, borrower, onBack, onShowBorrowerDetails }) => {
  const [activeTab, setActiveTab] = useState('summary');
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
          onClick={() => {}}
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
          onClick={() => {}}
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
        {activeTab === 'activity' && <div>Activity content</div>}
        {activeTab === 'schedule' && (
          <div className="schedule-section">
            <div className="table-header">
              <div className="vaults-description">
                <div className="subtitle">Payoff date</div>
                <div className="title">{formatDateMD(loan.funded_date)}</div>
              </div>
              <div className="vaults-description">
                <div className="subtitle">Paid to date</div>
                <div className="text-wrapper">$600.00</div>
              </div>
              <div className="vaults-description">
                <div className="subtitle">Remaining</div>
                <div className="title">$1,870.00</div>
              </div>
            </div>
            <Table
              columns={[
                { key: 'due_date', label: 'Due date', width: '100%', alignment: 'left', getCellProps: (row: ScheduleRow) => ({ text: row.due_date, alignment: 'left' }) },
                { key: 'payment', label: 'Payment', width: '100%', alignment: 'left', getCellProps: (row: ScheduleRow) => ({ text: row.payment, alignment: 'left' }) },
                { key: 'fees', label: 'Fees', width: '100%', alignment: 'left', getCellProps: (row: ScheduleRow) => ({ text: row.fees, alignment: 'left' }) },
                { key: 'balance', label: 'Balance', width: '100%', alignment: 'left', getCellProps: (row: ScheduleRow) => ({ text: row.balance, alignment: 'left' }) },
                { key: 'status', label: 'Status', width: '100%', alignment: 'left', getCellProps: (row: ScheduleRow) => ({ text: row.status, alignment: 'left', style: { fontWeight: row.status === 'On Time' ? 'bold' : 'normal' } }) },
              ]}
              data={scheduleData}
              className="schedule-table"
            />
          </div>
        )}
        {activeTab === 'documents' && <div>Documents content</div>}
      </div>
    </div>
  );
};

export default LoanDetails; 