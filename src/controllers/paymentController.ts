import { API_BASE_URL } from '../config/api';
import type { Payment } from '../types/types';

export interface PaymentCreateInput {
  amount: number;
  date: string;
  balloon?: boolean;
}

export const createPayment = async (
  token: string,
  noteAzureId: string,
  paymentData: PaymentCreateInput
): Promise<Payment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteAzureId}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const fetchPayments = async (
  token: string,
  noteAzureId: string
): Promise<Payment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteAzureId}/payments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};
