import React, { useState } from 'react';
import { Table, TextCell, EmptyState } from '@jbaluch/components';
import { SegmentedControl } from '../ui';
import type { SegmentedControlItem } from '../ui';
import './TransfersScreen.css';

interface Transfer {
  id: string;
  date: string;
  amount: string;
  source: string;
  destination: string;
  gateway: string;
}

interface TransfersScreenProps {
  onBack: () => void;
}

// Custom cell component for destination
const DestinationCell: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%'
  }}>
    <span>→ <span style={{ marginLeft: '8px' }}>{text.replace('→ ', '')}</span></span>
    <span>3 <span style={{ color: '#00B5AE' }}>{'>'}</span></span>
  </div>
);

export const TransfersScreen: React.FC<TransfersScreenProps> = ({ onBack }) => {
  const [activeGateway, setActiveGateway] = useState('Gateway 3');

  const transfers: Transfer[] = [
    {
      id: '1',
      date: 'Jul 1 - Jul 31, 2024',
      amount: '$600',
      source: 'from Gateway 3',
      destination: 'to Vault ABC',
      gateway: 'Gateway 3'
    },
    {
      id: '2',
      date: 'Jul 1 - Jul 31, 2024',
      amount: '$225',
      source: 'from Gateway 3',
      destination: 'to Vault 123',
      gateway: 'Gateway 3'
    }
  ];

  const gatewayItems: SegmentedControlItem[] = [
    { id: 'Gateway 1', label: 'Gateway 1', count: 0 },
    { id: 'Gateway 2', label: 'Gateway 2', count: 1 },
    { id: 'Gateway 3', label: 'Gateway 3', count: 4 },
    { id: 'Gateway 4', label: 'Gateway 4', count: 0 }
  ];

  const filteredTransfers = transfers.filter(transfer => transfer.gateway === activeGateway);

  return (
    <div className="transfers-screen">
      {/* Header */}
      <div className="transfers-header">
        <div className="transfers-back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span className="back-text">Transfers due</span>
        </div>
      </div>

      {/* Content */}
      <div className="transfers-content">
        {/* Gateway Tabs */}
        <div className="gateway-tabs">
          <SegmentedControl
            items={gatewayItems}
            activeItemId={activeGateway}
            onItemClick={setActiveGateway}
          />
        </div>

        {/* Transfers Section */}
        <div className="transfers-section">
          {filteredTransfers.length > 0 ? (
            <Table
              columns={[
                {
                  key: 'action',
                  label: 'Jul 1 - Jul 31, 2024',
                  cellComponent: TextCell,
                  width: '25%',
                  alignment: 'left',
                  getCellProps: () => ({ text: 'Send' }),
                },
                {
                  key: 'amount',
                  label: 'Amount',
                  cellComponent: TextCell,
                  width: '25%',
                  alignment: 'right',
                  getCellProps: (row: Transfer) => ({ text: row.amount }),
                },
                {
                  key: 'source',
                  label: 'Source',
                  cellComponent: TextCell,
                  width: '25%',
                  alignment: 'left',
                  getCellProps: (row: Transfer) => ({ text: row.source }),
                },
                {
                  key: 'destination',
                  label: 'Destination',
                  cellComponent: DestinationCell,
                  width: '25%',
                  alignment: 'left',
                  getCellProps: (row: Transfer) => ({ 
                    text: `→ ${row.destination}`
                  }),
                }
              ]}
              data={filteredTransfers}
              selectable={true}
              onSelectionChange={() => {}}
              onRowClick={() => {}}
              onSortChange={() => {}}
            />
          ) : (
            <div className="empty-state-center">
              <EmptyState
                imageName="NoActivity"
                title="No data available"
                description="No transfers available for this gateway."
                customImage={undefined}
              />
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="history-section">
          <h3 className="history-title">History for {activeGateway}</h3>
          <div className="empty-state-center">
            <EmptyState
              imageName="NoActivity"
              title="No history"
              description="Mark transfers as complete. They will show here."
              customImage={undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 