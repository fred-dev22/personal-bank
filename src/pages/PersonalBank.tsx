import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../components/NavigationBar/NavigationBar';
import { Overview } from '../components/Overview/Overview';
import { Loans } from '../components/Loans/Loans';
import { Vaults } from '../components/Vaults/Vaults';
import { Borrower } from '../components/Borrower/Borrower';
import { Activities } from '../components/Activities/Activities';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Loan, Vault, Borrower as BorrowerType, User } from '../types/types';
import { fetchLoans } from '../controllers/loanController';
import { fetchVaults } from '../controllers/vaultController';
import { fetchBorrowers } from '../controllers/borrowerController';
import './PersonalBank.css';

export const PersonalBank: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [borrowers, setBorrowers] = useState<BorrowerType[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getLoans = async (user: User | null, setLoans: React.Dispatch<React.SetStateAction<Loan[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.banks?.[0]) return;
      const bankId = user.banks[0];
      const data = await fetchLoans(token, bankId);
      setLoans(data);
      console.log('Loans fetched via API:', data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const getVaults = async (user: User | null, setVaults: React.Dispatch<React.SetStateAction<Vault[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.banks?.[0]) return;
      const bankId = user.banks[0];
      const data = await fetchVaults(token, bankId);
      setVaults(data);
      console.log('Vaults fetched via API:', data);
    } catch (error) {
      console.error('Error fetching vaults:', error);
    }
  };

  const getBorrowers = async (user: User | null, setBorrowers: React.Dispatch<React.SetStateAction<BorrowerType[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.banks?.[0]) return;
      const bankId = user.banks[0];
      const data = await fetchBorrowers(token, bankId);
      setBorrowers(data);
      console.log('Borrowers fetched via API:', data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
    }
  };

  useEffect(() => {
    getLoans(user, setLoans);
    getVaults(user, setVaults);
    getBorrowers(user, setBorrowers);
  }, [user?.banks]);

  // Navigation items
  const mainNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'loans', label: 'Loans' },
    { id: 'vaults', label: 'Vaults' },
    { id: 'activity', label: 'Activity' },
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
        {currentPage === 'vaults' && <Vaults vaults={vaults} />}
        {currentPage === 'activity' && <Activities />}
        {currentPage === 'borrowers' && <Borrower borrowers={borrowers} />}
      </div>
    </div>
  );
}; 