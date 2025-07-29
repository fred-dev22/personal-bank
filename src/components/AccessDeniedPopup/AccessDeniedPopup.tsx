import React from 'react';
import { Button } from '@jbaluch/components';
import './AccessDeniedPopup.css';

interface AccessDeniedPopupProps {
  message: string;
  onClose: () => void;
}

export const AccessDeniedPopup: React.FC<AccessDeniedPopupProps> = ({ message, onClose }) => {
  return (
    <div className="access-denied-overlay">
      <div className="access-denied-popup">
        <div className="access-denied-header">
          <h2>Access Denied</h2>
        </div>
        <div className="access-denied-content">
          <div className="access-denied-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="#dc3545"/>
            </svg>
          </div>
          <p className="access-denied-message">{message}</p>
        </div>
        <div className="access-denied-footer">
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            justified="center"
            name="ok"
            form=""
            ariaLabel="OK"
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="primary"
            style={{ minWidth: '120px' }}
            onClick={onClose}
            disabled={false}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}; 