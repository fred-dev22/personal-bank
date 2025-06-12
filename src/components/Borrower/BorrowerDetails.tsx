import React, { useState } from 'react';
import { Button, Tabs, IconButton, Input, MenuButton, Table, TextCell, EmptyState } from '@jbaluch/components';
import type { Borrower as BorrowerType, Loan } from '../../types/types';
import './BorrowerDetails.css';
import summaryIcon from '../../assets/summary.svg';
import loansIcon from '../../assets/leverage-loans.svg';
import commentsIcon from '../../assets/comment.svg';
import searchIcon from '/search.svg';
import filterIcon from '/filter_alt.svg';
import { Modal } from '../Modal/Modal';
import AddBorrower from './AddBorrower';
import addCommentIcon from '../../assets/add-comment.svg';

interface BorrowerDetailsProps {
  borrower: BorrowerType;
  loans: Loan[];
  onBack: () => void;
}

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Fonctions pour les icônes des tabs
const SummaryIcon = () => <img src={summaryIcon} alt="Summary" style={{ width: 16, height: 16 }} />;
const ActivityIcon = () => <img src={loansIcon} alt="Loans" style={{ width: 16, height: 16 }} />;
const DocumentsIcon = () => <img src={commentsIcon} alt="Comments" style={{ width: 16, height: 16 }} />;

// Type pour les lignes de commentaires
type CommentRow = {
  date: string;
  description: string;
  creator: string;
};

// Type pour les lignes du tableau summary
type SummaryRow = {
  loan_id: string;
  payment_received: string;
  payment_expected: string;
  difference: string;
};

export const BorrowerDetails: React.FC<BorrowerDetailsProps> = ({ borrower, loans, onBack }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Loans du borrower sélectionné
  const borrowerLoans = loans.filter(
    loan => loan.borrower_id === borrower.id || loan.borrowerId === borrower.id
  );

  // State pour la recherche et le filtre
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterCount] = useState(0); // à adapter si tu ajoutes des filtres

  // Calcul du total unpaid (somme des current_balance des loans du borrower)
  const totalUnpaid = borrowerLoans.reduce((acc, loan) => acc + (loan.current_balance || 0), 0);

  // Fonction utilitaire pour normaliser la casse et les espaces
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, ' ').trim();
  const filteredLoans = borrowerLoans.filter(loan => {
    const search = normalize(searchValue);
    return search === '' || (loan.nickname && normalize(loan.nickname).includes(search));
  });

  const handleClearAll = () => {
    setSearchValue("");
    setSearching(false);
    // reset filters ici si besoin
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
  const handleFilterClick = () => {
    // ouvrir la fenêtre de filtre ici
  };
  const handleMenuAction = (item: { id: string; label: string }) => {
    if (item.id === 'add-loan') {
      // logique pour ajouter un prêt
    }
  };
  const SearchIcon = () => <img src={searchIcon} alt="search" />;
  const FilterIcon = () => <img src={filterIcon} alt="filter" />;

  return (
    <div className="borrowers">
      {/* Header custom */}
      <div className="borrower-header">
        <button className="borrower-back-btn" onClick={onBack} aria-label="Back">
          <img src="/nav_arrow_back.svg" alt="Back" className="borrower-back-icon" />
        </button>
        {/* Avatar : uniquement initiales car pas de propriété photo */}
        <div className="borrower-avatar borrower-avatar-initials">
          {getInitials(borrower.fullName)}
        </div>
        <span className="borrower-name">{borrower.firstName || (borrower.fullName?.split(' ')[0]) || 'Prosper'}</span>
        <div className="borrower-header-spacer" />
        <Button
          className="edit-borrower-btn"
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          onClick={() => setIsEditModalOpen(true)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="edit-borrower"
          form=""
          ariaLabel="Edit"
        >
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeTabId={activeTab}
        onTabChange={(tab: string) => setActiveTab(tab)}
        tabs={[
          {
            iconComponent: SummaryIcon,
            id: 'summary',
            label: 'Summary',
          },
          {
            iconComponent: ActivityIcon,
            id: 'loans',
            label: 'Loans',
          },
          {
            iconComponent: DocumentsIcon,
            id: 'comments',
            label: 'Comments',
          },
        ]}
      />

      {/* Content */}
      <div className="content">
        {activeTab === 'summary' && (
          <>
            <div className="chart-card">
              <div className="chart">
                <div className="title-subtitle">
                  <div className="title">Payments received vs. expected</div>
                  <div className="text-wrapper">Last 12 months</div>
                </div>
              </div>
              <div className="card" style={{ boxShadow: '0 2px 8px 0 rgba(16,30,54,0.04)', border: 'none', background: '#fff' }}>
                <div className="body" style={{ gap: 16, paddingBottom: 0 }}>
                  <div className="title-subtitle" style={{ marginBottom: 8 }}>
                    <div className="title" style={{ color: '#1AC9A0', fontWeight: 700, fontSize: 28, textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>+$2,563.00</div>
                    <div className="subtitle" style={{ color: '#6b6b70', fontWeight: 400, fontSize: 16, textAlign: 'center' }}>Surplus</div>
                  </div>
                  <div style={{ width: '100%', margin: '24px 0 0 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#7CB7E8', marginRight: 8 }} />
                        <span style={{ color: '#6b6b70', fontWeight: 500, fontSize: 15 }}>Payments received</span>
                      </span>
                      <span style={{ color: '#23263B', fontWeight: 700, fontSize: 17 }}>$102,563.00</span>
                    </div>
                    <div style={{ borderTop: '1px solid #ececec', margin: '8px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#FF7F50', marginRight: 8 }} />
                        <span style={{ color: '#6b6b70', fontWeight: 500, fontSize: 15 }}>Payments expected</span>
                      </span>
                      <span style={{ color: '#23263B', fontWeight: 700, fontSize: 17 }}>$100,000.00</span>
                    </div>
                  </div>
                </div>
                <div className="subtitle-2" style={{ color: '#b5b5b5', fontWeight: 400, fontSize: 15, marginTop: 24, textAlign: 'center' }}>Total, to date</div>
              </div>
            </div>
            {/* Tableau custom summary (remplace BorrowerCashFlow Content) */}
            <div style={{gap: 16}}>
              {/* Group label */}
              <div style={{
                color: '#6b6b70',
                fontWeight: 500,
                fontSize: 15,
                padding: '8px 16px',
              }}>
                September, 2024
              </div>
              <Table
                className="summary-table-fullwidth"
                columns={[
                  {
                    key: 'loan_id',
                    label: 'Loan ID',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'center',
                    getCellProps: (row: SummaryRow) => ({
                      text: row.loan_id,
                      alignment: 'center',
                      style: { fontWeight: 500 },
                    }),
                  },
                  {
                    key: 'payment_received',
                    label: 'Payment received',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'center',
                    getCellProps: (row: SummaryRow) => ({
                      text: row.payment_received,
                      alignment: 'center',
                      style: { fontWeight: 600 },
                    }),
                  },
                  {
                    key: 'payment_expected',
                    label: 'Payment expected',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'center',
                    getCellProps: (row: SummaryRow) => ({
                      text: row.payment_expected,
                      alignment: 'center',
                    }),
                  },
                  {
                    key: 'difference',
                    label: 'Difference',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'center',
                    getCellProps: (row: SummaryRow) => ({
                      text: row.difference,
                      alignment: 'center',
                      style: { color: '#1AC9A0', fontWeight: 600 },
                    }),
                  },
                ]}
                data={[
                  { loan_id: '06-02', payment_received: '$301.54', payment_expected: '$300.00', difference: '+1.54' },
                  { loan_id: '08-02', payment_received: '$301.54', payment_expected: '$300.00', difference: '+1.54' },
                  { loan_id: '09-02', payment_received: '$151.54', payment_expected: '$150.00', difference: '+1.54' },
                ] as SummaryRow[]}
                defaultSortColumn="loan_id"
                defaultSortDirection="asc"
              />
            </div>
          </>
        )}
        {activeTab === 'loans' && (
          <section className="borrower-loans">
            <div className="search-filter-action" style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
              {/* Left: total unpaid */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1A314B', fontWeight: 600, fontSize: 18, marginRight: 4 }}>
                  {totalUnpaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
                <span style={{ color: '#7B7B93', fontWeight: 400, fontSize: 15 }}>total unpaid</span>
              </div>
              {/* Right: actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {searching || searchValue !== "" ? (
                  <Input
                    onChange={handleSearchInputChange}
                    placeholder="Search loans"
                    value={searchValue}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") setSearching(false);
                    }}
                    style={{ maxWidth: 200, minWidth: 100, marginLeft: 0 }}
                    onBlur={() => setSearching(false)}
                    autoFocus
                  />
                ) : (
                  <IconButton
                    aria-label="Search"
                    icon={SearchIcon}
                    onClick={() => setSearching(true)}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    type="secondary"
                    interaction="secondary"
                    notificationCount={0}
                  />
                )}
                <IconButton
                  aria-label={`Filter - ${filterCount} filters applied`}
                  icon={FilterIcon}
                  notificationCount={filterCount}
                  onClick={handleFilterClick}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  showNotification
                  type="secondary"
                  interaction="secondary"
                />
                <MenuButton
                  items={[
                    { id: 'add-loan', label: 'Add loan' }
                  ]}
                  label="Loan"
                  menuStyle="text"
                  onItemClick={handleMenuAction}
                  type="primary"
                  ariaLabel={undefined}
                  aria-label="Add Loan"
                  className="add-loan-btn"
                />
                {(searchValue !== "" || filterCount > 0) && (
                  <Button
                    icon="iconless"
                    iconComponent={undefined}
                    interaction="default"
                    justified="right"
                    onClick={handleClearAll}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    type="secondary"
                    ariaLabel={undefined}
                    aria-label="Clear All"
                    name="clear-all"
                    form=""
                    className="clear-all-btn"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            {filteredLoans.length === 0 ? (
              <div className="empty-state-center">
                <EmptyState
                  imageName="NoLoans"
                  title="No loans"
                  description={'There are no loans for this borrower.'}
                  customImage={undefined}
                />
              </div>
            ) : (
              <Table
                key={searchValue + filteredLoans.length}
                className="loans-table-fullwidth"
                columns={[
                  {
                    key: 'nickname',
                    label: 'Name',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.nickname,
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'loan_number',
                    label: 'ID',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.loan_number ? `${row.loan_number}` : '',
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'initial_payment_amount',
                    label: 'Payment',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.initial_payment_amount !== undefined
                        ? `$${row.initial_payment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '',
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'initial_number_of_payments',
                    label: 'No.',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.initial_number_of_payments
                        ? `${row.loan_number} / ${row.initial_number_of_payments}`
                        : '',
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'initial_annual_rate',
                    label: 'Loan constant',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.initial_annual_rate !== undefined
                        ? `${row.initial_annual_rate.toFixed(2)}%`
                        : '',
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'initial_balance',
                    label: 'Target UPB',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.initial_balance !== undefined
                        ? `$${row.initial_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '',
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'current_balance',
                    label: 'Actual UPB',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => ({
                      text: row.current_balance !== undefined
                        ? `$${row.current_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '',
                      alignment: 'left',
                    }),
                  },
                  {
                    key: 'difference',
                    label: 'Difference',
                    cellComponent: TextCell,
                    width: '100%',
                    alignment: 'left',
                    getCellProps: (row: Loan) => {
                      const diff = (row.current_balance ?? 0) - (row.initial_balance ?? 0);
                      let color = '#1AC9A0';
                      if (diff > 0) color = '#1AC9A0';
                      else if (diff < 0) color = '#F25B5B';
                      else color = '#7B7B93';
                      return {
                        text: `${diff >= 0 ? '+' : ''}${diff.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
                        alignment: 'left',
                        style: { color, fontWeight: 600 },
                      };
                    },
                  },
                ]}
                data={filteredLoans}
                defaultSortColumn="nickname"
                defaultSortDirection="asc"
              />
            )}
          </section>
        )}
        {activeTab === 'comments' && (
          <section className="all-comments-table" style={{ background: 'transparent', borderRadius: 10, minHeight: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <Button
                icon="iconless"
                iconComponent={undefined}
                interaction="default"
                onClick={() => {}}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="primary"
                name="add-comment"
                form=""
                ariaLabel="Add Comment"
                style={{ width: 180 }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={addCommentIcon} alt="Add" style={{ width: 18, height: 18 }} />
                  Add Comment
                </span>
              </Button>
            </div>
            <Table
              className="comments-table-fullwidth"
              columns={[
                {
                  key: 'date',
                  label: 'Date',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'left',
                  getCellProps: (row: CommentRow) => ({
                    text: row.date,
                    alignment: 'left',
                    style: { fontWeight: 600 },
                  }),
                },
                {
                  key: 'description',
                  label: 'Description',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'left',
                  getCellProps: (row: CommentRow) => ({
                    text: row.description,
                    alignment: 'left',
                  }),
                },
                {
                  key: 'creator',
                  label: 'Creator',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'left',
                  getCellProps: (row: CommentRow) => ({
                    text: row.creator,
                    alignment: 'left',
                  }),
                },
              ]}
              data={[
                { date: 'Oct 1, 2023', description: 'description is 58 characters max, Lorem ipsum dolor sit am', creator: 'Jerry Seinfeld' },
                { date: 'Oct 1, 2023', description: 'description is 58 characters max, Lorem ipsum dolor sit am', creator: 'Jerry Seinfeld' },
              ] as CommentRow[]}
              defaultSortColumn="date"
              defaultSortDirection="desc"
            />
          </section>
        )}
      </div>

      {/* Modal édition borrower */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <AddBorrower
          mode="edit"
          initialData={borrower}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={() => {
            // TODO: Appel API pour update le borrower ici
            setIsEditModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default BorrowerDetails;