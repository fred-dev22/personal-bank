import React, { useState } from 'react';
import './RequestsScreen.css';

interface Request {
  id: string;
  name: string;
  avatar: string;
  neededBy: string;
  amount: string;
  type: string;
  status: string;
  isUrgent?: boolean;
}

interface RequestsScreenProps {
  onBack: () => void;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({ onBack }) => {
  const [filterBy, setFilterBy] = useState('status');

  const requests: Request[] = [
    {
      id: '1',
      name: 'Carl',
      avatar: '/api/placeholder/32/32',
      neededBy: 'Needed June 3, 2024',
      amount: '$4,000.00',
      type: 'CD Ladder',
      status: 'Underwriting',
      isUrgent: true
    },
    {
      id: '2',
      name: 'Sarah',
      avatar: '/api/placeholder/32/32',
      neededBy: 'Needed June 10, 2024',
      amount: '$2,500.00',
      type: 'Home Improvement',
      status: 'Pending'
    },
    {
      id: '3',
      name: 'Mike',
      avatar: '/api/placeholder/32/32',
      neededBy: 'Needed June 15, 2024',
      amount: '$6,000.00',
      type: 'Business Loan',
      status: 'Review'
    }
  ];

  const urgentRequests = requests.filter(request => request.isUrgent);
  const otherRequests = requests.filter(request => !request.isUrgent);

  const renderRequestItem = (request: Request) => (
    <div key={request.id} className={`request-item ${request.isUrgent ? 'urgent' : ''}`}>
      <div className="request-avatar">
        <img src={request.avatar} alt={request.name} />
      </div>
      <div className="request-info">
        <div className="request-name">{request.name}</div>
        <div className="request-details">
          <span className={`request-needed-by ${request.isUrgent ? 'urgent' : ''}`}>
            {request.neededBy}
          </span>
          <span className="request-amount">{request.amount}</span>
          <span className="request-type">{request.type}</span>
          <span className={`request-status ${request.status.toLowerCase()}`}>
            {request.status}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="requests-screen">
      {/* Header */}
      <div className="requests-header">
        <div className="requests-back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span className="back-text">Requests to review</span>
        </div>
        <div className="requests-filter">
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-dropdown"
          >
            <option value="status">View by Status</option>
            <option value="type">View by Type</option>
            <option value="date">View by Date</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="requests-content">
        {urgentRequests.length > 0 && (
          <div className="requests-section">
            <div className="requests-list">
              {urgentRequests.map(renderRequestItem)}
            </div>
          </div>
        )}

        {otherRequests.length > 0 && (
          <div className="requests-section">
            <div className="requests-list">
              {otherRequests.map(renderRequestItem)}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="requests-empty">
            <div className="empty-text">No requests to review at the moment</div>
          </div>
        )}
      </div>
    </div>
  );
}; 