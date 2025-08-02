import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/Login';
import { PersonalBank } from './pages/PersonalBank';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ActivityProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/personal-bank" element={
              <ProtectedRoute>
                <PersonalBank />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </ActivityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
