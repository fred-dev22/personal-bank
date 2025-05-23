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