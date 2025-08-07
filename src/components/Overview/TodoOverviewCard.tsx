import React from 'react';
import { Button } from '@jbaluch/components';
import './TodoOverviewCard.css';

export interface ActionItem {
  id: string;
  label: string;
  count: number;
  isActive: boolean;
  buttonText: string;
  buttonAction: () => void;
  hasLateTag?: boolean;
  lateCount?: number;
}

interface TodoOverviewCardProps {
  actions: ActionItem[];
}

export const TodoOverviewCard: React.FC<TodoOverviewCardProps> = ({ actions }) => {
  return (
    <div className="todo-overview-card">
      <h3 className="todo-overview-card__title">Actions</h3>
      
      <div className="todo-overview-card__actions">
        {actions.map((action) => (
          <div key={action.id} className="todo-overview-card__action-row">
            <div className="todo-overview-card__action-info">
              <span className={`todo-overview-card__count-badge ${action.isActive ? 'active' : 'inactive'}`}>
                {action.count}
              </span>
              <span className={`todo-overview-card__label ${action.isActive ? 'active' : 'inactive'}`}>
                {action.label}
              </span>
            </div>
            {action.hasLateTag && action.lateCount && action.lateCount > 0 && (
              <span className="todo-overview-card__late-tag">
                {action.lateCount} late
              </span>
            )}
            <Button
              type="secondary"
              onClick={action.buttonAction}
              disabled={!action.isActive}
              name={action.id}
              form=""
              ariaLabel={action.buttonText}
              iconComponent={undefined}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              style={{
                width: 100,
                height: 32,
                fontSize: 14
              }}
            >
              {action.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}; 