import React, { useMemo, useEffect } from 'react';
import { Input } from '@jbaluch/components';
import type { Loan, Vault } from '../../../types/types';
import { calculateMonthlyPayment, formatCurrency, calculateCashFlowRate } from './utils';
import { formatCurrency as formatCurrencyGlobal } from '../../../utils/currencyUtils';

export const StepFunding: React.FC<{
  loanData: Partial<Loan>;
  setLoanData: React.Dispatch<React.SetStateAction<Partial<Loan>>>;
  validationErrors?: {[key: string]: string};
  hideFundingInfo?: boolean;
  vaults: Vault[];
}> = ({ loanData, setLoanData, validationErrors = {}, hideFundingInfo = false, vaults }) => {
  // Calculer le paiement mensuel et le taux de flux de trésorerie
  const monthlyPayment = useMemo(() => {
    const { initial_balance, initial_annual_rate, initial_number_of_payments } = loanData;
    
    if (initial_balance && initial_annual_rate && initial_number_of_payments) {
      return calculateMonthlyPayment(initial_balance, initial_annual_rate, initial_number_of_payments);
    }
    return 0;
  }, [loanData.initial_balance, loanData.initial_annual_rate, loanData.initial_number_of_payments]);

  const cashFlowRate = useMemo(() => {
    if (monthlyPayment && loanData.initial_balance) {
      return calculateCashFlowRate(monthlyPayment, loanData.initial_balance);
    }
    return 0;
  }, [monthlyPayment, loanData.initial_balance]);

  // Filtrer les vaults qui ont un montant suffisant pour financer le prêt
  const availableVaults = useMemo(() => {
    const loanAmount = Number(loanData.initial_balance) || 0;
    return vaults.filter(vault => {
      const vaultAmount = Number(vault.available_for_lending_amount || vault.balance || 0);
      return vaultAmount >= loanAmount;
    });
  }, [vaults, loanData.initial_balance]);

  // Sélectionner automatiquement le premier vault disponible si aucun n'est sélectionné
  useEffect(() => {
    if (availableVaults.length > 0 && !loanData.vault_id) {
      setLoanData(prev => ({ ...prev, vault_id: availableVaults[0].id }));
    }
  }, [availableVaults, loanData.vault_id, setLoanData]);

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: hideFundingInfo ? '1fr' : '1fr 1fr', gap: 32 }}>
        <div style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Funding source</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            How do you want to fund this loan? You can adjust the loan terms to meet a vault's minimum Income DSCR.
          </p>
          
                     {availableVaults.map((vault) => (
            <div 
              key={vault.id}
              className={`loan-wizard-funding-card ${loanData.vault_id === vault.id ? 'selected' : ''}`}
              onClick={() => setLoanData(prev => ({ ...prev, vault_id: vault.id }))}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                background: loanData.vault_id === vault.id ? '#EEEEF2' : '#fff',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (loanData.vault_id !== vault.id) {
                  e.currentTarget.style.backgroundColor = '#EEEEF2';
                }
              }}
              onMouseLeave={(e) => {
                if (loanData.vault_id !== vault.id) {
                  e.currentTarget.style.backgroundColor = '#fff';
                }
              }}
            >
              <div className="loan-wizard-funding-card-header">
                <input
                  type="radio"
                  checked={loanData.vault_id === vault.id}
                  onChange={() => setLoanData(prev => ({ ...prev, vault_id: vault.id }))}
                  style={{ pointerEvents: 'none' }}
                />
                <div>
                  <div className="loan-wizard-funding-card-title">{vault.nickname || vault.name}</div>
                                        <div className="loan-wizard-funding-card-subtitle">{vault.type || 'cash vault'}</div>
                </div>
                <div className="loan-wizard-funding-card-amount">
                  {formatCurrencyGlobal(vault.available_for_lending_amount || vault.balance || 0)}
                </div>
              </div>
            </div>
          ))}
          
          {validationErrors.vault_id && (
            <div style={{ 
              color: '#d32f2f', 
              fontSize: 14, 
              marginTop: 8 
            }}>
              {validationErrors.vault_id}
            </div>
          )}
        </div>
        
        {!hideFundingInfo && (
          <div style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Loan Terms</h2>
            
            <div className="loan-wizard-form-group">
              <Input
                label="Term in months"
                placeholder="Enter term"
                required
                value={loanData.initial_number_of_payments?.toString() || ''}
                onChange={(value: string) => setLoanData(prev => ({ ...prev, initial_number_of_payments: value ? parseInt(value) : undefined }))}
                error={validationErrors.initial_number_of_payments}
              />
            </div>
            
            <div className="loan-wizard-form-group">
              <Input
                label="Annual interest rate"
                placeholder="Enter rate"
                required
                type="percentage"
                value={loanData.initial_annual_rate?.toString() || ''}
                onChange={(value: string) => setLoanData(prev => ({ ...prev, initial_annual_rate: value ? parseFloat(value) : undefined }))}
                error={validationErrors.initial_annual_rate}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: '#666' }}>Cash flow rate</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {cashFlowRate > 0 ? `${cashFlowRate.toFixed(2)}%` : '0.00%'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#666' }}>Payment</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {formatCurrency(monthlyPayment)}
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