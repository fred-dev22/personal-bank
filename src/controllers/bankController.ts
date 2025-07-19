import { API_BASE_URL } from '../config/api';
import type { Bank, BankCreateInput } from '../types/types';

export const createBank = async (token: string, bankData: BankCreateInput): Promise<Bank> => {
  const response = await fetch(`${API_BASE_URL}/banks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bankData)
  });
  if (!response.ok) {
    throw new Error('Failed to create bank');
  }
  return await response.json();
};

export const getBankById = async (token: string, bankId: string): Promise<Bank> => {
  const response = await fetch(`${API_BASE_URL}/banks/${bankId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bank');
  }
  return await response.json();
};

export const updateBankField = async (token: string, bankId: string, data: Partial<Bank>): Promise<Bank> => {
  const response = await fetch(`${API_BASE_URL}/banks/${bankId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update bank');
  }
  return await response.json();
}; 