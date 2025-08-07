import React, { useState, useEffect } from 'react';
import type { Vault } from '../../types/types';
import './VaultsOverviewCard.css';

interface VaultsOverviewCardProps {
  vaults: Vault[];
  onVaultSelect?: (vaultId: string) => void;
  onVaultDetails?: (vaultId: string) => void;
}

export const VaultsOverviewCard: React.FC<VaultsOverviewCardProps> = ({ 
  vaults, 
  onVaultDetails 
}) => {
  // DEBUG: Affiche les vaults reçus
  console.log('[DEBUG VaultsOverviewCard] Vaults reçus:', vaults);

  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(
    vaults.length > 0 ? vaults[0].id : null
  );

  // S'assurer que le premier vault soit toujours sélectionné par défaut
  useEffect(() => {
    if (vaults.length > 0 && (!selectedVaultId || !vaults.find(v => v.id === selectedVaultId))) {
      setSelectedVaultId(vaults[0].id);
    }
  }, [vaults, selectedVaultId]);

  const selectedVault = vaults.find(vault => vault.id === selectedVaultId) || vaults[0];

  const handleVaultSelect = (vaultId: string) => {
    setSelectedVaultId(vaultId);
  };

  const handleVaultDetails = (vaultId: string) => {
    onVaultDetails?.(vaultId);
  };

  const formatCurrency = (amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) return '$0.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatPercentage = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0%';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${(num * 100).toFixed(0)}%`;
  };

  if (vaults.length === 0) {
    return (
      <div className="vaults-overview-container">
        <h3 className="vaults-overview-card__title">Vaults</h3>
        <div className="vaults-overview-card">
          <div className="vaults-overview-card__empty">
            <div className="vaults-overview-card__empty-text">
              <div>No vaults available</div>
              <div>Create your first vault to get started</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vaults-overview-container">
      <h3 className="vaults-overview-card__title">Vaults</h3>
      <div className="vaults-overview-card">
        
        <div className="vaults-overview-card__content">
          {/* Vaults List */}
          <div className="vaults-overview-card__list">
            {vaults.map((vault) => (
              <div 
                key={vault.id}
                className={`vaults-overview-card__vault-item ${selectedVaultId === vault.id ? 'selected' : ''}`}
                onClick={() => handleVaultSelect(vault.id)}
              >
                <div className="vaults-overview-card__vault-info">
                  <span className="vaults-overview-card__vault-name">
                    {vault.name || vault.nickname || 'Unnamed Vault'}
                  </span>
                  {vault.issues > 0 && (
                    <span className="vaults-overview-card__vault-issues">
                      {vault.issues} issue{vault.issues > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="vaults-overview-card__vault-balance">
                  {formatCurrency(vault.balance)}
                </div>
              </div>
            ))}
          </div>

          {/* Vault Details */}
          {selectedVault && (
            <div className="vaults-overview-card__details">
              {/* Vault Button - Above Financials */}
              <div className="vaults-overview-card__vault-header">
                <button
                  className="vaults-overview-card__vault-button"
                  onClick={() => handleVaultDetails(selectedVault.id)}
                >
                  {selectedVault.name || selectedVault.nickname || 'Unnamed Vault'} &gt;
                </button>
              </div>

              {/* Financials Section */}
              <div className="vaults-overview-card__section">
                <div className="vaults-overview-card__section-title">Financials</div>
                <div className="vaults-overview-card__section-content">
                  <div className="vaults-overview-card__metric">
                    <div className="vaults-overview-card__metric-value">
                      {formatCurrency(selectedVault.financials?.paidIn)}
                    </div>
                    <div className="vaults-overview-card__metric-label">June paid in</div>
                  </div>
                  <div className="vaults-overview-card__metric">
                    <div className="vaults-overview-card__metric-value">
                      {formatCurrency(selectedVault.financials?.paidOut)}
                    </div>
                    <div className="vaults-overview-card__metric-label">June paid out</div>
                  </div>
                </div>
              </div>

              {/* Health Section */}
              <div className="vaults-overview-card__section">
                <div className="vaults-overview-card__section-title">Health</div>
                <div className="vaults-overview-card__section-content vaults-overview-card__section-content--health">
                  <div className="vaults-overview-card__metric">
                    <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--reserves">
                      {formatCurrency(selectedVault.health?.reserves)}
                    </div>
                    <div className="vaults-overview-card__metric-label">Reserves</div>
                  </div>
                  <div className="vaults-overview-card__metric">
                    <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--loan">
                      {formatPercentage(selectedVault.health?.loanToValue)}
                    </div>
                    <div className="vaults-overview-card__metric-label">Loan to value</div>
                  </div>
                  <div className="vaults-overview-card__metric">
                    <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--dscr">
                      {selectedVault.health?.incomeDSCR?.toFixed(2) || '0.00'}
                    </div>
                    <div className="vaults-overview-card__metric-label">Income DSCR</div>
                  </div>
                  <div className="vaults-overview-card__metric">
                    <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--dscr">
                      {selectedVault.health?.growthDSCR?.toFixed(2) || '0.00'}
                    </div>
                    <div className="vaults-overview-card__metric-label">Growth DSCR</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 