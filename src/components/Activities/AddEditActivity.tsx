import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, TagCell, PopupButton, IconButton, CloseButton } from "@jbaluch/components";
import { Modal } from "../Modal/Modal";
import { SelectDate } from "../SelectDate/SelectDate";
import type { Activity } from '../../types/types';
import borrowerIcon from '../../assets/borrower.svg';
import loanIcon from '../../assets/loan.svg';
import vaultIcon from '../../assets/vault.svg';
import { ACTIVITY_CATEGORIES } from './activityConfigs';

// Generic configuration for different activity contexts
export interface ActivityConfig {
  context: 'vault' | 'loan' | 'general' | 'loan_funding';
  contextId?: string; // vault ID, loan ID, etc.
  contextName?: string; // vault name, loan name, etc.
  availableCategories: Array<{ value: string; label: string; emoji?: string }>;
  availableVaults?: Array<{ value: string; label: string }>;
  availableAccounts?: Array<{ value: string; label: string }>;
  availableLoans?: Array<{ value: string; label: string }>;
  showVaultField?: boolean;
  showAccountField?: boolean;
  showLoanField?: boolean;
  showApplyToLoan?: boolean;
  defaultCategory?: string;
  defaultVault?: string;
  defaultAccount?: string;
  defaultLoan?: string;
  // Loan funding specific fields
  loanAmount?: number;
  borrowerName?: string;
  vaultName?: string;
  vaultId?: string;
  borrowerId?: string;
}

interface AddEditActivityProps {
  open: boolean;
  mode: 'add' | 'edit';
  config: ActivityConfig;
  initialData?: Partial<Activity> & { 
    vault?: string; 
    account?: string; 
    loan?: string;
    note?: string;
    applyToLoan?: boolean;
    // Additional properties for edit mode navigation
    borrowerId?: string;
    borrowerName?: string;
    loanId?: string;
    loanName?: string;
    vaultId?: string;
    vaultName?: string;
    accountName?: string;
  };
  onClose: () => void;
  onSubmit: (data: Partial<Activity> & { 
    vault?: string; 
    account?: string; 
    loan?: string;
    note?: string;
    applyToLoan?: boolean;
  }) => void;
  // When true (used by Activities page), edit mode shows only Date and Notes
  minimalEdit?: boolean;
  onDelete?: () => void;
  onNavigateBorrower?: (borrowerId?: string) => void;
  onNavigateLoan?: (loanId?: string) => void;
  onNavigateVault?: (vaultId?: string) => void;
  // When minimalEdit is enabled, allow showing Amount field alongside Date
  minimalEditShowAmount?: boolean;
}

export const AddEditActivity: React.FC<AddEditActivityProps> = ({ 
  open, 
  mode, 
  config,
  initialData = {}, 
  onClose, 
  onSubmit, 
  minimalEdit = false,
  onDelete,
  onNavigateBorrower,
  onNavigateLoan,
  onNavigateVault,
  minimalEditShowAmount = false,
}) => {
  // Form state
  const [type, setType] = useState<'incoming' | 'outgoing'>(
    config.context === 'loan_funding' ? 'outgoing' : (initialData.type === 'incoming' ? 'incoming' : 'outgoing')
  );
  const [category, setCategory] = useState(
    initialData.tag || config.defaultCategory || config.availableCategories[0]?.value || ''
  );
  const [amount, setAmount] = useState(initialData.amount?.toString() || '');
  const [date, setDate] = useState(
    initialData.date ? new Date(initialData.date) : new Date()
  );
  const [vault, setVault] = useState(
    initialData.vault || config.defaultVault || config.availableVaults?.[0]?.value || ''
  );
  const [account, setAccount] = useState(
    initialData.account || config.defaultAccount || config.availableAccounts?.[0]?.value || ''
  );
  const [loan, setLoan] = useState(
    initialData.loan || config.defaultLoan || config.availableLoans?.[0]?.value || ''
  );
  const [note, setNote] = useState(initialData.note || '');
  const [applyToLoan, setApplyToLoan] = useState(initialData.applyToLoan || false);

  const isEdit = mode === 'edit';

  // Reset form when config changes - only on mount
  useEffect(() => {
    if (config.defaultCategory && !initialData.tag) {
      setCategory(config.defaultCategory);
    }
    if (config.defaultVault && !initialData.vault) {
      setVault(config.defaultVault);
    }
    if (config.defaultAccount && !initialData.account) {
      setAccount(config.defaultAccount);
    }
    if (config.defaultLoan && !initialData.loan) {
      setLoan(config.defaultLoan);
    }
  }, []); // Only run on mount

  // When opening or when initialData changes (selecting a different row),
  // sync all fields so the edit panel shows the clicked row's data.
  useEffect(() => {
    if (!open) return;
    setType(config.context === 'loan_funding' ? 'outgoing' : (initialData.type === 'incoming' ? 'incoming' : 'outgoing'));
    setCategory(initialData.tag || config.defaultCategory || config.availableCategories[0]?.value || '');
    setAmount(initialData.amount !== undefined && initialData.amount !== null ? String(initialData.amount) : '');
    setDate(initialData.date ? (initialData.date instanceof Date ? initialData.date : new Date(initialData.date)) : new Date());
    setVault(initialData.vault || config.defaultVault || config.availableVaults?.[0]?.value || '');
    setAccount(initialData.account || config.defaultAccount || config.availableAccounts?.[0]?.value || '');
    setLoan(initialData.loan || config.defaultLoan || config.availableLoans?.[0]?.value || '');
    setNote(initialData.note || '');
    setApplyToLoan(Boolean(initialData.applyToLoan));
  }, [open, initialData, config]);

  const handleSubmit = () => {
    const submitData: Partial<Activity> & { 
      vault?: string; 
      account?: string; 
      loan?: string;
      note?: string;
      applyToLoan?: boolean;
    } = {
      type,
      date,
    };

    // When not minimal edit, include full set
    if (!minimalEdit) {
      submitData.tag = category;
      submitData.amount = Number(amount);
      if (vault) submitData.vault = vault;
      if (account) submitData.account = account;
    } else if (minimalEditShowAmount) {
      submitData.amount = Number(amount);
    }
    if (loan && config.showLoanField && !minimalEdit && !isLoanFunding) {
      submitData.loan = loan;
    }
    if (config.showApplyToLoan && !minimalEdit) {
      submitData.applyToLoan = applyToLoan;
    }
    if (note) submitData.note = note;

    onSubmit(submitData);
  };

  // Get current category emoji
  const currentCategory = config.availableCategories.find(cat => cat.value === category);
  // Build a global lookup so tags not in local config (e.g., loan_payment) still resolve
  const globalCategoryLookup: Record<string, { label: string; emoji?: string }> = React.useMemo(() => {
    const all = [
      ...ACTIVITY_CATEGORIES.general,
      ...ACTIVITY_CATEGORIES.loan,
      ...ACTIVITY_CATEGORIES.vault,
      ...ACTIVITY_CATEGORIES.payment,
    ];
    return all.reduce((acc, c) => {
      acc[c.value] = { label: c.label, emoji: c.emoji };
      return acc;
    }, {} as Record<string, { label: string; emoji?: string }>);
  }, []);
  const resolvedCategory = currentCategory || globalCategoryLookup[category] || globalCategoryLookup[initialData.tag || ''];
  const categoryEmoji = resolvedCategory?.emoji || '🏷️';

  // Debug logging
  console.log('Current category state:', category);
  console.log('Current category object:', resolvedCategory);
  console.log('Available categories:', config.availableCategories);

  // Get context display name
  const getContextDisplayName = () => {
    if (config.contextName) return config.contextName;
    if (config.context === 'vault' && vault) {
      return config.availableVaults?.find(v => v.value === vault)?.label || vault;
    }
    if (config.context === 'loan' && loan) {
      return config.availableLoans?.find(l => l.value === loan)?.label || loan;
    }
    return 'Activity';
  };

  // Check if this is loan funding context
  const isLoanFunding = config.context === 'loan_funding';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100vh',
    background: '#fff',
  };

  const scrollableContentStyle: React.CSSProperties = {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: '24px',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const footerStyle: React.CSSProperties = {
    flex: '0 0 auto',
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f1',
    display: 'flex',
    gap: '16px',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  };

  // Inline SVG icons for top toolbar
  const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,21 17,13 7,13" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const Content = (
    <div style={scrollableContentStyle}>
            <div style={{ width: '100%', maxWidth: isLoanFunding ? 'none' : '400px' }}>
                {/* Header with context and amount */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 22, lineHeight: '30px', color: '#0D1728', marginBottom: 8, fontFamily: 'DM Sans' }}>
              {getContextDisplayName()}
            </div>
            <div style={{ fontSize: 14, color: '#595959' }}>
              <div style={{ display: 'inline-block' }}>
                <TagCell 
                  label={isLoanFunding ? "Loan funding" : (resolvedCategory?.label || category)} 
                  emoji={isLoanFunding ? "💸" : categoryEmoji} 
                  size="small" 
                  backgroundColor="#f0f0f1" 
                  textColor="#595959" 
                  severity="info" 
                />
              </div>
            </div>
          </div>
          <div style={{ fontWeight: 600, fontSize: 22, lineHeight: '30px', color: '#0D1728', fontFamily: 'DM Sans' }}>
            ${isLoanFunding ? (config.loanAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00') : (amount || '0.00')}
          </div>
        </div>

      {/* Incoming/Outgoing toggle - Figma Design */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          width: '290px',
          height: '36px',
          borderRadius: '20px',
          padding: '2px',
          gap: '4px',
          backgroundColor: '#F0F0F1',
          position: 'relative',
          boxShadow: 'inset 0 0 4px 0 rgba(0, 0, 0, 0.08), inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}>
          {/* Incoming Button */}
          <button
            onClick={() => !isLoanFunding && setType('incoming')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: type === 'incoming' ? '#FFFFFF' : 'transparent',
              color: type === 'incoming' ? '#000000' : '#6B6B70',
              fontSize: '14px',
              fontWeight: type === 'incoming' ? '500' : '400',
              cursor: isLoanFunding ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: type === 'incoming' ? '0 0.5px 0 0 rgba(0, 0, 0, 0.3), 0 0.5px 2.5px 0 rgba(0, 0, 0, 0.3)' : 'none',
              padding: '4px 16px',
              minHeight: '32px',
              textDecoration: type === 'incoming' ? 'none' : 'line-through',
              opacity: isLoanFunding ? 0.5 : 1,
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: `1px solid ${type === 'incoming' ? '#000000' : '#6B6B70'}`,
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: type === 'incoming' ? '#000000' : '#6B6B70',
              fontWeight: 'bold',
            }}>
              +
            </div>
            Incoming
          </button>
          
          {/* Outgoing Button */}
          <button
            onClick={() => !isLoanFunding && setType('outgoing')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: (type === 'outgoing' || isLoanFunding) ? '#FFFFFF' : 'transparent',
              color: (type === 'outgoing' || isLoanFunding) ? '#000000' : '#6B6B70',
              fontSize: '14px',
              fontWeight: (type === 'outgoing' || isLoanFunding) ? '500' : '400',
              cursor: isLoanFunding ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: (type === 'outgoing' || isLoanFunding) ? '0 0.5px 0 0 rgba(0, 0, 0, 0.3), 0 0.5px 2.5px 0 rgba(0, 0, 0, 0.3)' : 'none',
              padding: '4px 16px',
              minHeight: '32px',
              textDecoration: (type === 'outgoing' || isLoanFunding) ? 'none' : 'line-through',
              opacity: 1,
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: `1px solid ${type === 'outgoing' ? '#000000' : '#6B6B70'}`,
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: type === 'outgoing' ? '#000000' : '#6B6B70',
              fontWeight: 'bold',
            }}>
              –
            </div>
            Outgoing
          </button>
        </div>
      </div>

      {/* Date only for loan funding - placed before Money Flow */}
      {isLoanFunding && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
            <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Date</label>
          </div>
          <SelectDate
            value={date.toISOString().split('T')[0]}
            onChange={(value: string) => setDate(new Date(value))}
            required
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Money Flow section for loan funding */}
      {isLoanFunding && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            fontWeight: 500, 
            color: '#000000', 
            fontSize: '14px', 
            marginBottom: 16 
          }}>
            Money Flow
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center'
          }}>
            {/* Source (Vault) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '16px',
              backgroundColor: '#E3F2FD',
              borderRadius: '8px',
              border: '1px solid #BBDEFB'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#2196F3',
                  borderRadius: '6px'
                }}>
                  <img src={vaultIcon} alt="Vault" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                </div>
                <span style={{ fontWeight: 500, color: '#0D1728', fontSize: '14px' }}>
                  {config.vaultName || 'Gateway'}
                </span>
              </div>
              <span style={{ fontWeight: 600, color: '#0D1728', fontSize: '16px' }}>
                ${config.loanAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>

            {/* Arrow */}
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="#6B6B70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Destination (Borrower) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '16px',
              backgroundColor: '#E3F2FD',
              borderRadius: '8px',
              border: '1px solid #BBDEFB'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#2196F3',
                  borderRadius: '6px'
                }}>
                  <img src={borrowerIcon} alt="Borrower" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                </div>
                <span style={{ fontWeight: 500, color: '#0D1728', fontSize: '14px' }}>
                  {config.borrowerName || 'Borrower'}
                </span>
              </div>
              <span style={{ fontWeight: 600, color: '#0D1728', fontSize: '16px' }}>
                ${config.loanAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details block: in minimal edit, place right under toggle */}
      {isEdit && minimalEdit && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 20,
            padding: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '0',
            marginLeft: '-24px',
            marginRight: '-24px',
            width: 'calc(100% + 48px)'
          }}>
            <button 
              onClick={() => (onNavigateBorrower ? onNavigateBorrower(initialData.borrowerId) : window.location.href = `/borrowers/${initialData.borrowerId}`)}
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 12,
                background: 'none',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <img src={borrowerIcon} alt="Borrower" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0.8) contrast(1)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#595959', 
                  marginBottom: 4, 
                  fontWeight: '700',
                  fontFamily: 'DM Sans',
                  lineHeight: '20px',
                  letterSpacing: '0%'
                }}>Borrower</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  color: '#0D1728',
                  fontFamily: 'DM Sans',
                  lineHeight: '22px',
                  letterSpacing: '0%'
                }}>
                  {initialData.borrowerName || 'My borrower'}
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => (onNavigateLoan ? onNavigateLoan(initialData.loanId) : window.location.href = `/loans/${initialData.loanId}`)}
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 12,
                background: 'none',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <img src={loanIcon} alt="Loan" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0.8) contrast(1)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#595959', 
                  marginBottom: 4, 
                  fontWeight: '700',
                  fontFamily: 'DM Sans',
                  lineHeight: '20px',
                  letterSpacing: '0%'
                }}>Loan</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  color: '#0D1728',
                  fontFamily: 'DM Sans',
                  lineHeight: '22px',
                  letterSpacing: '0%'
                }}>
                  {initialData.loanName || 'Loan name'}
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => (onNavigateVault ? onNavigateVault(initialData.vaultId) : window.location.href = `/vaults/${initialData.vaultId}`)}
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 12,
                background: 'none',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <img src={vaultIcon} alt="Vault" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0.8) contrast(1)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#595959', 
                  marginBottom: 4, 
                  fontWeight: '700',
                  fontFamily: 'DM Sans',
                  lineHeight: '20px',
                  letterSpacing: '0%'
                }}>Vault</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  color: '#0D1728',
                  fontFamily: 'DM Sans',
                  lineHeight: '22px',
                  letterSpacing: '0%'
                }}>
                  {initialData.vaultName || 'Gateway'}
                </div>
              </div>
            </button>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21h18M3 7h18M3 3h18M7 11h10M7 15h10" stroke="#595959" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#595959" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#595959', 
                  marginBottom: 4, 
                  fontWeight: '700',
                  fontFamily: 'DM Sans',
                  lineHeight: '20px',
                  letterSpacing: '0%'
                }}>Account</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  color: '#0D1728',
                  fontFamily: 'DM Sans',
                  lineHeight: '22px',
                  letterSpacing: '0%'
                }}>
                  {initialData.accountName || 'Savings'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category dropdown - hidden in minimal edit */}
      {!minimalEdit && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
            <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Category</label>
          </div>
          <PopupButton
            defaultValue={resolvedCategory ? `${resolvedCategory.emoji || ''} ${resolvedCategory.label}`.trim() : "Select category"}
            items={config.availableCategories.map(opt => ({ 
              id: opt.value, 
              label: opt.emoji ? `${opt.emoji} ${opt.label}` : opt.label 
            }))}
            menuStyle="text"
            onSelect={(selectedId: string) => {
              console.log('Category selected:', selectedId);
              setCategory(selectedId);
            }}
            width="100%"
            menuMaxHeight="200px"
          />
        </div>
      )}

      {/* Amount and Date */}
      {!minimalEdit && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
              <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Amount</label>
            </div>
            <Input
              value={amount}
              onChange={setAmount}
              type="currency"
              required
              placeholder="0"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
              <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Date</label>
            </div>
            <DatePicker
              value={date}
              onChange={setDate}
              required
              errorMessage=""
              minDate={undefined}
              maxDate={undefined}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Minimal edit: Amount (optional) + Date */}
      {minimalEdit && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {minimalEditShowAmount && (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
                <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Amount</label>
              </div>
              <Input
                value={amount}
                onChange={setAmount}
                type="currency"
                required
                placeholder="0"
                style={{ width: '100%' }}
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
              <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Date</label>
            </div>
            <DatePicker
              value={date}
              onChange={setDate}
              required
              errorMessage=""
              minDate={undefined}
              maxDate={undefined}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Vault and Account fields - only show if configured */}
      {(!minimalEdit) && (config.showVaultField || config.showAccountField) && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {config.showVaultField && config.availableVaults && (
            <div style={{ flex: 1 }}>
              <PopupButton
                defaultValue="Select vault"
                items={config.availableVaults.map(opt => ({ 
                  id: opt.value, 
                  label: opt.label 
                }))}
                label="Vault"
                menuStyle="text"
                onSelect={(selectedId: string) => setVault(selectedId)}
                width="100%"
                menuMaxHeight="200px"
              />
            </div>
          )}
          {config.showAccountField && config.availableAccounts && (
            <div style={{ flex: 1 }}>
              <PopupButton
                defaultValue="Select account"
                items={config.availableAccounts.map(opt => ({ 
                  id: opt.value, 
                  label: opt.label 
                }))}
                label="Account"
                menuStyle="text"
                onSelect={(selectedId: string) => setAccount(selectedId)}
                width="100%"
                menuMaxHeight="200px"
              />
            </div>
          )}
        </div>
      )}

      {/* Loan field - only show if configured */}
      {!minimalEdit && config.showLoanField && config.availableLoans && (
        <div style={{ marginBottom: 16 }}>
          <PopupButton
            defaultValue="Select a loan"
            items={config.availableLoans.map(opt => ({ 
              id: opt.value, 
              label: opt.label 
            }))}
            label="Loan"
            menuStyle="text"
            onSelect={(selectedId: string) => setLoan(selectedId)}
            width="100%"
            menuMaxHeight="200px"
          />
        </div>
      )}

      {/* Note field */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#000000', fontSize: '14px' }}>Notes</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          style={{ 
            width: '100%', 
            borderRadius: '4px', 
            border: '0.5px solid #DFDFE6', 
            padding: '8px 12px', 
            fontFamily: 'inherit', 
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            resize: 'vertical',
            minHeight: '76px',
            boxShadow: '0 0.5px 2.5px 0 rgba(0, 0, 0, 0.2)',
          }}
          onFocus={(e) => e.target.style.borderColor = '#007AFF'}
          onBlur={(e) => e.target.style.borderColor = '#DFDFE6'}
        />
      </div>

      {/* Apply to loan checkbox - only show if configured */}
      {config.showApplyToLoan && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <input 
            type="checkbox" 
            checked={applyToLoan} 
            onChange={e => setApplyToLoan(e.target.checked)}
            style={{ 
              accentColor: '#007AFF',
              width: '18px',
              height: '18px',
              marginTop: '2px',
            }} 
          />
          <div style={{ flex: 1 }}>
            <span style={{ color: '#000000', fontSize: '14px', fontWeight: '400' }}>Apply to loan</span>
            <div style={{ color: '#6B6B70', fontSize: '12px', marginTop: '4px' }}>
              Apply to a loan. This increases the loan balance.
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );

  const Footer = (
    <div style={footerStyle}>
      <Button 
        type="secondary" 
        iconComponent={undefined} 
        onMouseEnter={() => {}} 
        onMouseLeave={() => {}} 
        name="cancel" 
        form="" 
        ariaLabel="Cancel" 
        onClick={onClose} 
        style={{ width: '90px' }}
      >
        Cancel
      </Button>
      <Button 
        type="primary" 
        iconComponent={undefined} 
        onMouseEnter={() => {}} 
        onMouseLeave={() => {}} 
        name={isEdit ? 'save' : (isLoanFunding ? 'confirm' : 'add')} 
        form="" 
        ariaLabel={isEdit ? 'Save' : (isLoanFunding ? 'Confirm' : 'Add')} 
        onClick={handleSubmit} 
        style={{ width: '90px' }}
      >
        {isEdit ? 'Save' : (isLoanFunding ? 'Confirm' : 'Add')}
      </Button>
    </div>
  );

  // Modal for add mode
  if (mode === 'add') {
    return (
      <Modal open={open} onClose={onClose}>
        <div style={containerStyle}>
          {Content}
          {Footer}
        </div>
      </Modal>
    );
  }

  // Sidebar for edit mode
  if (!open) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed',
      top: '120px', // Start below the header and tabs
      right: '24px', // Add margin from right edge
      width: 400,
      minWidth: 400,
      height: 'calc(100vh - 120px)', // Subtract the header height
      backgroundColor: '#FFFFFF',
      borderRadius: '10px 10px 0 0', // Round both top corners
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      {/* Top toolbar to match Figma: save, delete, close */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: '#EDEDED',
        borderBottom: '1px solid #e6e6e9',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconButton aria-label="Save" type="secondary" interaction="secondary" icon={SaveIcon} onClick={handleSubmit} />
          <div style={{ 
            width: 1, 
            height: 12, 
            background: 'rgba(0, 0, 0, 0.25)', 
            borderRadius: 4,
            margin: '0 8px'
          }} />
          <IconButton aria-label="Delete" type="secondary" interaction="secondary" icon={DeleteIcon} onClick={onDelete} />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <CloseButton aria-label="Close" type="dark" onClick={onClose} />
        </div>
      </div>
      <div style={{
        ...containerStyle,
        height: '100%',
        paddingTop: '20px', // Small padding from top
        paddingBottom: '20px'
      }}>
        {Content}
        {Footer}
      </div>
    </div>
  );
}; 