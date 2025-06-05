import { API_BASE_URL } from '../config/api';
import type { Borrower } from '../types/types';

export const fetchBorrowers = async (token: string, bankId: string): Promise<Borrower[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/borrowers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch borrowers');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching borrowers:', error);
    throw error;
  }
};

export const addBorrower = async (token: string, bankId: string, borrowerData: Partial<Borrower>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/borrowers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(borrowerData)
    });
    if (!response.ok) {
      throw new Error('Failed to add borrower');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding borrower:', error);
    throw error;
  }
}; 