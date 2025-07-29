import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateUserAccess } from '../utils/userValidation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Additional validation to ensure user has proper access
  const validation = validateUserAccess(user);
  if (!validation.isValid) {
    // If user doesn't have proper access, redirect to login
    // The AuthContext will handle showing the popup
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 