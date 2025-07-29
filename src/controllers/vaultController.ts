import { API_BASE_URL } from '../config/api';
import type { Vault } from '../types/types';

export interface VaultCreateInput extends Partial<Vault> {
  // Ajoute ici les champs obligatoires à la création si besoin
}

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

export const createVault = async (token: string, bankId: string, data: VaultCreateInput): Promise<Vault> => {
  const response = await fetch(`${API_BASE_URL}/banks/${bankId}/vaults`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create vault');
  }
  return await response.json();
}; 