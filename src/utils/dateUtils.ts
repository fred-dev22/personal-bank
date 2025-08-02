/**
 * Utility functions for handling dates in API calls
 */

/**
 * Get current date and time in ISO format
 * @returns Current date in ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

/**
 * Add created_date and modified_date to data for creation
 * @param data - Object to add dates to
 * @returns Object with created_date and modified_date set to current time
 */
export const addCreateDates = <T extends Record<string, any>>(data: T): T & { created_date: string; modified_date: string } => {
  const currentDate = getCurrentDateTime();
  return {
    ...data,
    created_date: currentDate,
    modified_date: currentDate
  };
};

/**
 * Add modified_date to data for updates
 * @param data - Object to add modified date to
 * @returns Object with modified_date set to current time
 */
export const addModifiedDate = <T extends Record<string, any>>(data: T): T & { modified_date: string } => {
  return {
    ...data,
    modified_date: getCurrentDateTime()
  };
};