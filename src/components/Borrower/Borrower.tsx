import React, { useState } from "react";
import { Button, IconButton, Input, Table, TextCell, TagCell } from "@jbaluch/components";
import "./style.css";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import type { Borrower as BorrowerType } from '../../types/types';
import searchIcon from '/search.svg';
import filterIcon from '/filter_alt.svg';
import { Modal } from '../Modal/Modal';
import { AddBorrower } from './AddBorrower';
import { fetchBorrowers, addBorrower } from '../../controllers/borrowerController';
import { useAuth } from '../../contexts/AuthContext';

const SearchIcon = () => <img src={searchIcon} alt="search" />;
const FilterIcon = () => <img src={filterIcon} alt="filter" />;

interface BorrowerProps {
  borrowers: BorrowerType[];
  className?: string;
}

export const Borrower: React.FC<BorrowerProps> = ({ 
  borrowers: initialBorrowers, 
  className = ""
}) => {
  const { user } = useAuth();
  const [borrowers, setBorrowers] = useState<BorrowerType[]>(initialBorrowers);
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterCount = 4; // à remplacer par la vraie logique de filtre

  const filteredBorrowers = borrowers.filter(borrower => {
    const search = searchValue.toLowerCase();
    const fields = [
      borrower.fullName,
      borrower.pb,
      borrower.notes?.length.toString(),
      borrower.totalPayment?.toString(),
      borrower.unpaidBalance?.toString()
    ];
    return search === '' || fields.some(field => field && field.toLowerCase().includes(search));
  });

  const handleClearAll = () => {
    setSearchValue("");
    setSearching(false);
    // reset filters ici si besoin
  };

  const handleSearchIconClick = () => setSearching(true);
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearching(false);
    }
  };

  const handleFilterClick = () => {
    // ouvrir la fenêtre de filtre ici
    // setFilterCount(nouveauNombre) après application d'un filtre
  };

  const handleAddBorrower = () => {
    console.log('Opening modal, isModalOpen:', true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const refreshBorrowers = async () => {
    const token = localStorage.getItem('authToken');
    const bankId = user?.banks?.[0];
    if (!token || !bankId) return;
    try {
      const data = await fetchBorrowers(token, bankId);
      setBorrowers(data);
    } catch (e) {
      // Optionally handle error
    }
  };

  const handleAddBorrowerApi = async (data: Partial<BorrowerType>) => {
    const token = localStorage.getItem('authToken');
    const bankId = user?.banks?.[0];
    if (!token || !bankId) return;
    try {
      await addBorrower(token, bankId, data);
      await refreshBorrowers();
      setIsModalOpen(false);
    } catch (e) {
      // Optionally handle error
    }
  };

  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Just before rendering the Modal
  console.log('Rendering Modal, isModalOpen:', isModalOpen);

  return (
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
              onChange={handleSearchInputChange}
              placeholder="Search borrowers"
              value={searchValue}
              onKeyDown={handleSearchInputKeyDown}
              style={{ width: 150 }}
              onBlur={() => setTimeout(() => setSearching(false), 100)}
              className="jbaluch-input"
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
                alignment: 'left',
              }),
            },
            {
              key: 'pb',
              label: 'Payment Score',
              cellComponent: TagCell,
              width: '100%',
              alignment: 'left',
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
              alignment: 'left',
              getCellProps: (row: BorrowerType) => ({
                text: row.notes ? row.notes.length.toString() : '0',
                alignment: 'left',
              }),
            },
            {
              key: 'totalPayment',
              label: 'Total Payment',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'left',
              getCellProps: (row: BorrowerType) => ({
                text: row.totalPayment ? `$${row.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
                alignment: 'left',
              }),
            },
            {
              key: 'unpaidBalance',
              label: 'Unpaid Balance',
              cellComponent: TextCell,
              width: '100%',
              alignment: 'left',
              getCellProps: (row: BorrowerType) => ({
                text: row.unpaidBalance ? `$${row.unpaidBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
                alignment: 'left',
              }),
            },
          ]}
          data={filteredBorrowers}
          defaultSortColumn="fullName"
          defaultSortDirection="asc"
          onRowClick={() => {}}
          onSelectionChange={() => {}}
          onSortChange={() => {}}
        />
      </section>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <AddBorrower onClose={handleCloseModal} onAdd={handleAddBorrowerApi} />
      </Modal>
    </section>
  );
}; 