import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '@jbaluch/components';
import { API_BASE_URL } from '../config/api';
import './Login.css';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

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
        login(result);
        navigate('/personal-bank');
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
    <div className="login-container">
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