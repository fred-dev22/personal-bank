import React, { useState, useRef } from "react";
import { Button, IconButton, Input, Table, TextCell, TagCell } from "@jbaluch/components";
import "./style.css";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import type { Borrower as BorrowerType, Loan } from '../../types/types';
import searchIcon from '/search.svg';
import filterIcon from '/filter_alt.svg';
import { Modal } from '../Modal/Modal';
import { AddBorrower } from './AddBorrower';
import { addBorrower } from '../../controllers/borrowerController';
import { useAuth } from '../../contexts/AuthContext';
import { useActivity } from '../../contexts/ActivityContext';
import { BorrowerDetails } from './BorrowerDetails';
import { FilterPopover } from '../FilterPopover/FilterPopover';
import type { FilterField } from '../FilterPopover/FilterPopover';

const SearchIcon = () => <img src={searchIcon} alt="search" />;
const FilterIcon = () => <img src={filterIcon} alt="filter" />;

interface BorrowerProps {
  borrowers: BorrowerType[];
  loans: Loan[];
  selectedBorrowerId?: string | null;
  onBackToList?: () => void;
  className?: string;
  onShowLoanDetails?: (loanId: string) => void;
  onBorrowersUpdate?: (borrowers: BorrowerType[]) => void;
}

type FilterValue = string | { min: string; max: string };

const filterFields: FilterField[] = [
  // Section Loan
  { name: 'incomeDSCR', label: 'Income DSCR range', type: 'number-range', section: 'Loan' },
  { name: 'loanConstant', label: 'Loan constant range', type: 'number-range', section: 'Loan' },
  { name: 'incomeDSCRHealth', label: 'Income DSCR health', type: 'select', section: 'Loan', options: [
    { label: 'Good', value: 'good' },
    { label: 'Average', value: 'average' },
    { label: 'Bad', value: 'bad' },
  ] },
  { name: 'tag', label: 'Tag', type: 'select', section: 'Loan', options: [
    { label: 'VIP', value: 'vip' },
    { label: 'Standard', value: 'standard' },
    { label: 'New', value: 'new' },
  ] },
  // Section Bank
  { name: 'vault', label: 'Vault', type: 'select', section: 'Bank', options: [
    { label: 'Vault 1', value: 'vault1' },
    { label: 'Vault 2', value: 'vault2' },
  ] },
  { name: 'borrower', label: 'Borrower', type: 'select', section: 'Bank', options: [
    { label: 'John Doe', value: 'john' },
    { label: 'Jane Smith', value: 'jane' },
  ] },
];

export const Borrower: React.FC<BorrowerProps> = ({ 
  borrowers: initialBorrowers, 
  loans,
  selectedBorrowerId,
  onBackToList,
  className = "",
  onShowLoanDetails,
  onBorrowersUpdate
}) => {
  console.log('!!! Borrower ACTIF !!!');
  const { user } = useAuth();
  const { showActivity, hideActivity } = useActivity();
  const [borrowers, setBorrowers] = useState<BorrowerType[]>(initialBorrowers);
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterAnchorEl = useRef<HTMLButtonElement>(null);
  const filterCount = Object.values(appliedFilters).filter(v => {
    if (typeof v === 'string') {
      return v.length > 0;
    } else if (typeof v === 'object' && v !== null) {
      return (v.min && v.min.length > 0) || (v.max && v.max.length > 0);
    }
    return false;
  }).length;
  const [selectedBorrower, setSelectedBorrower] = useState<BorrowerType | null>(null);

  const filteredBorrowers = borrowers.filter(borrower => {
    const search = searchValue.toLowerCase();
    // Search filter
    const searchMatch = search === '' || 
      [
        borrower.fullName,
        borrower.pb,
        borrower.notes?.length.toString(),
        borrower.totalPayment?.toString(),
        borrower.unpaidBalance?.toString()
      ].some(field => field && field.toLowerCase().includes(search));

    if (!searchMatch) return false;

    // Advanced filters
    const filterMatch = Object.entries(appliedFilters).every(([key, value]) => {
      if (!value) return true;

      const borrowerValue = borrower[key as keyof BorrowerType];

      if (typeof borrowerValue === 'string' && typeof value === 'string') {
        return borrowerValue.toLowerCase().includes(value.toLowerCase());
      }
      if (typeof borrowerValue === 'number' && typeof value === 'object' && value !== null) {
        if (value.min && value.max) {
          return borrowerValue >= Number(value.min) && borrowerValue <= Number(value.max);
        }
        if (value.min) {
          return borrowerValue >= Number(value.min);
        }
        if (value.max) {
          return borrowerValue <= Number(value.max);
        }
      }
      return true;
    });
    
    return filterMatch;
  });

  const handleClearAll = () => {
    setSearchValue("");
    setSearching(false);
    setAppliedFilters({});
  };

  const handleSearchIconClick = () => setSearching(true);
  
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

  const handleFilterClick = () => {
    setIsFilterOpen(prev => !prev);
  };

  const handleAddBorrower = () => {
    console.log('Opening modal, isModalOpen:', true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  const handleAddBorrowerApi = async (data: Partial<BorrowerType>) => {
    const token = localStorage.getItem('authToken');
    const bankId = user?.current_pb;
    if (!token || !bankId) return;
    try {
      showActivity('Creating borrower...');
      const newBorrower = await addBorrower(token, bankId, {
        ...data,
        userId: user?.id,
        bankId: bankId,
      });
      
      // Mettre à jour la liste locale immédiatement
      const updatedBorrowers = [...borrowers, newBorrower];
      setBorrowers(updatedBorrowers);
      
      // Mettre à jour la liste globale si la fonction est fournie
      if (onBorrowersUpdate) {
        onBorrowersUpdate(updatedBorrowers);
        console.log('✅ Global borrowers list updated from Borrower component');
      }
      
      hideActivity();
      setIsModalOpen(false);
    } catch {
      hideActivity();
      // Optionally handle error
    }
  };

  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Just before rendering the Modal
  console.log('Rendering Modal, isModalOpen:', isModalOpen);

  if (selectedBorrowerId) {
    const borrower = borrowers.find(b => b.id === selectedBorrowerId);
    if (borrower) {
      return <BorrowerDetails borrower={borrower} loans={loans} onBack={onBackToList || (() => {})} onShowLoanDetails={onShowLoanDetails} />;
    }
  }

  return (
    <>
      {selectedBorrower ? (
        <BorrowerDetails
          borrower={selectedBorrower}
          loans={loans}
          onBack={() => setSelectedBorrower(null)}
          onShowLoanDetails={onShowLoanDetails}
        />
      ) : (
        <section className={`borrower ${className}`}>
          <header className="page-toolbar">
            <div className="title-parent">
              <div className="title">Borrowers</div>
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
              {searching ? (
                <Input
                  placeholder="Search borrowers"
                  defaultValue={searchValue}
                  onKeyDown={handleSearchInputKeyDown}
                  style={{ width: 150 }}
                  onBlur={() => setTimeout(() => setSearching(false), 100)}
                  className="jbaluch-input"
                  autoFocus
                />
              ) : (
                <IconButton
                  aria-label="Search"
                  icon={SearchIcon}
                  onClick={handleSearchIconClick}
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
                  onClick={handleFilterClick}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  showNotification
                  type="secondary"
                  interaction="secondary"
                />
                <FilterPopover
                  open={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  fields={filterFields}
                  appliedFilters={appliedFilters}
                  onApply={setAppliedFilters}
                />
              </div>
              <Button
                icon="iconless"
                iconComponent={undefined}
                interaction="default"
                justified="right"
                onClick={handleAddBorrower}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="primary"
                name="add-borrower"
                form=""
                ariaLabel={undefined}
                className="add-borrower-btn"
              >
                Add Borrower
              </Button>
            </div>
          </header>
          <section className="all-borrowers-table">
            <Table
                key={searchValue + filteredBorrowers.length}
                clickableRows

              className="borrowers-table-fullwidth"
              columns={[
                {
                  key: 'fullName',
                  label: 'Name',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'left',
                  getCellProps: (row: BorrowerType) => ({
                    text: row.fullName,
                  }),
                },
                {
                  key: 'pb',
                  label: 'Payment Score',
                  cellComponent: TagCell,
                  width: '100%',
                  alignment: 'center',
                  getCellProps: () => ({
                    label: 0,
                    color: 'success',
                    size: 'small',
                  }),
                },
                {
                  key: 'notes',
                  label: 'Total Loans',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'center',
                  getCellProps: (row: BorrowerType) => ({
                    text: row.notes ? row.notes.length.toString() : '0',
                  }),
                },
                {
                  key: 'totalPayment',
                  label: 'Total Payment',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'center',
                  getCellProps: (row: BorrowerType) => ({
                    text: row.totalPayment ? `$${row.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
                  }),
                },
                {
                  key: 'unpaidBalance',
                  label: 'Unpaid Balance',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'right',
                  getCellProps: (row: BorrowerType) => ({
                    text: row.unpaidBalance ? `$${row.unpaidBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
                  }),
                },
              ]}
              data={filteredBorrowers}
              defaultSortColumn="fullName"
              defaultSortDirection="asc"
              onRowClick={(row: BorrowerType) => setSelectedBorrower(row)}
              onSelectionChange={() => {}}
              onSortChange={() => {}}
            />
          </section>
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <AddBorrower onClose={handleCloseModal} onAdd={handleAddBorrowerApi} />
          </Modal>
        </section>
      )}
    </>
  );
}; 