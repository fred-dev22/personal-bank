import React from 'react';
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
  const handleVaultDetails = (vaultId: string) => {
    onVaultDetails?.(vaultId);
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
            <div className="vaults-overview-card__vault-item selected">
              <div className="vaults-overview-card__vault-info">
                <span className="vaults-overview-card__vault-name">Vault ABC</span>
                <span className="vaults-overview-card__vault-issues">2 issues</span>
              </div>
              <div className="vaults-overview-card__vault-balance">$15,000.00</div>
            </div>
            <div className="vaults-overview-card__vault-item">
              <div className="vaults-overview-card__vault-info">
                <span className="vaults-overview-card__vault-name">Vault 123</span>
              </div>
              <div className="vaults-overview-card__vault-balance">$15,000.00</div>
            </div>
            <div className="vaults-overview-card__vault-item">
              <div className="vaults-overview-card__vault-info">
                <span className="vaults-overview-card__vault-name">Vault XYZ</span>
              </div>
              <div className="vaults-overview-card__vault-balance">$15,000.00</div>
            </div>
            <div className="vaults-overview-card__vault-item gateway">
              <div className="vaults-overview-card__vault-info">
                <span className="vaults-overview-card__vault-name">Gateway</span>
              </div>
              <div className="vaults-overview-card__vault-balance">$15,000.00</div>
            </div>
          </div>

          {/* Vault Details */}
          <div className="vaults-overview-card__details">
            {/* Vault Button - Above Financials */}
            <div className="vaults-overview-card__vault-header">
              <button
                className="vaults-overview-card__vault-button"
                onClick={() => handleVaultDetails('vault-abc')}
              >
                Vault ABC &gt;
              </button>
            </div>

            {/* Financials Section */}
            <div className="vaults-overview-card__section">
              <div className="vaults-overview-card__section-title">Financials</div>
              <div className="vaults-overview-card__section-content">
                <div className="vaults-overview-card__metric">
                  <div className="vaults-overview-card__metric-value">
                    $600.00
                  </div>
                  <div className="vaults-overview-card__metric-label">June paid in</div>
                </div>
                <div className="vaults-overview-card__metric">
                  <div className="vaults-overview-card__metric-value">
                    $10,000.00
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
                    $10,000.00
                  </div>
                  <div className="vaults-overview-card__metric-label">Reserves</div>
                </div>
                <div className="vaults-overview-card__metric">
                  <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--loan">
                    56%
                  </div>
                  <div className="vaults-overview-card__metric-label">Loan to value</div>
                </div>
                <div className="vaults-overview-card__metric">
                  <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--dscr">
                    1.40
                  </div>
                  <div className="vaults-overview-card__metric-label">Income DSCR</div>
                </div>
                <div className="vaults-overview-card__metric">
                  <div className="vaults-overview-card__metric-value vaults-overview-card__metric-value--dscr">
                    1.43
                  </div>
                  <div className="vaults-overview-card__metric-label">Growth DSCR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 