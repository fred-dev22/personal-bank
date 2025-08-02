import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/types';
import { validateUserAccess } from '../utils/userValidation';
import { AccessDeniedPopup } from '../components/AccessDeniedPopup/AccessDeniedPopup';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (result: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  current_pb_onboarding_state: string | null;
  setCurrentPbOnboardingState: (state: string | null) => void;
  updateOnboardingState: (state: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState('');
  const [current_pb_onboarding_state, setCurrentPbOnboardingState] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fonction pour mettre à jour l'utilisateur ET le localStorage
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Fonction pour mettre à jour l'état d'onboarding ET le localStorage
  const updateOnboardingState = (state: string | null) => {
    setCurrentPbOnboardingState(state);
    if (state) {
      localStorage.setItem('onboarding_state', state);
    } else {
      localStorage.removeItem('onboarding_state');
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('user');
    const savedOnboardingState = localStorage.getItem('onboarding_state');
    console.log('🔍 Debug - Token:', token ? 'Found' : 'Not found');
    console.log('🔍 Debug - User data:', userJson ? 'Found' : 'Not found');
    console.log('🔍 Debug - Onboarding state:', savedOnboardingState ? savedOnboardingState : 'Not found');
    
    if (token && userJson) {
      try {
        const userData = JSON.parse(userJson);
        console.log('🔍 Debug - Parsed user data:', userData);
        
        // Validate user access
        const validation = validateUserAccess(userData);
        console.log('🔍 Debug - Validation result:', validation);
        
        if (validation.isValid) {
          console.log('🔍 Debug - Validation passed, setting user');
          setUser(userData);
          
          // Setup onboarding state - use saved state first, then fetch from API if needed
          if (savedOnboardingState) {
            console.log('🔍 Debug - Using saved onboarding state:', savedOnboardingState);
            setCurrentPbOnboardingState(savedOnboardingState);
          } else if (userData.current_pb) {
            console.log('🔍 Debug - Fetching onboarding state from API');
            import('../controllers/bankController').then(({ getBankById }) => {
              getBankById(token, userData.current_pb).then(bank => {
                const onboardingState = bank.onboarding_state || 'bank-name';
                setCurrentPbOnboardingState(onboardingState);
                localStorage.setItem('onboarding_state', onboardingState);
              }).catch(() => {
                setCurrentPbOnboardingState('bank-name');
                localStorage.setItem('onboarding_state', 'bank-name');
              });
            });
          } else {
            setCurrentPbOnboardingState('bank-name');
            localStorage.setItem('onboarding_state', 'bank-name');
          }
        } else {
          console.log('🔍 Debug - Validation failed, clearing storage');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('onboarding_state');
          setUser(null);
          setCurrentPbOnboardingState(null);
        }
      } catch (error) {
        console.error('🔍 Debug - Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('onboarding_state');
        setUser(null);
        setCurrentPbOnboardingState(null);
      }
    } else {
      console.log('🔍 Debug - Missing token or user data');
    }
    
    setLoading(false);
  }, []);



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
    updateUser(result.user);
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
    localStorage.removeItem('user');
    localStorage.removeItem('onboarding_state');
    setUser(null);
    setCurrentPbOnboardingState(null);
  };

  const handleAccessDeniedClose = () => {
    setShowAccessDenied(false);
    setAccessDeniedMessage('');
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, updateUser, current_pb_onboarding_state, setCurrentPbOnboardingState, updateOnboardingState }}>
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