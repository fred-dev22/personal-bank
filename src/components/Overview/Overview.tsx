import React, { useState } from "react";
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./Overview.css";
import type { Vault } from '../../types/types';
import type { OnboardingStep } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import { TodoOverviewCard } from './TodoOverviewCard';
import { TasksOverviewCard } from './TasksOverviewCard';
import { VaultsOverviewCard } from './VaultsOverviewCard';
import { PaymentsScreen } from './PaymentsScreen';
import { LoansScreen } from './LoansScreen';
import { RequestsScreen } from './RequestsScreen';
import { TransfersScreen } from './TransfersScreen';

interface OverviewProps {
  vaults: Vault[];
  onAddVault?: () => void;
  onShowGatewayWizard?: () => void;
  onAddLoan?: () => void;
  onVaultDetails?: (vaultId: string) => void;
}

type OverviewScreen = 'main' | 'payments' | 'loans' | 'requests' | 'transfers';

export const Overview: React.FC<OverviewProps> = ({ vaults, onAddVault, onShowGatewayWizard, onAddLoan, onVaultDetails }) => {
  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<OverviewScreen>('main');

  // Format current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // DEBUG: Affiche le contenu des vaults
  console.log('[DEBUG VAULTS]', vaults);

  // Affichage : si current_pb_onboarding_state n'est pas défini ou n'est pas dans la liste, on affiche l'overview direct
  const showOnboarding = current_pb_onboarding_state && [
    'bank-name',
    'setup-gateway',
    'add-vault',
    'add-loan',
  ].includes(current_pb_onboarding_state);

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'payments':
        return <PaymentsScreen onBack={handleBackToMain} />;
      case 'loans':
        return <LoansScreen onBack={handleBackToMain} />;
      case 'requests':
        return <RequestsScreen onBack={handleBackToMain} />;
      case 'transfers':
        return <TransfersScreen onBack={handleBackToMain} />;
      default:
        return (
          <div className="div">
            <div className="to-do-section" style={{width: '100%'}}>
              {/* Header */}
              <div style={{marginBottom: 24}}>
                <h2 style={{fontWeight: 700, fontSize: 18, color: '#0d1728', margin: 0}}>To Do</h2>
              </div>
              
              {/* Cards Container */}
              <div className="overview-cards-container">
                {/* Actions Card */}
                <TodoOverviewCard 
                  actions={[
                    {
                      id: 'payments',
                      label: 'payments to receive',
                      count: 2,
                      isActive: true,
                      buttonText: 'Receive',
                      buttonAction: () => setCurrentScreen('payments'),
                      hasLateTag: true,
                      lateCount: 1
                    },
                    {
                      id: 'loans',
                      label: 'loan to fund',
                      count: 1,
                      isActive: true,
                      buttonText: 'Fund',
                      buttonAction: () => setCurrentScreen('loans')
                    },
                    {
                      id: 'requests',
                      label: 'requests to review',
                      count: 0,
                      isActive: false,
                      buttonText: 'Review',
                      buttonAction: () => setCurrentScreen('requests')
                    },
                    {
                      id: 'transfers',
                      label: 'amounts to transfer',
                      count: 2,
                      isActive: true,
                      buttonText: 'Transfer',
                      buttonAction: () => setCurrentScreen('transfers')
                    }
                  ]}
                />

                {/* Tasks Card */}
                <TasksOverviewCard 
                  onAddTask={() => console.log('Add task')}
                />
              </div>
            </div>
            <VaultsOverviewCard 
              vaults={vaults}
              onVaultSelect={(vaultId) => console.log('Vault selected:', vaultId)}
              onVaultDetails={onVaultDetails}
            />
          </div>
        );
    }
  };

  return (
    <div className="frame-overview">
      <header className="page-toolbar">
        <div className="page-header">
          <div className="page-header__title">Hello, {user?.firstName || 'User'}</div>
          <div className="page-header__subtitle">{formattedDate}</div>
        </div>
      </header>
      {showOnboarding ? (
        <OnboardingCard
          step={current_pb_onboarding_state as OnboardingStep}
          onStepChange={(step: string) => setCurrentPbOnboardingState(step)}
          onAddVault={onAddVault}
          onShowGatewayWizard={onShowGatewayWizard}
          onAddLoan={onAddLoan}
        />
      ) : (
        renderScreen()
      )}
    </div>
  );
};