import React from 'react';
import './TabNavigation.css';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`custom-tab-nav-wrapper ${className}`}>
      <div className="custom-tab-nav-container">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <a
              key={tab.id}
              className={`custom-tab-nav-btn ${isActive ? 'custom-tab-nav-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              type="button"
            >
              <div className="custom-tab-nav-content">
                {tab.icon && (
                  <div className="custom-tab-nav-icon">
                    {tab.icon}
                  </div>
                )}
                <span className="custom-tab-nav-text">{tab.label}</span>
              </div>
              {isActive && <div className="custom-tab-nav-indicator" />}
            </a>
          );
        })}
      </div>
      <div className="custom-tab-nav-divider" />
    </div>
  );
};