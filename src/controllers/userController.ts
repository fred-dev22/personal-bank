import { API_BASE_URL } from '../config/api';
import type { User, UserUpdateInput } from '../types/types';

export const updateUser = async (token: string, userId: string, userData: UserUpdateInput): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return await response.json();
};

export const getUserById = async (token: string, userId: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return await response.json();
}; 