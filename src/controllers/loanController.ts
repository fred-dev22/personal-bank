import { API_BASE_URL } from '../config/api';
import type { Loan } from '../types/types';

export const fetchLoans = async (token: string, bankId: string): Promise<Loan[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch loans');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

export const createLoan = async (
  token: string,
  bankId: string,
  loanData: {
    loan_request_azure_id: string;
    nickname: string;
    borrower_azure_id: string;
    borrower_id?: string;
    vault_id?: string;
    start_date: string;
    status: string;
    loan_type: string;
    initial_payment_amount: number;
    initial_balance: number;
    initial_number_of_payments: number;
    initial_frequency: string;
    initial_annual_rate: number;
    initial_payment_day_of_month: number;
  }
): Promise<Loan> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(loanData)
    });

    if (!response.ok) {
      throw new Error('Failed to create loan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

export const updateLoan = async (
  token: string,
  noteId: string,
  data: Partial<Loan>
): Promise<Loan> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update loan');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
};

export const fetchLoanById = async (noteId: string, token: string): Promise<Loan> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch loan by id');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching loan by id:', error);
    throw error;
  }
}; 