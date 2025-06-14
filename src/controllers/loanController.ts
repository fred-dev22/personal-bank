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

export const updateLoan = async (
  env: string,
  noteId: string,
  data: Partial<Loan>,
  token: string
): Promise<any> => {
  try {
    const response = await fetch(`https://iris-db-${env}.azurewebsites.net/api/notes/${noteId}`, {
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