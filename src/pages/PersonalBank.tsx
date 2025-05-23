import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../components/NavigationBar/NavigationBar';
import { Overview } from '../components/Overview/Overview';
import { Loans } from '../components/Loans/Loans';
import { Vaults } from '../components/Vaults/Vaults';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Loan } from '../types/types';
import { fetchLoans } from '../controllers/loanController';
import './PersonalBank.css';

export const PersonalBank: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getLoans = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || !user?.banks?.[0]) return;
        
        const bankId = user.banks[0];
        const data = await fetchLoans(token, bankId);
        setLoans(data);
        console.log('Loans récupérés via API:', data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    getLoans();
  }, [user?.banks]); // Only re-run if the user's banks array changes

  // Navigation items
  const mainNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'loans', label: 'Loans' },
    { id: 'vaults', label: 'Vaults' },
    { id: 'activity', label: 'Activity' },
    { id: 'financials', label: 'Financials' },
    { id: 'borrowers', label: 'Borrowers' },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings' },
    { id: 'apps', label: 'Apps' },
    { id: 'help', label: 'Help' },
  ];

  // Callback handlers
  const handleNavigation = (data: { itemId: string }) => {
    setCurrentPage(data.itemId);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleToggleCollapse = (data: { isCollapsed: boolean }) => {
    setSidebarCollapsed(data.isCollapsed);
  };

  return (
    <div className={`personal-bank-container ${sidebarCollapsed ? 'collapsed-margin' : 'with-margin'}`}>
      <NavigationBar
        mainNavItems={mainNavItems}
        bottomNavItems={bottomNavItems}
        activeItemId={currentPage}
        isCollapsed={sidebarCollapsed}
        onNavItemClick={handleNavigation}
        onSignOut={handleSignOut}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className="content-container">
        {currentPage === 'overview' && <Overview />}
        {currentPage === 'loans' && <Loans loans={loans} />}
        {currentPage === 'vaults' && <Vaults />}
      </div>
    </div>
  );
}; 