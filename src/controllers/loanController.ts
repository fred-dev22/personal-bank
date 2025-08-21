import { API_BASE_URL } from '../config/api';
import type { Loan } from '../types/types';
import { addCreateDates, addModifiedDate } from '../utils/dateUtils';

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

export const createLoan = async (
  token: string,
  bankId: string,
  loanData: {
    loan_request_azure_id: string;
    nickname: string;
    borrower_id: string;
    vault_id?: string;
    start_date: string;
    status: string;
    loan_type: string;
    initial_payment_amount: number;
    monthly_payment_amount?: number; // Ajouter le champ monthly_payment_amount
    initial_balance: number;
    initial_number_of_payments: number;
    initial_frequency: string;
    initial_annual_rate: number;
    initial_payment_day_of_month: number;
  }
): Promise<Loan> => {
  try {
    // Add created_date and modified_date to loan data
    const loanDataWithDates = addCreateDates(loanData);
    
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(loanDataWithDates)
    });

    if (!response.ok) {
      throw new Error('Failed to create loan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

export const updateLoan = async (
  token: string,
  noteId: string,
  data: Partial<Loan>
): Promise<Loan> => {
  try {
    // Add modified_date to update data
    const dataWithModifiedDate = addModifiedDate(data);
    
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataWithModifiedDate)
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

export const fetchLoanById = async (noteId: string, token: string): Promise<Loan> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch loan by id');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching loan by id:', error);
    throw error;
  }
};



export const recastLoan = async (
  token: string,
  loanId: string,
  recastData: Partial<Loan>
): Promise<Loan> => {
  try {
    console.log('🔄 Recasting loan:', { loanId, recastData });
    
    // Préparer les données pour l'endpoint recast (format exact attendu par l'API)
    const recastPayload = {
      date: new Date().toISOString(),
      loan_type: "amortized",
      payment_amount: recastData.monthly_payment_amount || 0,
      balance: recastData.current_balance || 0,
      number_of_payments: recastData.initial_number_of_payments || 0,
      frequency: "monthly",
      annual_rate: recastData.initial_annual_rate || 0,
      payment_day_of_month: 30
    };
    
    console.log('📡 Sending recast payload:', recastPayload);
    
    // Appeler l'endpoint recast
    const recastResponse = await fetch(`${API_BASE_URL}/notes/${loanId}/recasts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recastPayload)
    });
    
    console.log('📡 Recast API Response status:', recastResponse.status);
    
    if (!recastResponse.ok) {
      const errorText = await recastResponse.text();
      console.error('❌ Recast API Error:', errorText);
      throw new Error(`Failed to recast loan: ${recastResponse.status} ${recastResponse.statusText}`);
    }
    
    // Après le recast réussi, mettre à jour le loan avec les nouveaux termes
    const updatePayload = {
      initial_annual_rate: recastData.initial_annual_rate,
      initial_number_of_payments: recastData.initial_number_of_payments,
      monthly_payment_amount: recastData.monthly_payment_amount,
      recast_date: new Date().toISOString(),
      is_recast: true
    };
    
    console.log('📡 Updating loan with new terms:', updatePayload);
    
    const updateResponse = await fetch(`${API_BASE_URL}/notes/${loanId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(addModifiedDate(updatePayload))
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('❌ Update API Error:', errorText);
      throw new Error(`Failed to update loan after recast: ${updateResponse.status} ${updateResponse.statusText}`);
    }
    
    const result = await updateResponse.json();
    console.log('✅ Loan recast and updated successfully');
    return result;
  } catch (error) {
    console.error('❌ Error recasting loan:', error);
    throw error;
  }
};

export const deleteLoan = async (token: string, noteId: string): Promise<void> => {
  try {
    console.log('🔄 Deleting loan:', { noteId, url: `${API_BASE_URL}/notes/${noteId}` });
    
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Failed to delete loan: ${response.status} ${response.statusText}`);
    }
    
    console.log('✅ Loan deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting loan:', error);
    throw error;
  }
}; 