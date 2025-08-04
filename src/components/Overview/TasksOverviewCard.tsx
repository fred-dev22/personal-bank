import React from 'react';
import './TasksOverviewCard.css';

interface TasksOverviewCardProps {
  onAddTask?: () => void;
}

export const TasksOverviewCard: React.FC<TasksOverviewCardProps> = ({ onAddTask }) => {
  return (
    <div className="tasks-overview-card">
      <div className="tasks-overview-card__header">
        <h3 className="tasks-overview-card__title">Tasks</h3>
        <button 
          className="tasks-overview-card__add-button"
          onClick={onAddTask}
          aria-label="Add task"
        >
          +
        </button>
      </div>
      <div className="tasks-overview-card__content">
        <span className="tasks-overview-card__placeholder">Coming soon.</span>
      </div>
    </div>
  );
}; 