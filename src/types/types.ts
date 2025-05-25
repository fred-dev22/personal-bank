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

export interface Account {
    id: string;
    name: string;
    balance: number;
    currency: string;
    type: 'checking' | 'savings' | 'investment' | 'vault';
    isActive: boolean;
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
} 