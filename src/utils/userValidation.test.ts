import { validateUserAccess } from './userValidation';
import type { User } from '../types/types';

// Test cases for user validation
const testCases = [
  {
    name: 'Valid user with PB app and Active status',
    user: {
      id: '6877d0c6d3b3512d9bf151b5',
      email: 'freddev237@dev.com',
      nopassword: false,
      fullName: 'fred dev',
      firstName: 'fred',
      lastName: 'dev',
      level: 4,
      status: 'Active',
      roles: ['Member'],
      apps: ['LA', 'PB'],
      accounts: [],
      banks: [],
      holdings: []
    } as User,
    expectedValid: true
  },
  {
    name: 'User without PB app',
    user: {
      id: '6877d0c6d3b3512d9bf151b5',
      email: 'freddev237@dev.com',
      nopassword: false,
      fullName: 'fred dev',
      firstName: 'fred',
      lastName: 'dev',
      level: 4,
      status: 'Active',
      roles: ['Member'],
      apps: ['LA'], // Missing PB
      accounts: [],
      banks: [],
      holdings: []
    } as User,
    expectedValid: false
  },
  {
    name: 'User with inactive status',
    user: {
      id: '6877d0c6d3b3512d9bf151b5',
      email: 'freddev237@dev.com',
      nopassword: false,
      fullName: 'fred dev',
      firstName: 'fred',
      lastName: 'dev',
      level: 4,
      status: 'Inactive', // Not Active
      roles: ['Member'],
      apps: ['LA', 'PB'],
      accounts: [],
      banks: [],
      holdings: []
    } as User,
    expectedValid: false
  },
  {
    name: 'User with no apps array',
    user: {
      id: '6877d0c6d3b3512d9bf151b5',
      email: 'freddev237@dev.com',
      nopassword: false,
      fullName: 'fred dev',
      firstName: 'fred',
      lastName: 'dev',
      level: 4,
      status: 'Active',
      roles: ['Member'],
      apps: [], // Empty apps array
      accounts: [],
      banks: [],
      holdings: []
    } as User,
    expectedValid: false
  }
];

// Simple test function to demonstrate validation
export const runValidationTests = () => {
  console.log('Running user validation tests...\n');
  
  testCases.forEach((testCase, index) => {
    const result = validateUserAccess(testCase.user);
    const passed = result.isValid === testCase.expectedValid;
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Expected: ${testCase.expectedValid ? 'Valid' : 'Invalid'}`);
    console.log(`Actual: ${result.isValid ? 'Valid' : 'Invalid'}`);
    if (!result.isValid) {
      console.log(`Error: ${result.errorMessage}`);
    }
    console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
  });
};

// Example usage:
// runValidationTests(); 