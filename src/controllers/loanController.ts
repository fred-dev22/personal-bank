import type { Loan } from '../types/types';
import { API_BASE_URL } from '../config/api';

export async function fetchLoans(token: string): Promise<Loan[]> {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch loans');
  return await response.json();
} 