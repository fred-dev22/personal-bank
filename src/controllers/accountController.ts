// Account controller for CRUD operations
import { API_BASE_URL } from '../config/api';
import type { Account } from '../types/types';
import { addCreateDates, addModifiedDate } from '../utils/dateUtils';

export type AccountCreateInput = Omit<Account, 'id'>;
export type AccountUpdateInput = Partial<AccountCreateInput>;

export const createAccount = async (token: string, data: AccountCreateInput): Promise<Account> => {
  // Add created_date and modified_date to account data
  const dataWithDates = addCreateDates(data);
  
  const res = await fetch(`${API_BASE_URL}/accounts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataWithDates),
  });
  if (!res.ok) throw new Error('Failed to create account');
  return await res.json();
};

export const getAccounts = async (token: string): Promise<Account[]> => {
  const res = await fetch(`${API_BASE_URL}/accounts`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch accounts');
  return await res.json();
};

export const updateAccount = async (token: string, accountId: string, data: AccountUpdateInput): Promise<Account> => {
  // Add modified_date to update data
  const dataWithModifiedDate = addModifiedDate(data);
  
  const res = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataWithModifiedDate),
  });
  if (!res.ok) throw new Error('Failed to update account');
  return await res.json();
};

export const deleteAccount = async (token: string, accountId: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to delete account');
  return true;
}; 