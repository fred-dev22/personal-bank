import React, { useState, useRef } from "react";
import { Button, IconButton, Input, MenuButton, Table, TextCell, MetricCell, TagCell, EmptyState } from "@jbaluch/components";
import { SegmentedControl } from '../ui';
import type { SegmentedControlItem } from '../ui';
import "./style.css";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import type { Loan, Borrower as BorrowerType, Activity } from '../../types/types';
import searchIcon from '/search.svg';
import filterIcon from '/filter_alt.svg';
import LoanDetails from './LoanDetails';
import BorrowerDetails from '../Borrower/BorrowerDetails';
import { FilterPopover } from '../FilterPopover/FilterPopover';

const SearchIcon = () => <img src={searchIcon} alt="search" />;
const FilterIcon = () => <img src={filterIcon} alt="filter" />;

interface LoansProps {
  loans: Loan[];
  borrowers: BorrowerType[];
  className?: string;
  imagesClassName?: string;
  imagesClassNameOverride?: string;
  divClassName?: string;
  onShowBorrowerDetails?: (borrowerId: string) => void;
  onShowVaultDetails?: (vaultId: string) => void;
  activities?: Activity[];
  selectedLoanId?: string | null;
  onShowLoanDetails?: (loanId: string) => void;
  onAddLoan?: () => void;
}

type FilterValue = string | { min: string; max: string };

export const Loans: React.FC<LoansProps> = ({
  loans,
  borrowers,
  className = "",
  onShowBorrowerDetails,
  onShowVaultDetails,
  activities = [],
  selectedLoanId = null,
  onShowLoanDetails,
  onAddLoan,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Funded');
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedBorrower, setSelectedBorrower] = useState<BorrowerType | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue>>({ amount: { min: '', max: '' }, date: { min: '', max: '' } });
  const filterAnchorEl = useRef<HTMLButtonElement>(null);

  const statusItems: SegmentedControlItem[] = [
    { id: 'Funded', label: 'On Track', count: 2 },
    { id: 'To Fund', label: 'To Fund', count: 2 },
    { id: 'behind', label: 'Late', count: 0 },
    { id: 'Complete', label: 'Complete', count: 0 }
  ];
  const filterCount = Object.values(appliedFilters).filter(v => {
    if (typeof v === 'string') return v.length > 0;
    if (typeof v === 'object') return v.min || v.max;
    return false;
  }).length;
  const [filterOpen, setFilterOpen] = useState(false);

  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, ' ').trim();

  const filterFields: import('../FilterPopover/FilterPopover').FilterField[] = [
    {
      name: 'amount',
      label: 'Amount Range',
      type: 'number-range',
      section: 'Financial',
    },
    {
      name: 'date',
      label: 'Date Range',
      type: 'text',
      section: 'Date & Time',
    },
  ];

  const normalizeRange = (v: unknown): { min: string; max: string } => {
    if (typeof v === 'object' && v !== null && 'min' in v && 'max' in v) {
      const obj = v as { min?: string; max?: string };
      return { min: obj.min ?? '', max: obj.max ?? '' };
    }
    return { min: '', max: '' };
  };

  const filteredLoans = loans.filter(loan => {
    const search = normalize(searchValue);
    const searchMatch = search === '' || (loan.nickname && normalize(loan.nickname).includes(search));

    // Filtrage selon le tab sélectionné (status + sub_state)
    let tabMatch = false;
    switch (selectedStatus) {
      case 'Funded':
        tabMatch = loan.status === 'Funded';
        break;
      case 'To Fund':
        tabMatch = loan.status === 'Funding';
        break;
      case 'behind':
        tabMatch = loan.status !== 'Funding' && (loan.sub_state === 'Late' || loan.sub_state === 'Behind');
        break;
      case 'Complete':
        tabMatch = loan.status !== 'Funding' && loan.sub_state === 'Paid Off';
        break;
      default:
        tabMatch = true;
    }
    
    if (!tabMatch || !searchMatch) return false;

    // Advanced filters
    const filterMatch = Object.entries(appliedFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'amount' && typeof value === 'object' && (value.min || value.max)) {
        const { min, max } = normalizeRange(value);
        const minMatch = min ? loan.current_balance >= Number(min) : true;
        const maxMatch = max ? loan.current_balance <= Number(max) : true;
        return minMatch && maxMatch;
      }
      const loanValue = loan[key as keyof Loan];
      if (typeof loanValue === 'string' && typeof value === 'string') {
        return loanValue.toLowerCase().includes(value.toLowerCase());
      }
      if (typeof loanValue === 'number' && typeof value === 'object' && (value.min || value.max)) {
        const { min, max } = normalizeRange(value);
        const minMatch = min ? loanValue >= Number(min) : true;
        const maxMatch = max ? loanValue <= Number(max) : true;
        return minMatch && maxMatch;
      }
      return true;
    });

    return filterMatch;
  });

  const handleClearAll = () => {
    setSearchValue("");
    setSearching(false);
    setAppliedFilters({ amount: { min: '', max: '' }, date: { min: '', max: '' } });
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearching(false);
      return;
    }
    // On sauvegarde la référence à l'élément car l'objet 'e' sera nullifié.
    const inputElement = e.currentTarget;
    // On attend un instant pour que la valeur du champ soit mise à jour.
    setTimeout(() => {
      setSearchValue(inputElement.value);
    }, 0);
  };

  const handleMenuAction = (item: { id: string; label: string }) => {
    if (item.id === 'add-loan') {
      if (onAddLoan) onAddLoan();
    } else if (item.id === 'upload-loans') {
      // logique pour uploader des prêts
    } else if (item.id === 'add-request') {
      // logique pour ajouter une demande
    }
  };

  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Si selectedLoanId est passé en prop, sélectionne automatiquement ce loan
  React.useEffect(() => {
    if (selectedLoanId) {
      const found = loans.find(l => l.id === selectedLoanId);
      setSelectedLoan(found || null);
      console.log('Loans.tsx: selectedLoanId changed, selectedLoan =', found);
    }
  }, [selectedLoanId, loans]);

  if (selectedBorrower) {
    return (
      <BorrowerDetails
        borrower={selectedBorrower}
        loans={loans}
        onBack={() => setSelectedBorrower(null)}
        onShowLoanDetails={onShowLoanDetails}
      />
    );
  }
  if (selectedLoan) {
    const borrower = borrowers.find(b => b.id === selectedLoan.borrowerId || b.id === selectedLoan.borrower_id);
    if (!borrower) {
      console.error('Borrower not found for loan:', selectedLoan);
      return null;
    }
    return <LoanDetails loan={selectedLoan} borrower={borrower} onBack={() => setSelectedLoan(null)} onShowBorrowerDetails={() => {
      setSelectedBorrower(borrower);
      if (onShowBorrowerDetails) onShowBorrowerDetails(borrower.id);
    }} onShowVaultDetails={(vaultId: string) => {
      if (onShowVaultDetails) onShowVaultDetails(vaultId);
    }} activities={activities} loans={loans} />;
  }

  return (
    <section className={`loans ${className}`}>      <header className="page-toolbar">
        <div className="title-parent">
          <div className="title">Loans</div>
          <div className="subtitle">{formattedDate}</div>
        </div>
        <div className="search-filter-action">
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
          {searching || searchValue !== "" ? (
            <Input
              placeholder="Search loans"
              defaultValue={searchValue}
              onKeyDown={handleSearchInputKeyDown}
              style={{ width: 150 }}
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <IconButton
              ref={filterAnchorEl}
              aria-label={`Filter - ${filterCount} filters applied`}
              icon={FilterIcon}
              notificationCount={filterCount}
              onClick={() => setFilterOpen(true)}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              showNotification={filterCount > 0}
              type="secondary"
              interaction="secondary"
            />
            <FilterPopover
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              fields={filterFields}
              appliedFilters={appliedFilters}
              onApply={setAppliedFilters}
            />
          </div>
          <MenuButton
            items={[
              { id: 'add-loan', label: 'Add loan' },
              { id: 'upload-loans', label: 'Upload loans' },
              { id: 'add-request', label: 'Add request' }
            ]}
            label="Add"
            menuStyle="text"
            onItemClick={handleMenuAction}
            type="primary"
            ariaLabel={undefined}
            aria-label="Add Loan"
            className="add-loan-btn"
          />
        </div>
      </header>
      <section className="all-loans-table">
        <div className="loans-status-tabs">
          <SegmentedControl
            items={statusItems}
            activeItemId={selectedStatus}
            onItemClick={setSelectedStatus}
          />
        </div>
        {filteredLoans.length === 0 ? (
          <div className="empty-state-center">
            <EmptyState
              imageName="NoLoans"
              title="No loans"
              description={
                selectedStatus === 'Funded' ? 'Nothing is on track.' :
                selectedStatus === 'To Fund' ? 'Nothing needs funded.' :
                selectedStatus === 'behind' ? 'Nothing is late.' :
                selectedStatus === 'Complete' ? 'Nothing has completed yet.' :
                'There are no loans.'
              }
              customImage={undefined}
            />
          </div>
        ) : (
          <Table
            key={searchValue + selectedStatus + filteredLoans.length}
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
                }),
              },
              {
                key: 'loan_number',
                label: 'ID',
                cellComponent: TextCell,
                alignment: 'center',

                width: '100%',
                getCellProps: (row: Loan) => ({
                  text: `Loan ${row.loan_number}`,
                }),
              },
              {
                key: 'loan_type',
                label: 'Tag',
                cellComponent: TagCell,
                alignment: 'center',

                width: '100%',
                getCellProps: (row: Loan) => ({
                  label: row.loan_type,
                  emoji: '🏷️',
                  size: 'small',
                }),
              },
              {
                key: 'dscr_limit',
                label: 'DSCR',
                cellComponent: MetricCell,
                alignment: 'center',

                width: '100%',
                getCellProps: (row: Loan) => ({
                  value: row.dscr_limit ? `${row.dscr_limit.toFixed(2)}` : '',
                  status: row.dscr_limit < 1 ? 'bad' : 'good',
                }),
              },
              {
                key: 'initial_payment_amount',
                label: 'Payment Due',
                cellComponent: TextCell,
                width: '100%',
                alignment: 'center',
                getCellProps: (row: Loan) => ({
                  text: row.initial_payment_amount !== undefined
                    ? `$${row.initial_payment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '',
                }),
              },
              {
                key: 'current_balance',
                label: 'Balance',
                cellComponent: TextCell,
                width: '100%',
                alignment: 'right',
                getCellProps: (row: Loan) => ({
                  text: row.current_balance !== undefined
                    ? `$${row.current_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '',
                }),
              }
            ]}
            clickableRows
            data={[...filteredLoans]}
            defaultSortColumn="nickname"
            defaultSortDirection="asc"
            onRowClick={setSelectedLoan}
            onSelectionChange={() => {}}
            onSortChange={() => {}}
          />
        )}
      </section>
    </section>
  );
};