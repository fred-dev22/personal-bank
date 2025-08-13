import type { ActivityConfig } from './AddEditActivity';
import type { Vault, Loan } from '../../types/types';

// Base category configurations for different activity types
export const ACTIVITY_CATEGORIES = {
  // General categories
  general: [
    { value: 'income', label: 'Income', emoji: '💰' },
    { value: 'expense', label: 'Expense', emoji: '💸' },
    { value: 'transfer', label: 'Transfer', emoji: '🔄' },
    { value: 'investment', label: 'Investment', emoji: '📈' },
  ],
  
  // Loan-specific categories
  loan: [
    { value: 'loan_funding', label: 'Loan Funding', emoji: '🏦' },
    { value: 'loan_payment', label: 'Loan Payment', emoji: '💳' },
    { value: 'interest_payment', label: 'Interest Payment', emoji: '📊' },
    { value: 'principal_payment', label: 'Principal Payment', emoji: '📋' },
    { value: 'late_fee', label: 'Late Fee', emoji: '⚠️' },
    { value: 'transfer_fee', label: 'Transfer Fee', emoji: '💱' },
    { value: 'miscellaneous', label: 'Miscellaneous', emoji: '$' },
  ],
  
  // Vault-specific categories
  vault: [
    { value: 'vault_contribution', label: 'Vault Contribution', emoji: '🏛️' },
    { value: 'vault_withdrawal', label: 'Vault Withdrawal', emoji: '📤' },
    { value: 'vault_transfer', label: 'Vault Transfer', emoji: '🔄' },
    { value: 'vault_fee', label: 'Vault Fee', emoji: '💸' },
    { value: 'vault_income', label: 'Vault Income', emoji: '💰' },
    { value: 'miscellaneous', label: 'Miscellaneous', emoji: '$' },
  ],
  
  // Payment categories
  payment: [
    { value: 'payment_received', label: 'Payment Received', emoji: '✅' },
    { value: 'payment_sent', label: 'Payment Sent', emoji: '📤' },
    { value: 'payment_fee', label: 'Payment Fee', emoji: '💸' },
  ],
};

// Helper function to create vault configuration
export const createVaultActivityConfig = (
  vault: Vault,
  allVaults: Vault[],
  allLoans: Loan[],
  allAccounts: Array<{ value: string; label: string }>
): ActivityConfig => {
  return {
    context: 'vault',
    contextId: vault.id,
    contextName: vault.nickname || vault.name || 'Vault',
    availableCategories: [
      ...ACTIVITY_CATEGORIES.vault,
      ...ACTIVITY_CATEGORIES.general,
    ],
    availableVaults: allVaults.map(v => ({
      value: v.id,
      label: v.nickname || v.name || `Vault ${v.id}`
    })),
    availableAccounts: allAccounts,
    availableLoans: allLoans.map(l => ({
      value: l.id,
      label: l.nickname || `Loan ${l.id}`
    })),
    showVaultField: true,
    showAccountField: true,
    showLoanField: true,
    showApplyToLoan: true,
    defaultVault: vault.id,
  };
};

// Helper function to create loan configuration
export const createLoanActivityConfig = (
  loan: Loan,
  allVaults: Vault[],
  allLoans: Loan[],
  allAccounts: Array<{ value: string; label: string }>
): ActivityConfig => {
  return {
    context: 'loan',
    contextId: loan.id,
    contextName: loan.nickname || `Loan ${loan.id}`,
    availableCategories: [
      ...ACTIVITY_CATEGORIES.loan,
      ...ACTIVITY_CATEGORIES.payment,
      ...ACTIVITY_CATEGORIES.general,
    ],
    availableVaults: allVaults.map(v => ({
      value: v.id,
      label: v.nickname || v.name || `Vault ${v.id}`
    })),
    availableAccounts: allAccounts,
    availableLoans: allLoans.map(l => ({
      value: l.id,
      label: l.nickname || `Loan ${l.id}`
    })),
    showVaultField: true,
    showAccountField: true,
    showLoanField: true,
    showApplyToLoan: true,
    defaultLoan: loan.id,
  };
};

// Helper function to create general activity configuration
export const createGeneralActivityConfig = (
  allVaults: Vault[],
  allLoans: Loan[],
  allAccounts: Array<{ value: string; label: string }>
): ActivityConfig => {
  return {
    context: 'general',
    availableCategories: [
      ...ACTIVITY_CATEGORIES.general,
      ...ACTIVITY_CATEGORIES.payment,
    ],
    availableVaults: allVaults.map(v => ({
      value: v.id,
      label: v.nickname || v.name || `Vault ${v.id}`
    })),
    availableAccounts: allAccounts,
    availableLoans: allLoans.map(l => ({
      value: l.id,
      label: l.nickname || `Loan ${l.id}`
    })),
    showVaultField: true,
    showAccountField: true,
    showLoanField: false,
    showApplyToLoan: false,
  };
};

// Helper function to create simple vault-only configuration
export const createSimpleVaultConfig = (
  vault: Vault,
  allAccounts: Array<{ value: string; label: string }>
): ActivityConfig => {
  return {
    context: 'vault',
    contextId: vault.id,
    contextName: vault.nickname || vault.name || 'Vault',
    availableCategories: ACTIVITY_CATEGORIES.vault,
    availableAccounts: allAccounts,
    showVaultField: false, // Don't show vault field since we're in vault context
    showAccountField: false, // Don't show account field for vault activities (matching Bubble app)
    showLoanField: false,
    showApplyToLoan: false,
    defaultVault: vault.id,
    defaultCategory: 'miscellaneous',
  };
};

// Helper function to create simple loan-only configuration
export const createSimpleLoanConfig = (
  loan: Loan,
  allAccounts: Array<{ value: string; label: string }>
): ActivityConfig => {
  return {
    context: 'loan',
    contextId: loan.id,
    contextName: loan.nickname || `Loan ${loan.id}`,
    availableCategories: ACTIVITY_CATEGORIES.loan,
    availableAccounts: allAccounts,
    showVaultField: false,
    showAccountField: true,
    showLoanField: false, // Don't show loan field since we're in loan context
    showApplyToLoan: false,
    defaultLoan: loan.id,
    defaultCategory: 'miscellaneous',
  };
}; 