import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/types';
import { API_BASE_URL } from '../config/api';
import { validateUserAccess } from '../utils/userValidation';
import { AccessDeniedPopup } from '../components/AccessDeniedPopup/AccessDeniedPopup';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (result: { user: User; token: string }) => void;
  logout: () => void;
  current_pb_onboarding_state: string | null;
  setCurrentPbOnboardingState: (state: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState('');
  const [current_pb_onboarding_state, setCurrentPbOnboardingState] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: '{}'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const result = await response.json();
      
      // Validate user access before setting the user
      const validation = validateUserAccess(result);
      if (!validation.isValid) {
        setAccessDeniedMessage(validation.errorMessage || 'Access denied');
        setShowAccessDenied(true);
        localStorage.removeItem('authToken');
        setUser(null);
        setCurrentPbOnboardingState(null);
        return;
      }
      
      setUser(result);
      // Ajout onboarding state
      if (result.current_pb) {
        const token = localStorage.getItem('authToken');
        if (token) {
          import('../controllers/bankController').then(({ getBankById }) => {
            getBankById(token, result.current_pb).then(bank => {
              setCurrentPbOnboardingState(bank.onboarding_state || 'bank-name');
            }).catch(() => setCurrentPbOnboardingState('bank-name'));
          });
        } else {
          setCurrentPbOnboardingState('bank-name');
        }
      } else {
        setCurrentPbOnboardingState('bank-name');
      }
      setError(null); // Clear error if successful
    } catch (error) {
      setError('Failed to fetch user');
      console.error('Error fetching user:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setCurrentPbOnboardingState(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (result: { user: User; token: string }) => {
    // Validate user access before logging in
    const validation = validateUserAccess(result.user);
    if (!validation.isValid) {
      setAccessDeniedMessage(validation.errorMessage || 'Access denied');
      setShowAccessDenied(true);
      // Don't set user or token, just show the popup
      return;
    }
    
    // Only set user and token if validation passes
    setUser(result.user);
    localStorage.setItem('authToken', result.token);
    // Ajout onboarding state
    if (result.user.current_pb) {
      try {
        const { getBankById } = await import('../controllers/bankController');
        const bank = await getBankById(result.token, result.user.current_pb);
        setCurrentPbOnboardingState(bank.onboarding_state || 'bank-name');
      } catch {
        setCurrentPbOnboardingState('bank-name');
      }
    } else {
      setCurrentPbOnboardingState('bank-name');
    }
    // Navigate to personal bank page after successful login
    navigate('/personal-bank');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentPbOnboardingState(null);
  };

  const handleAccessDeniedClose = () => {
    setShowAccessDenied(false);
    setAccessDeniedMessage('');
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, current_pb_onboarding_state, setCurrentPbOnboardingState }}>
      {children}
      {showAccessDenied && (
        <AccessDeniedPopup
          message={accessDeniedMessage}
          onClose={handleAccessDeniedClose}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 