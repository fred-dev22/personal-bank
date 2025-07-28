import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '@jbaluch/components';
import { API_BASE_URL } from '../config/api';
import './Login.css';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      if (result.result === 2) {
        // Handle 2FA if needed
      } else if (result.result === 1) {
        setError('Invalid email or password. Please try again.');
      } else {
        console.log('Login - User data:', result);
        
        // Let the AuthContext handle validation and show popup if needed
        // The login function will validate and show popup automatically
        login(result);
        
        // Don't navigate immediately - let AuthContext handle it
        // If validation passes, the user will be set and ProtectedRoute will handle navigation
        // If validation fails, the popup will be shown
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleSignIn = async (data: { email: string; password: string }) => {
    await handleLogin(data.email, data.password);
  };

  return (
    <div className="login-container"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--surface-grey-background)',
    }}
    >
      <Login
        warningMessage={error}
        onSignIn={handleSignIn}
        onSendResetLink={() => {}}
        onResetPassword={() => {}}
        initialScreen="login"
        firstTimeSetPassword={false}
        onForgotPassword={() => {}}
        showSnackbar={() => {}}
        onSignUp={() => {}}
        onGoogleSignIn={() => {}}
        onMicrosoftSignIn={() => {}}
        snackbarMessage=""
        snackbarType="info"
        onSnackbarHide={() => {}}
      />
    </div>
  );
};

export default LoginPage; 