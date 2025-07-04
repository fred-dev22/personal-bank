import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../components/NavigationBar/NavigationBar';
import { Overview } from '../components/Overview/Overview'; 
import { Loans } from '../components/Loans/Loans';
import { Vaults } from '../components/Vaults/Vaults';
import { Borrower } from '../components/Borrower/Borrower';
import { Activities } from '../components/Activities/Activities';
import { ActivityProvider, useActivity } from '../contexts/ActivityContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Loan, Vault, Borrower as BorrowerType, User, Activity } from '../types/types';
import { fetchLoans } from '../controllers/loanController';
import { fetchVaults } from '../controllers/vaultController';
import { fetchBorrowers } from '../controllers/borrowerController';
import { fetchAllUserActivities } from '../controllers/activityController';
import { Settings } from '../components/Settings/Settings';
import { Snackbar } from '@jbaluch/components';
import './PersonalBank.css';

const PersonalBankContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(null);
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [borrowers, setBorrowers] = useState<BorrowerType[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { showActivity, hideActivity, isVisible, message } = useActivity();
  const navigate = useNavigate();

  const getLoans = async (user: User | null, setLoans: React.Dispatch<React.SetStateAction<Loan[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.banks?.[0]) return;
      const bankId = user.banks[0];
      showActivity('Loading loans...');
      const data = await fetchLoans(token, bankId);
      setLoans(data);
      hideActivity();
      console.log('Loans fetched via API:', data);
    } catch (error) {
      hideActivity();
      console.error('Error fetching loans:', error);
    }
  };

  const getVaults = async (user: User | null, setVaults: React.Dispatch<React.SetStateAction<Vault[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.banks?.[0]) return;
      const bankId = user.banks[0];
      showActivity('Loading vaults...');
      const data = await fetchVaults(token, bankId);
      setVaults(data);
      hideActivity();
      console.log('Vaults fetched via API:', data);
    } catch (error) {
      hideActivity();
      console.error('Error fetching vaults:', error);
    }
  };

  const getBorrowers = async (user: User | null, setBorrowers: React.Dispatch<React.SetStateAction<BorrowerType[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.banks?.[0]) return;
      const bankId = user.banks[0];
      showActivity('Loading borrowers...');
      const data = await fetchBorrowers(token, bankId);
      setBorrowers(data);
      hideActivity();
      console.log('Borrowers fetched via API:', data);
    } catch (error) {
      hideActivity();
      console.error('Error fetching borrowers:', error);
    }
  };

  useEffect(() => {
    getLoans(user, setLoans);
    getVaults(user, setVaults);
    getBorrowers(user, setBorrowers);
  }, [user?.banks]);

  useEffect(() => {
    const fetchActivities = async () => {
      setActivitiesLoading(true);
      setActivitiesError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token');
        const data = await fetchAllUserActivities(loans, vaults, token);
        setActivities(data);
      } catch (e: unknown) {
        const err = e as Error;
        setActivitiesError(err.message || 'Erreur lors du chargement des activités');
      } finally {
        setActivitiesLoading(false);
      }
    };
    if (loans.length > 0 || vaults.length > 0) {
      fetchActivities();
    } else {
      setActivities([]);
    }
  }, [loans, vaults]);

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

  const handleShowLoanDetails = (loanId: string) => {
    setCurrentPage('loans');
    setSelectedLoanId(loanId);
  };

  return (
    <>
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
          {currentPage === 'loans' && (
            <Loans
              loans={loans}
              borrowers={borrowers}
              activities={activities}
              selectedLoanId={selectedLoanId}
              onShowBorrowerDetails={(borrowerId: string) => {
                setSelectedBorrowerId(borrowerId);
                setCurrentPage('borrowers');
              }}
              onShowVaultDetails={(vaultId: string) => {
                setSelectedVaultId(vaultId);
                setCurrentPage('vaults');
              }}
              onShowLoanDetails={handleShowLoanDetails}
            />
          )}
          {currentPage === 'vaults' && <Vaults vaults={vaults} loans={loans} borrowers={borrowers} activities={activities} selectedVaultId={selectedVaultId} onBackToList={() => setSelectedVaultId(null)} onSelectVault={setSelectedVaultId} onShowLoanDetails={handleShowLoanDetails} />}
          {currentPage === 'activity' && <Activities activities={activities} loading={activitiesLoading} error={activitiesError} />}
          {currentPage === 'borrowers' && <Borrower borrowers={borrowers} loans={loans} selectedBorrowerId={selectedBorrowerId} onBackToList={() => setSelectedBorrowerId(null)} onShowLoanDetails={handleShowLoanDetails} />}
          {currentPage === 'settings' && <Settings />}
        </div>
      </div>
      {isVisible && (
        <Snackbar
          icon={function Xs(){}}
          text={message}
          type="success"
          className="snackbar-fixed-bottom-right"
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, height: 45, width: 300 }}
        />
      )}
    </>
  );
};

export const PersonalBank: React.FC = () => {
  return (
    <ActivityProvider>
      <PersonalBankContent />
    </ActivityProvider>
  );
}; 