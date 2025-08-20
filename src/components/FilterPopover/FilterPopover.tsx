import React, { useState, useEffect, useRef } from 'react';
import { Input, PopupButton, Button } from '@jbaluch/components';
import './FilterPopover.css';

export type FilterType = 'text' | 'number-range' | 'select';

export interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[];
  section?: string;
}

export type FilterValue = string | { min: string; max: string };

interface FilterPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: FilterField[];
  appliedFilters: { [key: string]: FilterValue };
  onApply: (filters: { [key: string]: FilterValue }) => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  open,
  onClose,
  fields,
  appliedFilters,
  onApply,
}) => {
  const [localFilters, setLocalFilters] = useState<{ [key: string]: FilterValue }>({});
  const popoverRef = useRef<HTMLDivElement>(null);

  // Apply on close
  useEffect(() => {
    if (!open) onApply(localFilters);
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters, open]);

  // Fermer si clic en dehors
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  // Helpers
  const getRangeValue = (v: FilterValue) => typeof v === 'object' && v !== null ? v : { min: '', max: '' };
  const setFilter = (name: string, value: FilterValue) => {
    setLocalFilters(prev => {
      const updated = { ...prev, [name]: value };
      onApply(updated);
      return updated;
    });
  };

  // Helper to get display value for PopupButton
  const getDisplayValue = (fieldName: string, defaultValue: string) => {
    const field = fields.find(f => f.name === fieldName);
    const selectedValue = localFilters[fieldName] as string;
    if (!selectedValue) return defaultValue;
    
    const option = field?.options?.find(opt => opt.value === selectedValue);
    return option?.label || defaultValue;
  };

  // Champs
  const dateRange = getRangeValue(localFilters['date']);
  const amountRange = getRangeValue(localFilters['amount']);

  // Reset handlers
  const resetDate = () => setFilter('date', { min: '', max: '' });
  const resetAmount = () => setFilter('amount', { min: '', max: '' });

  // Clear all
  const handleClear = () => {
    setLocalFilters({ date: { min: '', max: '' }, amount: { min: '', max: '' }, category: '', vault: '', borrower: '' });
    onApply({ date: { min: '', max: '' }, amount: { min: '', max: '' }, category: '', vault: '', borrower: '' });
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="filter-popover-drawer custom-filter-popover"
      style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 2100, overflowY: 'visible', overflowX: 'hidden' }}
      data-popup-scope="filter-popover"
    >
      <div className="filter-applied-label">Applied Filters</div>
      <div className="filter-applied-none">None.</div>
      <hr className="filter-separator" />
      <div className="filter-field-group">
        <div className="filter-label-row">
          <button className="filter-reset-btn" type="button" onClick={resetDate}>Reset</button>
        </div>
        <div className="filter-range-row">
          <Input
            type="date"
            value={dateRange.min}
            onChange={(v: string) => setFilter('date', { min: v, max: dateRange.max })}
            placeholder="start"
            style={{ width: '120px' }}
          />
          <span className="filter-range-sep">–</span>
          <Input
            type="date"
            value={dateRange.max}
            onChange={(v: string) => setFilter('date', { min: dateRange.min, max: v })}
            placeholder="end"
            style={{ width: '120px' }}
          />
        </div>
      </div>
      <div className="filter-field-group">
        <div className="filter-label-row">
          <button className="filter-reset-btn" type="button" onClick={resetAmount}>Reset</button>
        </div>
        <div className="filter-range-row">
          <Input
            type="currency"
            value={amountRange.min}
            onChange={(v: string) => setFilter('amount', { min: v, max: amountRange.max })}
            placeholder="min"
            style={{ width: '120px' }}
          />
          <span className="filter-range-sep">–</span>
          <Input
            type="currency"
            value={amountRange.max}
            onChange={(v: string) => setFilter('amount', { min: amountRange.min, max: v })}
            placeholder="max"
            style={{ width: '120px' }}
          />
        </div>
      </div>
      <div className="filter-field-group">
        <PopupButton
          defaultValue={getDisplayValue('category', "Select category")}
          items={fields.find(f => f.name === 'category')?.options?.map(opt => ({ id: opt.value, label: opt.label })) || []}
          label="Category"
          menuStyle="text"
          onSelect={(selectedId: string) => setFilter('category', selectedId)}
          width="100%"
          menuMaxHeight="200px"
        />
      </div>
      <hr className="filter-separator" />
      <div className="filter-field-group">
        <PopupButton
          defaultValue={getDisplayValue('vault', "Select vault")}
          items={fields.find(f => f.name === 'vault')?.options?.map(opt => ({ id: opt.value, label: opt.label })) || []}
          label="Vault"
          menuStyle="text"
          onSelect={(selectedId: string) => setFilter('vault', selectedId)}
          width="100%"
          menuMaxHeight="200px"
        />
      </div>
      <div className="filter-field-group">
        <PopupButton
          defaultValue={getDisplayValue('borrower', "Select borrower")}
          items={fields.find(f => f.name === 'borrower')?.options?.map(opt => ({ id: opt.value, label: opt.label })) || []}
          label="Borrower"
          menuStyle="text"
          onSelect={(selectedId: string) => setFilter('borrower', selectedId)}
          width="100%"
          menuMaxHeight="200px"
        />
      </div>
      <hr className="filter-separator" />
      <Button
        icon="iconless"
        iconComponent={undefined}
        interaction="default"
        justified="right"
        onClick={handleClear}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        type="secondary"
        name="clear-all"
        form=""
        ariaLabel="Clear all"
        style={{ width: 150, marginTop: 8, marginBottom: 2, textAlign: 'left' }}
      >
        Clear all
      </Button>
    </div>
  );
}; 