import React from 'react';
import './PaymentsScreen.css';

interface Payment {
  id: string;
  name: string;
  avatar: string;
  dueDate: string;
  amount: string;
  description: string;
  vault: string;
  isOverdue?: boolean;
}

interface PaymentsScreenProps {
  onBack: () => void;
}

export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ onBack }) => {
  const payments: Payment[] = [
    {
      id: '1',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due May 27',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC',
      isOverdue: true
    },
    {
      id: '2',
      name: 'Marcela',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$300.00',
      description: 'Tuition',
      vault: 'Vault ABC'
    },
    {
      id: '3',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '4',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '5',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '6',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '7',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '8',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '9',
      name: 'Clovis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$100.00',
      description: 'Another Vacation',
      vault: 'Vault ABC'
    },
    {
      id: '10',
      name: 'Marcela',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      dueDate: 'Due July 1',
      amount: '$300.00',
      description: 'Tuition',
      vault: 'Vault ABC'
    }
  ];

  const previousDatesPayments = payments.filter(p => p.isOverdue);
  const thisMonthPayments = payments.filter(p => !p.isOverdue && p.dueDate.includes('July'));
  const nextMonthPayments = payments.filter(p => !p.isOverdue && p.dueDate.includes('August'));

  const renderPaymentRow = (payment: Payment) => (
    <div key={payment.id} className="payment-row">
      <div className="payment-cell payment-cell-avatar">
        <div className="avatar-name">
          <img src={payment.avatar} alt={payment.name} className="payment-avatar" />
          <span className="payment-name">{payment.name}</span>
        </div>
      </div>
      <div className="payment-cell payment-cell-date">
        <span className={`payment-due-date ${payment.isOverdue ? 'overdue' : ''}`}>
          {payment.dueDate}
        </span>
      </div>
      <div className="payment-cell payment-cell-amount">
        <span className="payment-amount">{payment.amount}</span>
      </div>
      <div className="payment-cell payment-cell-description">
        <span className="payment-description">{payment.description}</span>
      </div>
      <div className="payment-cell payment-cell-vault">
        <span className="payment-vault">{payment.vault}</span>
      </div>
    </div>
  );

  return (
    <div className="payments-screen">
      {/* Header */}
      <div className="payments-header">
        <div className="payments-back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span className="back-text">Payments to receive</span>
        </div>
        <div className="payments-filter">
          <div className="filter-dropdown">
            <span>View by: <strong>loan</strong></span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="payments-content">
        {previousDatesPayments.length > 0 && (
          <div className="payments-section">
            <h3 className="section-title">Previous Dates</h3>
            <div className="payments-table">
              {previousDatesPayments.map(renderPaymentRow)}
            </div>
          </div>
        )}

        {thisMonthPayments.length > 0 && (
          <div className="payments-section">
            <h3 className="section-title">This Month</h3>
            <div className="payments-table">
              {thisMonthPayments.map(renderPaymentRow)}
            </div>
          </div>
        )}

        {nextMonthPayments.length > 0 && (
          <div className="payments-section">
            <h3 className="section-title">Next Month</h3>
            <div className="payments-table">
              {nextMonthPayments.map(renderPaymentRow)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 