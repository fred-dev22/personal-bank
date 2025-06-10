import React, { useState } from 'react';
import { Button, Tabs } from '@jbaluch/components';
import './LoanDetails.css';
import vaultIcon from '../../assets/vault.svg';
import borrowerIcon from '../../assets/borrower.svg';
import summaryIcon from '../../assets/summary.svg';
import activityIcon from '../../assets/activity.svg';
import scheduleIcon from '../../assets/schedule.svg';
import documentIcon from '../../assets/document.svg';

interface LoanDetailsProps {
  loan: any; // à typer selon Loan
  borrower: { fullName: string; firstName?: string };
  onBack: () => void;
}

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SummaryIcon = () => <img src={summaryIcon} alt="Summary" style={{ width: 16, height: 16 }} />;
const ActivityIcon = () => <img src={activityIcon} alt="Activity" style={{ width: 16, height: 16 }} />;
const ScheduleIcon = () => <img src={scheduleIcon} alt="Schedule" style={{ width: 16, height: 16 }} />;
const DocumentIcon = () => <img src={documentIcon} alt="Documents" style={{ width: 16, height: 16 }} />;

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, borrower, onBack }) => {
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
        <span className="loan-name">{loan.nickname || loan.name || 'Loan'}</span>
        <div className="loan-header-spacer" />
        <Button
          className="loan-header-btn"
          iconComponent={() => <img src={vaultIcon} alt="Vault" style={{ width: 18, height: 18 }} />}
          interaction="default"
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="vault"
          form=""
          ariaLabel="Vault"
        >
          Vault
        </Button>
        <Button
          className="loan-header-btn"
          iconComponent={() => <img src={borrowerIcon} alt="Borrower" style={{ width: 18, height: 18 }} />}
          interaction="default"
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="borrower"
          form=""
          ariaLabel="Borrower"
        >
          Borrower
        </Button>
        <Button
          className="loan-header-btn"
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
        {activeTab === 'summary' && <div>Summary content</div>}
        {activeTab === 'activity' && <div>Activity content</div>}
        {activeTab === 'schedule' && <div>Schedule content</div>}
        {activeTab === 'documents' && <div>Documents content</div>}
      </div>
    </div>
  );
};

export default LoanDetails; 