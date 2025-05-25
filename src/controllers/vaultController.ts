import { API_BASE_URL } from '../config/api';
import type { Vault } from '../types/types';

export const fetchVaults = async (token: string, bankId: string): Promise<Vault[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/vaults`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vaults');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vaults:', error);
    throw error;
  }
}; 