import type { User } from '../types/types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates if a user has access to the Personal Bank application
 * @param user - The user object to validate
 * @returns ValidationResult with validation status and error message if applicable
 */
export const validateUserAccess = (user: User): ValidationResult => {
  // Check if user has the "PB" app in their apps array
  if (!user.apps || !user.apps.includes('PB')) {
    return {
      isValid: false,
      errorMessage: 'Access denied. You do not have permission to access the Personal Bank application. Please contact your administrator.'
    };
  }

  // Check if user status is "Active"
  if (!user.status || user.status !== 'Active') {
    return {
      isValid: false,
      errorMessage: 'Access denied. Your account is not active. Please contact your administrator to activate your account.'
    };
  }

  return {
    isValid: true
  };
}; 