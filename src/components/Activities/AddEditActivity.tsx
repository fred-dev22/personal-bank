import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, TagCell, PopupButton } from "@jbaluch/components";
import { Modal } from "../Modal/Modal";
import type { Activity } from '../../types/types';

// Generic configuration for different activity contexts
export interface ActivityConfig {
  context: 'vault' | 'loan' | 'general';
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
    vault: string; 
    account: string; 
    loan?: string;
    note: string;
    applyToLoan?: boolean;
  }) => void;
}

export const AddEditActivity: React.FC<AddEditActivityProps> = ({ 
  open, 
  mode, 
  config,
  initialData = {}, 
  onClose, 
  onSubmit 
}) => {
  // Form state
  const [type, setType] = useState<'incoming' | 'outgoing'>(
    initialData.type === 'incoming' ? 'incoming' : 'outgoing'
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

  const handleSubmit = () => {
    const submitData: Partial<Activity> & { 
      vault: string; 
      account: string; 
      loan?: string;
      note: string;
      applyToLoan?: boolean;
    } = {
      type,
      tag: category,
      amount: Number(amount),
      date,
      vault,
      account,
      note,
    };

    // Only include loan-related fields if they're relevant
    if (config.showLoanField && loan) {
      submitData.loan = loan;
    }
    if (config.showApplyToLoan) {
      submitData.applyToLoan = applyToLoan;
    }

    onSubmit(submitData);
  };

  // Get current category emoji
  const currentCategory = config.availableCategories.find(cat => cat.value === category);
  const categoryEmoji = currentCategory?.emoji || '🏷️';
  
  // Debug logging
  console.log('Current category state:', category);
  console.log('Current category object:', currentCategory);
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

  const Content = (
    <div style={scrollableContentStyle}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {/* Header with context and amount */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#000000', marginBottom: 8 }}>
              {getContextDisplayName()}
            </div>
            <div style={{ fontSize: 14, color: '#595959' }}>
              <div style={{ display: 'inline-block' }}>
                <TagCell 
                  label={currentCategory?.label || category} 
                  emoji={categoryEmoji} 
                  size="small" 
                  backgroundColor="#f0f0f1" 
                  textColor="#595959" 
                  severity="info" 
                />
              </div>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#000000' }}>
            ${amount || '0.00'}
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
            onClick={() => setType('incoming')}
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
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: type === 'incoming' ? '0 0.5px 0 0 rgba(0, 0, 0, 0.3), 0 0.5px 2.5px 0 rgba(0, 0, 0, 0.3)' : 'none',
              padding: '4px 16px',
              minHeight: '32px',
              textDecoration: type === 'incoming' ? 'none' : 'line-through',
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
            onClick={() => setType('outgoing')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: type === 'outgoing' ? '#FFFFFF' : 'transparent',
              color: type === 'outgoing' ? '#000000' : '#6B6B70',
              fontSize: '14px',
              fontWeight: type === 'outgoing' ? '500' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: type === 'outgoing' ? '0 0.5px 0 0 rgba(0, 0, 0, 0.3), 0 0.5px 2.5px 0 rgba(0, 0, 0, 0.3)' : 'none',
              padding: '4px 16px',
              minHeight: '32px',
              textDecoration: type === 'outgoing' ? 'none' : 'line-through',
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

      {/* Category dropdown */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: '#B50007', fontSize: '15px', fontWeight: 600, marginRight: 2 }}>*</span>
          <label style={{ fontWeight: 500, color: '#000000', fontSize: '14px' }}>Category</label>
        </div>
        <PopupButton
          defaultValue={currentCategory ? `${currentCategory.emoji} ${currentCategory.label}` : "Select category"}
          items={config.availableCategories.map(opt => ({ 
            id: opt.value, 
            label: opt.emoji ? `${opt.emoji} ${opt.label}` : opt.label 
          }))}
          label="Category"
          menuStyle="text"
          onSelect={(selectedId: string) => {
            console.log('Category selected:', selectedId);
            setCategory(selectedId);
          }}
          width="100%"
          menuMaxHeight="200px"
        />
      </div>

      {/* Amount and Date */}
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

      {/* Vault and Account fields - only show if configured */}
      {(config.showVaultField || config.showAccountField) && (
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
      {config.showLoanField && config.availableLoans && (
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

      {/* Activity Details - only show in edit mode */}
      {isEdit && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16,
            padding: '16px',
            backgroundColor: '#F8F9FA',
            borderRadius: '8px',
            border: '1px solid #E5E5E7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B70', marginBottom: 2 }}>Borrower</div>
                <button 
                  onClick={() => window.location.href = `/borrowers/${initialData.borrowerId}`}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007AFF', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  {initialData.borrowerName || 'My borrower'}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '16px' }}>🔗</span>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B70', marginBottom: 2 }}>Loan</div>
                <button 
                  onClick={() => window.location.href = `/loans/${initialData.loanId}`}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007AFF', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  {initialData.loanName || 'Loan name'}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '16px' }}>🏛️</span>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B70', marginBottom: 2 }}>Vault</div>
                <button 
                  onClick={() => window.location.href = `/vaults/${initialData.vaultId}`}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007AFF', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  {initialData.vaultName || 'Gateway'}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '16px' }}>🏢</span>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B70', marginBottom: 2 }}>Account</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#000000' }}>
                  {initialData.accountName || 'Savings'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        name={isEdit ? 'save' : 'add'} 
        form="" 
        ariaLabel={isEdit ? 'Save' : 'Add'} 
        onClick={handleSubmit} 
        style={{ width: '90px' }}
      >
        {isEdit ? 'Save' : 'Add'}
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
      right: 0,
      width: 400,
      minWidth: 400,
      height: 'calc(100vh - 120px)', // Subtract the header height
      backgroundColor: '#FFFFFF',
      borderLeft: '1px solid #eeeef2',
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
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