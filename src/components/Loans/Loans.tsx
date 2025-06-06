import React, { useState } from "react";
import { Button, IconButton, Input, MenuButton, Tabs, Table, TextCell, MetricCell, TagCell } from "@jbaluch/components";
import "./style.css";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import type { Loan } from '../../types/types';
import searchIcon from '/search.svg';
import filterIcon from '/filter_alt.svg';

const SearchIcon = () => <img src={searchIcon} alt="search" />;
const FilterIcon = () => <img src={filterIcon} alt="filter" />;

interface LoansProps {
  loans: Loan[];
  className?: string;
  imagesClassName?: string;
  imagesClassNameOverride?: string;
  divClassName?: string;
}

export const Loans: React.FC<LoansProps> = ({
  loans,
  className = ""
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Funded');
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const filterCount = 4; // à remplacer par la vraie logique de filtre

  const filteredLoans = loans.filter(loan => {
    const search = searchValue.toLowerCase();
    const statusMatch = loan.status === selectedStatus;
    const fields = [
      loan.nickname,
      loan.loan_number?.toString(),
      loan.loan_type,
      loan.dscr_limit?.toString(),
      loan.initial_payment_amount?.toString(),
      loan.current_balance?.toString()
    ];
    const searchMatch = search === '' || fields.some(field => field && field.toLowerCase().includes(search));
    return statusMatch && searchMatch;
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

  const handleMenuAction = (item: { id: string; label: string }) => {
    if (item.id === 'add-loan') {
      // logique pour ajouter un prêt
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

  return (
    <section className={`loans ${className}`}>
      <header className="page-toolbar">
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
          {searching ? (
            <Input
              onChange={handleSearchInputChange}
              placeholder="Search loans"
              value={searchValue}
              onKeyDown={handleSearchInputKeyDown}
              style={{ width: 150 }}
              onBlur={() => setTimeout(() => setSearching(false), 100)}
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
          <Tabs
            className="loans-tabs-no-margin"
            activeTabId={selectedStatus}
            onTabChange={setSelectedStatus}
            tabs={[
              { id: 'Funded', label: 'On Track' },
              { id: 'To Fund', label: 'To Fund' },
              { id: 'Late', label: 'Late' },
              { id: 'Complete', label: 'Complete' }
            ]}
          />
        <div >
          <Table
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
                  text: `Loan ${row.loan_number}`,
                  alignment: 'left',
                }),
              },
              {
                key: 'loan_type',
                label: 'Tag',
                cellComponent: TagCell,
                width: '100%',
                alignment: 'left',
                getCellProps: (row: Loan) => ({
                  label: row.loan_type,
                  emoji: '🏷️',
                  alignment: 'left',
                  size: 'small',
                }),
              },
              {
                key: 'dscr_limit',
                label: 'DSCR',
                cellComponent: MetricCell,
                width: '100%',
                alignment: 'left',
                getCellProps: (row: Loan) => ({
                  value: row.dscr_limit ? `${row.dscr_limit.toFixed(2)}` : '',
                  status: row.dscr_limit < 1 ? 'bad' : 'good',
                  alignment: 'left',
                }),
              },
              {
                key: 'initial_payment_amount',
                label: 'Payment Due',
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
                key: 'current_balance',
                label: 'Balance',
                cellComponent: TextCell,
                width: '100%',
                alignment: 'left',
                getCellProps: (row: Loan) => ({
                  text: row.current_balance !== undefined
                    ? `$${row.current_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '',
                  alignment: 'left',
                }),
              }
            ]}
            data={filteredLoans}
            defaultSortColumn="nickname"
            defaultSortDirection="asc"
            onRowClick={() => {}}
            onSelectionChange={() => {}}
            onSortChange={() => {}}
          />
        </div>
      </section>
    </section>
  );
};