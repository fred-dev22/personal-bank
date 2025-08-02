import { API_BASE_URL } from '../config/api';
import type { Holding, HoldingCreateInput, HoldingUpdateInput } from '../types/types';
import { addCreateDates, addModifiedDate } from '../utils/dateUtils';

export const createHolding = async (token: string, data: HoldingCreateInput): Promise<Holding> => {
  // Add created_date and modified_date to holding data
  const dataWithDates = addCreateDates(data);
  
  const res = await fetch(`${API_BASE_URL}/holdings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataWithDates),
  });
  if (!res.ok) throw new Error('Failed to create holding');
  return await res.json();
};

export const updateHolding = async (token: string, holdingId: string, data: HoldingUpdateInput): Promise<Holding> => {
  // Add modified_date to update data
  const dataWithModifiedDate = addModifiedDate(data);
  
  const res = await fetch(`${API_BASE_URL}/holdings/${holdingId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataWithModifiedDate),
  });
  if (!res.ok) throw new Error('Failed to update holding');
  return await res.json();
}; 