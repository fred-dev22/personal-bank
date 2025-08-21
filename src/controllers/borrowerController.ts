import { API_BASE_URL } from '../config/api';
import type { Borrower } from '../types/types';
import { addCreateDates, addModifiedDate } from '../utils/dateUtils';

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
    // Add created_date and modified_date to borrower data
    const borrowerDataWithDates = addCreateDates(borrowerData);
    
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/borrowers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(borrowerDataWithDates)
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

export const updateBorrower = async (token: string, bankId: string, borrowerId: string, borrowerData: Partial<Borrower>): Promise<Borrower> => {
  try {
    // Add modified_date to borrower data
    const borrowerDataWithDates = addModifiedDate(borrowerData);
    
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/borrowers/${borrowerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(borrowerDataWithDates)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update borrower:', response.status, errorText);
      throw new Error(`Failed to update borrower: ${response.status} ${errorText}`);
    }
    
    const updatedBorrower = await response.json();
    console.log('Borrower updated successfully:', updatedBorrower);
    return updatedBorrower;
  } catch (error) {
    console.error('Error updating borrower:', error);
    throw error;
  }
}; 