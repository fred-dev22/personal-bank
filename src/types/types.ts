// Types pour les transactions
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: Date;
    accountId: string;
}

// Types pour Account
export type AccountType =
  | 'Checking'
  | 'Savings'
  | 'Money Market Account'
  | 'Certificates of Deposit'
  | 'Credit Card'
  | 'Charge Card'
  | 'Brokerage/Trading Account'
  | 'Prosper'
  | 'Income Fund'
  | 'Flipper'
  | 'Shadow Loan'
  | 'Expense-to-Wealth'
  | 'Spend-to-Wealth'
  | 'Private Stock'
  | 'Private Company'
  | 'Fund Carry (Private Investing)'
  | 'Education Account (529 savings plan)'
  | 'Bonds'
  | 'Generic Investment'
  | 'Line of Credit'
  | 'Personal Loan - Secured'
  | 'Personal Loan - Unsecured'
  | 'Fixed Rate Loan'
  | 'Adjustable-Rate Loan'
  | 'Car Loan'
  | 'Other Vehicle Type Loan'
  | 'Student Loan'
  | 'Government Loan'
  | 'Mortgage'
  | 'Reverse Mortgage'
  | 'Home Equity Line of Credit'
  | 'Home Construction'
  | 'Rental Property'
  | 'Property'
  | 'Vehicles'
  | 'Jewelry'
  | 'Paintings'
  | 'Furniture'
  | 'Electronics'
  | 'Other'
  | '401k'
  | '403b'
  | '457b'
  | 'IRA'
  | 'Roth IRA'
  | 'Roth 401k'
  | 'Simple IRA'
  | 'SEP IRA'
  | 'HSA'
  | 'Pension'
  | 'Annuity'
  | 'Credit Card'
  | 'Debt to Wealth'
  | 'Personal Loan'
  | 'Home Equity Loan'
  | 'Life Insurance'
  | 'Home Insurance'
  | 'Car Insurance'
  | 'Health Insurance'
  | 'Digital Wallet'
  | 'Personally Guaranteed Business Loans'
  | 'Rent Expense'
  | 'Cash'
  | 'Policy Loan'
  | 'Indexed Universal Life'
  | 'Whole Life'
  | 'Premium Finance IUL'
  | 'Note'
  | 'Income Amplifier';

export type AccountCategory =
  | 'Banking'
  | 'Credit Card'
  | 'Loan'
  | 'Investment'
  | 'Property'
  | 'Retirement'
  | 'Expense'
  | 'Other Assets'
  | 'Insurance';

export type AnnualFeesType = 'Percentage' | 'Amount';
export type CreditLimitType = 'Percentage' | 'Amount';
export type FinancialClass = 'Assets' | 'Liabilities';
export type InterestRateType = 'fixed' | 'variable';
export type LoanType = 'Revolving' | 'Amortized: Due-Date' | 'Interest-only';
export type PaymentFrequency = 'every month' | 'every quarter' | 'every year';
export type AccountState = 'Created' | 'Used';

export interface Account {
  id: string;
  nickname: string;
  type: AccountType;
  category?: AccountCategory;
  financial_class?: FinancialClass;
  debt_category?: string;
  loan_type?: LoanType;
  balance?: number;
  annual_interest_rate?: number;
  appreciation?: number;
  is_active?: boolean;
  remaining_terms_in_months?: number;
  annual_fees?: number;
  annual_fees_type?: AnnualFeesType;
  monthly_payment?: number;
  minimum_payment?: number;
  minimum_balance?: number;
  purchase_price?: number;
  initial_balance?: number;
  tag?: string;
  pb?: string;
  credit_limit?: number;
  credit_limit_type?: CreditLimitType;
  annual_guideline_amount?: number;
  annual_non_mec_limit?: number;
  policy_start_date?: string;
  interest_rate_type?: InterestRateType;
  denomination?: string;
  state?: AccountState;
  // Ajoute d'autres champs si besoin
}

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
    icon?: string;
}

export interface User {
    id: string;
    email: string;
    nopassword: boolean;
    fullName: string;
    firstName: string;
    lastName: string;
    level: number;
    status: string;
    roles: string[];
    apps: string[];
    accounts: string[];
    banks: string[];
    holdings: string[];
    current_pb?: string;
}

export interface Budget {
    id: string;
    categoryId: string;
    amount: number;
    period: 'monthly' | 'yearly';
    startDate: Date;
    endDate?: Date;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: Date;
    category: string;
}

export interface Notification {
    id: string;
    type: 'alert' | 'info' | 'success' | 'warning';
    message: string;
    date: Date;
    isRead: boolean;
}

export interface Report {
    id: string;
    type: 'monthly' | 'yearly' | 'custom';
    startDate: Date;
    endDate: Date;
    data: {
        income: number;
        expenses: number;
        savings: number;
        categories: {
            [key: string]: number;
        };
    };
}

export interface Borrower {
    id: string;
    fullName: string;
    pb: string;
    userId: string;
    bankId: string;
    notes?: string[];
    totalPayment?: number;
    unpaidBalance?: number;
    firstName?: string;
    lastName?: string;
    grossIncome?: string;
    netIncome?: string;
    email?: string;
    phone?: string;
    type?: 'person' | 'institution';
    website?: string;
}

export interface Loan {
    note_id: string;
    vault_id: string;
    account_azure_id: string;
    nickname: string;
    borrower_id: string;
    start_date: string;
    status: string;
    loan_type: string;
    initial_balance: number;
    initial_number_of_payments: number;
    initial_frequency: string;
    initial_annual_rate: number;
    initial_payment_amount: number;
    comments: string;
    dscr_limit: number;
    userId: string;
    bankId: string;
    current_balance: number;
    loan_number: number;
    accountId: string;
    vaultId: string;
    borrowerId: string;
    funded_date: string;
    transactionId: string;
    payments: string[];
    activities: string[];
    id: string;
    sub_state?: string;
    actual_payments_scheduled?: any[];
    is_funded?: boolean;
}

export interface Activity {
    id: string;
    name: string;
    type: string;
    date: Date;
    amount: number;
    tag?: string;
}

export interface Vault {
    id: string;
    name: string;
    issues: number;
    balance: number;
    financials: {
        paidIn: number;
        paidOut: number;
    };
    health: {
        reserves: number;
        loanToValue: number;
        incomeDSCR: number;
        growthDSCR: number;
    };
    nickname?: string;
    hold?: number;
    hold_type?: 'amount' | 'percentage';
    reserve?: number;
    reserve_type?: 'amount' | 'percentage';
    comments?: string;
    liquidity_source_id?: string;
    is_gateway?: boolean;
    userId?: string;
    bankId?: string;
    accountId?: string;
    initial_balance?: number;
    notes?: string[];
    activities?: string[];
    holding_id?: string;
    holdingId?: string;
    asset_account_id?: string;
    debt_account_id?: string;
    growth_issue_count?: number;
    income_issue_count?: number;
    is_ltv_issue_count?: 'yes' | 'no';
    arbitrary_text?: string;
    type?: string;
    payment_projection?: {
        summary?: {
            equityIncreasing?: 'yes' | 'no';
        }
    };
    available_for_lending_amount?: number | string;
    spread?: number | string;
    liquidity_source?: {
        appreciation?: number;
    };
    // Champs dynamiques pour le wizard
    assetType?: string;
    assetName?: string;
    assetStartDate?: string;
    annualNonMecLimit?: string;
    annualGuidelineAmount?: string;
    annualGrowthRate?: string;
    premiumPaidThisYear?: string;
    debtBalance?: string;
    debtCeilingRate?: string;
    debtLtv?: string;
    amount?: string | number;
    interestRate?: string;
    accountType?: string;
}

export interface BankCreateInput {
  name: string;
  user_id: string;
  // Add other fields required for bank creation if needed
}

export type UserUpdateInput = Partial<User>;

export interface Holding {
  id: string;
  nickname: string;
  accounts: string[]; // tableau d'ids d'accounts
  // Ajoute d'autres champs si besoin
}

export type HoldingCreateInput = Omit<Holding, 'id'>;
export type HoldingUpdateInput = Partial<HoldingCreateInput>;

export type OnboardingStep = 'bank-name' | 'setup-gateway' | 'add-vault' | 'add-loan' | 'done'; 

export interface Bank {
  id: string;
  name: string;
  user_id: string;
  userId: string;
  onboarding_state: OnboardingStep;
  vaults_initial_balance: number;
  vaults_unpaid_balance: number;
  vaults_total_liquidity: number;
  vaults_total_available_to_lend: number;
  vaults_monthly_cash_flow: number;
  vaults_annual_cash_flow: number;
  vaults_utilization: number | null;
  vaults: string[];
  loans_initial_balance: number;
  loans_unpaid_balance: number;
  loans_total_reserves: number;
  loans_total_hold: number;
  loans_monthly_cash_flow: number;
  loans_annual_cash_flow: number;
  loans_active_notes: number;
  loans_average_size: number;
  loans_monthly_loan_constant: number;
  notes: string[];
  borrowers_initial_balance: number;
  borrowers_unpaid_balance: number;
  borrowers_monthly_payment: number;
  borrowers: string[];
  score: number;
  total_interest: number;
  total_principal: number;
} 