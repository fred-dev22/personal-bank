import React from 'react';
import './LoansScreen.css';

interface Loan {
  id: string;
  name: string;
  avatar: string;
  dueDate: string;
  amount: string;
  description: string;
  vault: string;
}

interface LoansScreenProps {
  onBack: () => void;
}

export const LoansScreen: React.FC<LoansScreenProps> = ({ onBack }) => {
  const loan: Loan = {
    id: '1',
    name: 'Marcela',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    dueDate: 'Due today',
    amount: '$10,000.00',
    description: 'More school',
    vault: 'Vault ABC'
  };

  return (
    <div className="loans-screen">
      {/* Simple Header */}
      <div className="loans-header">
        <div className="loans-back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span className="back-text">Loans to fund</span>
        </div>
      </div>

      {/* Single Loan Row */}
      <div className="loan-row">
        <div className="loan-avatar">
          <img src={loan.avatar} alt={loan.name} />
        </div>
        <div className="loan-name">{loan.name}</div>
        <div className="loan-due-date">{loan.dueDate}</div>
        <div className="loan-amount">{loan.amount}</div>
        <div className="loan-description">{loan.description}</div>
        <div className="loan-vault">{loan.vault}</div>
      </div>
    </div>
  );
}; 