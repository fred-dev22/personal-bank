import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from '@jbaluch/components';
import './FilterPopover.css';

export type FilterType = 'text' | 'number-range' | 'select';

export interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[];
  section?: string;
}

type FilterValue = string | { min: string; max: string };

interface FilterPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  fields: FilterField[];
  appliedFilters: { [key: string]: FilterValue };
  onApply: (filters: { [key: string]: FilterValue }) => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  fields,
  appliedFilters,
  onApply,
}) => {
  const [localFilters, setLocalFilters] = useState<{ [key: string]: FilterValue }>({});
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters, open]);

  // Positionnement dynamique sous le bouton filtre
  useEffect(() => {
    if (!open || !anchorEl) return;
    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.left + (rect.width / 2) + window.scrollX;
      if (popoverRef.current) {
        const popoverWidth = popoverRef.current.offsetWidth;
        left = left - (popoverWidth / 2);
        if (left < 12) left = 12;
        if (left + popoverWidth > window.innerWidth - 12) {
          left = window.innerWidth - popoverWidth - 12;
        }
        // Correction pour éviter le débordement en bas
        const popoverHeight = popoverRef.current.offsetHeight;
        if (top + popoverHeight > window.innerHeight - 12) {
          top = Math.max(12, window.innerHeight - popoverHeight - 12);
        }
      }
      setPosition({ top, left });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition, true);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition, true);
    };
  }, [open, anchorEl]);

  // Fermer si clic en dehors
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) return null;

  // Sections uniques
  const sections = Array.from(new Set(fields.map(f => f.section).filter(Boolean))) as string[];
  const getStringValue = (v: FilterValue) => (typeof v === 'string' ? v : '');
  const getRangeValue = (v: FilterValue) =>
    typeof v === 'object' && v !== null ? v : { min: '', max: '' };

  // Pills
  const pills = fields
    .filter(f => {
      const v = localFilters[f.name];
      if (f.type === 'number-range') {
        const r = getRangeValue(v);
        return r.min || r.max;
      }
      return v && v !== '';
    })
    .map(f => ({
      key: f.name,
      label: f.label,
      value:
        f.type === 'number-range'
          ? (() => {
              const r = getRangeValue(localFilters[f.name]);
              return [r.min, r.max].filter(Boolean).join(' - ');
            })()
          : f.type === 'select'
          ? f.options?.find(opt => opt.value === getStringValue(localFilters[f.name]))?.label ||
            getStringValue(localFilters[f.name])
          : getStringValue(localFilters[f.name]),
    }));

  const setFilter = (name: string, value: FilterValue) => {
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared: { [key: string]: FilterValue } = {};
    fields.forEach(f => {
      cleared[f.name] = f.type === 'number-range' ? { min: '', max: '' } : '';
    });
    setLocalFilters(cleared);
    onApply(cleared);
  };

  const removePill = (name: string) => {
    setFilter(name, fields.find(f => f.name === name)?.type === 'number-range' ? { min: '', max: '' } : '');
  };

  return (
    <div
      ref={popoverRef}
      className="filter-popover-drawer"
      style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 2100 }}
    >
      <div className="applied-filters">
        {pills.map(pill => (
          <span className="filter-pill" key={pill.key}>
            {pill.label}
            {pill.value && <>: <b>{pill.value}</b></>}
            <button className="pill-remove" onClick={() => removePill(pill.key)}>&times;</button>
          </span>
        ))}
      </div>
      {sections.map(section => (
        <div className="filter-section" key={section}>
          <h4>{section}</h4>
          {fields.filter(f => f.section === section).map(field => (
            <div key={field.name} className="filter-field">
              <label className="filter-label">{field.label}</label>
              {field.type === 'text' && (
                <Input
                  value={getStringValue(localFilters[field.name])}
                  onChange={(v: string) => setFilter(field.name, v)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
              {field.type === 'number-range' && (() => {
                const range = getRangeValue(localFilters[field.name]);
                const isActive = !!(range.min || range.max);
                return (
                  <div className="number-range-inputs" style={{ alignItems: 'center' }}>
                    <Input
                      type="number"
                      value={range.min}
                      onChange={(v: string) => setFilter(field.name, { min: v, max: range.max })}
                      placeholder="min"
                    />
                    <span style={{ margin: '0 4px', color: '#bbb' }}>-</span>
                    <Input
                      type="number"
                      value={range.max}
                      onChange={(v: string) => setFilter(field.name, { min: range.min, max: v })}
                      placeholder="max"
                    />
                    <button
                      className="range-reset-btn"
                      type="button"
                      style={{ marginLeft: 8, visibility: isActive ? 'visible' : 'hidden' }}
                      onClick={() => setFilter(field.name, { min: '', max: '' })}
                    >
                      Reset
                    </button>
                  </div>
                );
              })()}
              {field.type === 'select' && (
                <select
                  className="filter-native-select"
                  value={getStringValue(localFilters[field.name])}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(field.name, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      ))}
      <footer className="filter-popover__footer">
        <Button
          type="secondary"
          onClick={handleClear}
          style={{ marginRight: 12 }}
          iconComponent={undefined}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          form=""
          ariaLabel="Clear"
          name="clear-filters"
        >
          Clear
        </Button>
        <Button
          type="primary"
          onClick={handleApply}
          iconComponent={undefined}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          form=""
          ariaLabel="Apply Filters"
          name="apply-filters"
        >
          Action Button
        </Button>
      </footer>
    </div>
  );
}; 