import React from 'react';
import './SegmentedControl.css';

export interface SegmentedControlItem {
  id: string;
  label: string;
  count: number;
}

interface SegmentedControlProps {
  items: SegmentedControlItem[];
  activeItemId: string;
  onItemClick: (itemId: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  activeItemId,
  onItemClick,
  className = ''
}) => {
  return (
    <div className={`segmented-control ${className}`}>
      {items.map((item, index) => {
        const isActive = item.id === activeItemId;
        return (
          <React.Fragment key={item.id}>
            <button
              className={`segmented-control-item ${isActive ? 'active' : ''}`}
              onClick={() => onItemClick(item.id)}
              type="button"
            >
              <span className="segmented-control-label">{item.label}</span>
              <span className="segmented-control-badge">{item.count}</span>
            </button>
            {index < items.length - 1 && (
              <div className="segmented-control-divider"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}; 