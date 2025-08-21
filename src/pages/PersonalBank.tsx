import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../components/NavigationBar/NavigationBar';
import { Overview } from '../components/Overview/Overview'; 
import { Loans } from '../components/Loans/Loans';
import { Vaults } from '../components/Vaults/Vaults';
import { Borrower } from '../components/Borrower/Borrower';
import { Activities } from '../components/Activities/Activities';
import { useActivity } from '../contexts/ActivityContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Loan, Vault, Borrower as BorrowerType, User, Activity } from '../types/types';
import { fetchLoans, fetchLoanById } from '../controllers/loanController';
import { fetchVaults } from '../controllers/vaultController';
import { fetchBorrowers } from '../controllers/borrowerController';
import { fetchAllUserActivities } from '../controllers/activityController';
import { Settings } from '../components/Settings/Settings';
import { VaultWizard } from '../components/wizards/vault-wizard';
import { LoanWizard } from '../components/wizards/loan-wizard';
import { RecastLoanWizard } from '../components/wizards/recast-loan-wizard/RecastLoanWizard';
import { Snackbar } from '@jbaluch/components';
import borrowerIcon from '../assets/borrower.svg';
import loanIcon from '../assets/loan.svg';
import vaultIcon from '../assets/vault.svg';
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
  const { user, logout, current_pb_onboarding_state } = useAuth();
  const { showActivity, hideActivity, isVisible, message } = useActivity();
  const navigate = useNavigate();
  const [showVaultWizard, setShowVaultWizard] = useState(false);
  const [showGatewayWizard, setShowGatewayWizard] = useState(false);
  const [showLoanWizard, setShowLoanWizard] = useState(false);
  const [showRecastWizard, setShowRecastWizard] = useState(false);
  const [vaultToEdit, setVaultToEdit] = useState<Vault | undefined>(undefined);
  const [loanToRecast, setLoanToRecast] = useState<Loan | undefined>(undefined);

  // Fonction pour déterminer l'icône selon le type d'activité
  const getActivityIcon = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('loading bank data')) {
      return () => <img src="/src/assets/logo.png" alt="Bank" style={{ width: 16, height: 16 }} />;
    }
    
    if (lowerMessage.includes('loan') || lowerMessage.includes('prêt') || lowerMessage.includes('creating loan') || lowerMessage.includes('loading loan')) {
      return () => <img src={loanIcon} alt="Loan" style={{ width: 16, height: 16 }} />;
    }
    
    if (lowerMessage.includes('vault') || lowerMessage.includes('coffre') || lowerMessage.includes('creating vault') || lowerMessage.includes('loading vault')) {
      return () => <img src={vaultIcon} alt="Vault" style={{ width: 16, height: 16 }} />;
    }
    
    if (lowerMessage.includes('borrower') || lowerMessage.includes('emprunteur') || lowerMessage.includes('creating borrower') || lowerMessage.includes('loading borrower')) {
      return () => <img src={borrowerIcon} alt="Borrower" style={{ width: 16, height: 16 }} />;
    }
    
    // Icône par défaut (peut être une icône générale ou vide)
    return function DefaultIcon() {};
  };

  const getLoans = async (user: User | null, setLoans: React.Dispatch<React.SetStateAction<Loan[]>>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user?.current_pb) return;
      const bankId = user.current_pb;
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
      if (!token || !user?.current_pb) return;
      const bankId = user.current_pb;
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
      if (!token || !user?.current_pb) return;
      const bankId = user.current_pb;
      const data = await fetchBorrowers(token, bankId);
      setBorrowers(data);
      console.log('Borrowers fetched via API:', data);
      return data; // Retourner les données pour confirmer que l'opération est terminée
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      throw error; // Propager l'erreur
    }
  };

  // Fonction pour recharger les borrowers (exposée pour d'autres composants)
  const refreshBorrowers = async () => {
    if (user?.current_pb) {
      await getBorrowers(user, setBorrowers);
    }
  };

  useEffect(() => {
    if (user?.current_pb) {
      showActivity('Loading bank data');
      Promise.all([
        getLoans(user, setLoans),
        getVaults(user, setVaults),
        getBorrowers(user, setBorrowers)
      ]).finally(() => {
        hideActivity();
      });
    }
  }, [user?.current_pb]);

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

  // Adapter le menu principal selon l'état d'onboarding
  const mainNavItems = current_pb_onboarding_state !== 'done'
    ? [{ id: 'overview', label: 'Overview' }]
    : [
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
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowVaultDetails = (vaultId: string) => {
    setCurrentPage('vaults');
    setSelectedVaultId(vaultId);
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddVault = () => setShowVaultWizard(true);

  const handleEditVault = (vault: Vault) => {
    setVaultToEdit(vault);
    setShowVaultWizard(true);
  };

  const handleShowRecastWizard = (loan: Loan) => {
    setLoanToRecast(loan);
    setShowRecastWizard(true);
  };

  const handleShowGatewayWizard = () => setShowGatewayWizard(true);

  const handleGatewayCreated = (vault: Vault) => {
    setVaults(prev => [...prev, vault]);
  };

  const handleVaultCreated = (vault: Vault) => {
    setVaults(prev => [...prev, vault]);
    // L'onboarding_state sera mis à jour automatiquement par OnboardingCard
    
    // Si on n'est pas en onboarding, rediriger vers les détails du vault
    if (current_pb_onboarding_state === 'done' || !current_pb_onboarding_state) {
      setShowVaultWizard(false);
      setTimeout(() => {
        setSelectedVaultId(vault.id);
        setCurrentPage('vaults');
        // Scroll vers le haut de la page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleVaultUpdated = (updatedVault: Vault) => {
    setVaults(prev => 
      prev.map(vault => 
        vault.id === updatedVault.id ? { ...vault, ...updatedVault } : vault
      )
    );
  };

  const handleLoanCreated = (loan: Loan) => {
    // Le loan est déjà ajouté à la liste par setLoans dans le wizard
    
    // Fermer le wizard
    setShowLoanWizard(false);
    
    // Si on n'est pas en onboarding, rediriger vers les détails du prêt créé
    if (current_pb_onboarding_state === 'done' || !current_pb_onboarding_state) {
      setTimeout(() => {
        setSelectedLoanId(loan.id);
        setCurrentPage('loans');
        // Scroll vers le haut de la page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  if (showVaultWizard) {
    return (
      <VaultWizard 
        vaultToEdit={vaultToEdit}
        onClose={() => {
          setShowVaultWizard(false);
          setVaultToEdit(undefined);
        }} 
        onVaultCreated={(vault) => {
          if (vaultToEdit) {
            // Mode edit : mettre à jour le vault existant
            handleVaultUpdated(vault);
          } else {
            // Mode création : ajouter le nouveau vault
            handleVaultCreated(vault);
          }
        }} 
      />
    );
  }
  if (showGatewayWizard) {
    return (
      <VaultWizard
        onClose={() => setShowGatewayWizard(false)}
        gatewayMode
        onVaultCreated={handleGatewayCreated}
      />
    );
  }
  if (showLoanWizard) {
    return (
      <LoanWizard 
        onClose={() => setShowLoanWizard(false)} 
        onLoanCreated={handleLoanCreated}
        borrowers={borrowers}
        onBorrowersUpdate={setBorrowers}
        onBorrowersRefresh={refreshBorrowers}
        loans={loans}
        setLoans={setLoans}
        vaults={vaults}
        onVaultsUpdate={() => getVaults(user, setVaults)}
      />
    );
  }
  if (showRecastWizard && loanToRecast) {
    return (
      <RecastLoanWizard
        loanToRecast={loanToRecast}
        borrowers={borrowers}
        vaults={vaults}
        onClose={() => {
          setShowRecastWizard(false);
          // Afficher le Snackbar quand on ferme le wizard
          showActivity('Recast cancelled');
        }}
        onRecastSuccess={async () => {
          // Sauvegarder l'ID du loan avant de le mettre à undefined
          const recastedLoanId = loanToRecast?.id;
          
          setLoanToRecast(undefined);
          setShowRecastWizard(false);
          
          // S'assurer qu'on reste sur la page des détails du loan
          if (recastedLoanId) {
            setSelectedLoanId(recastedLoanId);
          }
          
          // Garder le Snackbar "Recast in progress..." visible pendant la récupération
          showActivity('Recast in progress...');
          
          // Faire un get du loan pour avoir les nouvelles données complètes
          if (recastedLoanId) {
            try {
              const token = localStorage.getItem('authToken');
              if (token) {
                console.log('🔄 Fetching fresh loan data for ID:', recastedLoanId);
                const freshLoan = await fetchLoanById(recastedLoanId, token);
                console.log('✅ Fresh loan data after recast:', freshLoan);
                
                // Mettre à jour les données en local avec les données fraîches
                setLoans(prevLoans => 
                  prevLoans.map(loan => 
                    loan.id === recastedLoanId ? freshLoan : loan
                  )
                );
                
                // Afficher le succès
                showActivity('Loan recast successfully!');
                
                // Rester sur la page des détails du loan (pas de redirection)
                // Le visuel se met à jour automatiquement grâce à setLoans
              }
            } catch (error) {
              console.error('❌ Error fetching fresh loan data:', error);
              
              // En cas d'erreur, essayer de récupérer tous les loans
              try {
                console.log('🔄 Fallback: Fetching all loans...');
                const token = localStorage.getItem('authToken');
                if (token) {
                  const bankId = localStorage.getItem('bankId');
                  if (bankId) {
                    const allLoans = await fetchLoans(token, bankId);
                    console.log('✅ All loans fetched:', allLoans);
                    setLoans(allLoans);
                    
                    // Afficher le succès même avec le fallback
                    showActivity('Loan recast successfully!');
                    
                    // Rester sur la page des détails du loan (pas de redirection)
                    // Le visuel se met à jour automatiquement grâce à setLoans
                  }
                }
              } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                showActivity('Loan recast completed, but failed to refresh data. Please reload the page.');
                
                // Rester sur la page des détails du loan même en cas d'erreur
                // Le visuel se met à jour automatiquement grâce à setLoans
              }
            }
          }
        }}
      />
    );
  }
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
      <div className="contentContainer">
        {currentPage === 'overview' && <Overview vaults={vaults} onAddVault={handleAddVault} onShowGatewayWizard={handleShowGatewayWizard} onAddLoan={() => setShowLoanWizard(true)} onVaultDetails={handleShowVaultDetails} />}
        {currentPage === 'loans' && (
          <Loans
            loans={loans}
            borrowers={borrowers}
            activities={activities}
            selectedLoanId={selectedLoanId}

            onShowBorrowerDetails={(borrowerId: string) => {
              setSelectedBorrowerId(borrowerId);
              setCurrentPage('borrowers');
              // Scroll vers le haut de la page
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowVaultDetails={(vaultId: string) => {
              setSelectedVaultId(vaultId);
              setCurrentPage('vaults');
              // Scroll vers le haut de la page
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowLoanDetails={handleShowLoanDetails}
            onAddLoan={() => setShowLoanWizard(true)}
            onRecastLoan={handleShowRecastWizard}
          />
        )}
        {currentPage === 'vaults' && <Vaults vaults={vaults} loans={loans} borrowers={borrowers} activities={activities} selectedVaultId={selectedVaultId} onBackToList={() => setSelectedVaultId(null)} onSelectVault={(vaultId) => {
          setSelectedVaultId(vaultId);
          // Scroll vers le haut de la page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} onShowLoanDetails={handleShowLoanDetails} onAddVault={handleAddVault} onAddLoan={() => setShowLoanWizard(true)} onVaultUpdate={handleVaultUpdated} onEditVault={handleEditVault} />}
        {currentPage === 'activity' && <Activities activities={activities} loading={activitiesLoading} error={activitiesError} 
          onShowBorrowerDetails={(borrowerId?: string) => {
            if (borrowerId) setSelectedBorrowerId(borrowerId);
            setCurrentPage('borrowers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowLoanDetails={(loanId?: string) => {
            if (loanId) setSelectedLoanId(loanId);
            setCurrentPage('loans');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowVaultDetails={(vaultId?: string) => {
            if (vaultId) setSelectedVaultId(vaultId);
            setCurrentPage('vaults');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />}
                 {currentPage === 'borrowers' && <Borrower borrowers={borrowers} loans={loans} selectedBorrowerId={selectedBorrowerId} onBackToList={() => setSelectedBorrowerId(null)} onShowLoanDetails={(loanId) => {
           setSelectedLoanId(loanId);
           setCurrentPage('loans');
           // Scroll vers le haut de la page
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }} onBorrowersUpdate={setBorrowers} />}
        {currentPage === 'settings' && <Settings vaults={vaults} loans={loans} onVaultUpdate={handleVaultUpdated} />}
      </div>
      {isVisible && (
        <Snackbar
          icon={getActivityIcon(message)}
          text={message}
          type="success"
          className="snackbar-fixed-bottom-right"
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, height: 45, width: 300 }}
        />
      )}
    </div>
  );
};

export const PersonalBank: React.FC = () => {
  return <PersonalBankContent />;
}; 