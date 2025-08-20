import React, { useState, useRef } from "react";
import { Button, IconButton, EmptyState, Table, TagCell, TextCell, Input } from "@jbaluch/components";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./activities.css";
import { Header } from "./Header";
import { AddEditActivity } from "./AddEditActivity";
import { createGeneralActivityConfig, ACTIVITY_CATEGORIES } from "./activityConfigs";
import { FilterPopover } from "../FilterPopover/FilterPopover";
import type { FilterField } from "../FilterPopover/FilterPopover";
import type { Activity, Vault, Loan } from '../../types/types';
import type { FilterValue } from '../FilterPopover/FilterPopover';

const SearchIcon = () => <img src={"/search.svg"} alt="search" />;
const FilterIcon = () => <img src={"/filter_alt.svg"} alt="filter" />;

interface ActivitiesProps {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  vaults?: Vault[];
  loans?: Loan[];
  accounts?: Array<{ value: string; label: string }>;
  onShowBorrowerDetails?: (borrowerId?: string) => void;
  onShowLoanDetails?: (loanId?: string) => void;
  onShowVaultDetails?: (vaultId?: string) => void;
}

function groupByMonth(activities: Activity[]) {
  return activities.reduce((acc, act) => {
    const date = new Date(act.date);
    const key = `${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(act);
    return acc;
  }, {} as Record<string, Activity[]>);
}

export const Activities: React.FC<ActivitiesProps> = ({ activities, loading, error, vaults = [], loans = [], accounts = [], onShowBorrowerDetails, onShowLoanDetails, onShowVaultDetails }) => {
  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Etats pour UI
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, { min?: string; max?: string } | string>>({});
  const filterAnchorEl = useRef<HTMLButtonElement>(null);
  const filterCount = Object.values(appliedFilters).filter(v => {
    if (typeof v === 'string') return v.length > 0;
    if (typeof v === 'object') return v.min || v.max;
    return false;
  }).length;

  // Create activity configuration for the general activities page
  const activityConfig = createGeneralActivityConfig(vaults, loans, accounts);

  // Dev-only demo rows to preview table design when there is no data yet
  const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.MODE !== 'production';
  const demoActivities: Activity[] = [
    { id: 'u1', name: 'Name', type: 'loan', date: new Date(`${new Date().getFullYear()}-10-02`), amount: 300, tag: 'loan_payment' },
    { id: 'j1', name: 'Name', type: 'transfer', date: new Date('2024-06-08'), amount: 3000, tag: 'transfer_fee' },
    { id: 'j2', name: 'Name', type: 'vault', date: new Date('2024-06-08'), amount: 300, tag: 'vault_contribution' },
    { id: 'j3', name: 'Name', type: 'loan', date: new Date('2024-06-08'), amount: 300, tag: 'loan_payment' },
    { id: 'j4', name: 'Name', type: 'loan', date: new Date('2024-06-08'), amount: 300, tag: 'loan_payment' },
    { id: 'j5', name: 'Name', type: 'loan', date: new Date('2024-06-08'), amount: 300, tag: 'loan_payment' },
    { id: 'm1', name: 'Name', type: 'vault', date: new Date('2024-05-01'), amount: 300, tag: 'vault_contribution' },
    { id: 'm2', name: 'Name', type: 'loan', date: new Date('2024-05-01'), amount: 300, tag: 'loan_payment' },
  ];
  const sourceActivities = activities.length > 0 ? activities : (isDev ? demoActivities : activities);

  // Champs de filtre pour les activités
  const filterFields: FilterField[] = [
    {
      name: 'type',
      label: 'Activity Type',
      type: 'select',
      section: 'Activity Details',
      options: [
        { label: 'Loan Activity', value: 'loan' },
        { label: 'Vault Activity', value: 'vault' },
        { label: 'Payment', value: 'payment' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'Withdrawal', value: 'withdrawal' },
        { label: 'Deposit', value: 'deposit' }
      ]
    },
    {
      name: 'tag',
      label: 'Category',
      type: 'select',
      section: 'Activity Details',
      options: [
        { label: 'Income', value: 'income' },
        { label: 'Expense', value: 'expense' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'Investment', value: 'investment' },
        { label: 'Loan', value: 'loan' },
        { label: 'Vault', value: 'vault' }
      ]
    },
    {
      name: 'amount',
      label: 'Amount Range',
      type: 'number-range',
      section: 'Financial'
    },
    {
      name: 'date',
      label: 'Date Range',
      type: 'text',
      section: 'Date & Time'
    }
  ];

  const handleClearAll = () => {
    setSearchValue("");
    setSearching(false);
    setAppliedFilters({});
  };

  const handleSearchIconClick = () => setSearching(true);

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = e.currentTarget;
    setTimeout(() => {
      setSearchValue(inputElement.value);
    }, 0);
  };

  // Helper pour garantir que min et max sont toujours des string
  const normalizeRange = (v: unknown): { min: string; max: string } => {
    if (typeof v === 'object' && v !== null && 'min' in v && 'max' in v) {
      const obj = v as { min?: string; max?: string };
      return { min: obj.min ?? '', max: obj.max ?? '' };
    }
    return { min: '', max: '' };
  };

  // Filtrage dynamique
  const filteredActivities = sourceActivities.filter(a => {
    const val = searchValue.toLowerCase();
    const searchMatch =
      a.name?.toLowerCase().includes(val) ||
      a.tag?.toLowerCase().includes(val) ||
      a.type?.toLowerCase().includes(val);

    if (!searchMatch) return false;

    // Advanced filters
    const filterMatch = Object.entries(appliedFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'amount' && typeof value === 'object' && (value.min || value.max)) {
        const { min, max } = normalizeRange(value);
        const minMatch = min ? a.amount >= Number(min) : true;
        const maxMatch = max ? a.amount <= Number(max) : true;
        return minMatch && maxMatch;
      }
      const activityValue = a[key as keyof Activity];
      if (typeof activityValue === 'string' && typeof value === 'string') {
        return activityValue.toLowerCase().includes(value.toLowerCase());
      }
      if (typeof activityValue === 'number' && typeof value === 'object' && (value.min || value.max)) {
        const { min, max } = normalizeRange(value);
        const minMatch = min ? activityValue >= Number(min) : true;
        const maxMatch = max ? activityValue <= Number(max) : true;
        return minMatch && maxMatch;
      }
      return true;
    });

    return filterMatch;
  });

  // Séparation des activités filtrées
  const upcoming = filteredActivities.filter(a => new Date(a.date) > today);
  const pastAndPresent = filteredActivities.filter(a => new Date(a.date) <= today);
  const grouped = groupByMonth(pastAndPresent);
  const monthKeys = Object.keys(grouped).sort((a, b) => {
    // Trie du plus récent au plus ancien
    const [ma, ya] = a.split(', ');
    const [mb, yb] = b.split(', ');
    const dateA = new Date(`${ma} 1, ${ya}`);
    const dateB = new Date(`${mb} 1, ${yb}`);
    return dateB.getTime() - dateA.getTime();
  });

  // Build category lookup for pretty labels/emojis
  const categoryLookup: Record<string, { label: string; emoji?: string }> = React.useMemo(() => {
    const all = [
      ...ACTIVITY_CATEGORIES.general,
      ...ACTIVITY_CATEGORIES.loan,
      ...ACTIVITY_CATEGORIES.vault,
      ...ACTIVITY_CATEGORIES.payment,
    ];
    return all.reduce((acc, c) => {
      acc[c.value] = { label: c.label, emoji: c.emoji };
      return acc;
    }, {} as Record<string, { label: string; emoji?: string }>);
  }, []);

  const getCategoryDisplay = (tag?: string, type?: string) => {
    if (tag && categoryLookup[tag]) return categoryLookup[tag];
    if (type && categoryLookup[type]) return categoryLookup[type];
    return { label: tag || type || '', emoji: '🏷️' };
  };

  // Tag color palette from Figma
  const TAG_BG_COLORS: Record<string, string> = {
    income: '#C8EBEA',
    payment_received: '#C8EBEA',
    vault_income: '#C8EBEA',
    contribution: '#C8EBEA', // generic label if ever used
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

  const resolveTagBackground = (tag?: string, type?: string) => {
    const key = (tag || type || '').toLowerCase();
    return TAG_BG_COLORS[key] || '#f0f0f1';
  };

  // Colonnes pour Table
  const getColumns = (groupLabel: string) => [
    {
      key: 'name',
      label: groupLabel, // group label in header
      cellComponent: TextCell,
      width: '100%',
      alignment: 'left',
      getCellProps: (row: Activity) => ({ text: row.name || '—'}),
    },
    {
      key: 'tag',
      label: '',
      cellComponent: TagCell,
      width: '100%',
      alignment: 'center',
      getCellProps: (row: Activity) => {
        const { label, emoji } = getCategoryDisplay(row.tag, row.type);
        return {
          label,
          emoji,
          size: 'small',
          backgroundColor: resolveTagBackground(row.tag, row.type),
          textColor: '#595959',
          severity: 'info',
        };
      },
    },
    {
      key: 'date',
      label: '',
      cellComponent: TextCell,
      width: '100%',
      alignment: 'center',
      getCellProps: (row: Activity) => ({
        text: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }),
    },
    {
      key: 'amount',
      label: '',
      cellComponent: TextCell,
      width: '100%',
      alignment: 'right',
      getCellProps: (row: Activity) => ({
        text: row.amount !== undefined ? `$${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '',
      }),
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '32px',
      marginRight: selectedActivity ? '400px' : '0px',
      transition: 'margin-right 0.3s ease'
    }}>
      <section className="activities" style={{ flex: 1, minWidth: 0 }}>
        <header className="page-toolbar">
          <div className="page-header">
            <div className="page-header__title">Activity</div>
            <div className="page-header__subtitle">{formattedDate}</div>
          </div>
          <div className="search-filter-action">
            {(searchValue !== "" || filterCount > 0) && (
              <Button
                icon="iconless"
                interaction="default"
                justified="right"
                onClick={handleClearAll}
                type="secondary"
                aria-label="Clear All"
                ariaLabel="Clear All"
                name="clear-all"
                className="clear-all-btn"
                iconComponent={undefined}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                form=""
              >
                Clear All
              </Button>
            )}
            {searching ? (
              <Input
                placeholder="Search by name, tag, or type..."
                defaultValue={searchValue}
                onKeyDown={handleSearchInputKeyDown}
                style={{ width: 250 }}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchValue) {
                      setSearching(false);
                    }
                  }, 200);
                }}
                className="jbaluch-input"
                autoFocus
              />
            ) : (
              <IconButton
                aria-label="Search"
                ariaLabel="Search"
                icon={SearchIcon}
                onClick={handleSearchIconClick}
                type="secondary"
                interaction="secondary"
                iconComponent={undefined}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                form=""
                notificationCount={0}
              />
            )}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <IconButton
                ref={filterAnchorEl}
                aria-label="Filter"
                icon={FilterIcon}
                onClick={() => setFilterOpen(true)}
                type="secondary"
                interaction="secondary"
                notificationCount={filterCount}
                showNotification={filterCount > 0}
                iconComponent={undefined}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                form=""
              />
              <FilterPopover
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                fields={filterFields}
                appliedFilters={appliedFilters as { [key: string]: FilterValue }}
                onApply={setAppliedFilters}
              />
            </div>
            <Button
              icon="iconless"
              interaction="default"
              justified="right"
              onClick={() => setShowAddModal(true)}
              type="primary"
              name="add-activity"
              className="add-loan-btn"
              iconComponent={undefined}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              form=""
              ariaLabel="Add Activity"
            >
              + Activity
            </Button>
          </div>
        </header>
        <AddEditActivity
          open={showAddModal}
          mode="add"
          config={activityConfig}
          onClose={() => setShowAddModal(false)}
          onSubmit={() => {
            setShowAddModal(false);
          }}
        />
        <section className="all-activities-table">
          {(loading || error || filteredActivities.length > 0) && <Header />}
          {error ? (
            <div className="empty-state-center"><div style={{ color: 'red' }}>{error}</div></div>
          ) : filteredActivities.length === 0 ? (
            <div className="empty-state-center">
              <EmptyState
                imageName="NoActivity"
                title="No Activity"
                description="There is no activity to display at this time. Check back later for updates."
                customImage={undefined}
              />
            </div>
          ) : (
            <div>
              {/* Bloc Upcoming */}
              {upcoming.length > 0 && (
                <div style={{marginTop: 24, marginBottom: 8, background: '#f7f7fa', borderRadius: 8}}>
                  <Table
                    key={`upcoming-${searchValue}-${upcoming.length}`}
                    className="activities-table-fullwidth"
                    columns={getColumns('Upcoming')}
                    data={upcoming}
                    defaultSortColumn="date"
                    defaultSortDirection="desc"
                    clickableRows
                    onRowClick={(row: Activity) => setSelectedActivity(row)}
                  />
                </div>
              )}
              {/* Groupes par mois */}
              {monthKeys.map(month => (
                <div key={month} style={{marginTop: 24, marginBottom: 8, background: '#f7f7fa', borderRadius: 8}}>
                  <Table
                    key={`${month}-${searchValue}-${grouped[month].length}`}
                    className="activities-table-fullwidth"
                    columns={getColumns(month)}
                    data={grouped[month]}
                    defaultSortColumn="date"
                    defaultSortDirection="desc"
                    clickableRows
                    onRowClick={(row: Activity) => setSelectedActivity(row)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      <AddEditActivity
        open={!!selectedActivity}
        mode="edit"
        config={activityConfig}
        initialData={selectedActivity || {}}
        minimalEdit
        onNavigateBorrower={(id?: string) => onShowBorrowerDetails && onShowBorrowerDetails(id)}
        onNavigateLoan={(id?: string) => onShowLoanDetails && onShowLoanDetails(id)}
        onNavigateVault={(id?: string) => onShowVaultDetails && onShowVaultDetails(id)}
        onClose={() => setSelectedActivity(null)}
        onSubmit={() => {
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}; 