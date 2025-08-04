import React from "react";
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

interface OverviewProps {
  vaults: Vault[];
  onAddVault?: () => void;
  onShowGatewayWizard?: () => void;
  onAddLoan?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ vaults, onAddVault, onShowGatewayWizard, onAddLoan }) => {
  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();

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
                    buttonAction: () => console.log('Receive payments'),
                    hasLateTag: true,
                    lateCount: 1
                  },
                  {
                    id: 'loans',
                    label: 'loan to fund',
                    count: 1,
                    isActive: true,
                    buttonText: 'Fund',
                    buttonAction: () => console.log('Fund loan')
                  },
                  {
                    id: 'requests',
                    label: 'requests to review',
                    count: 0,
                    isActive: false,
                    buttonText: 'Review',
                    buttonAction: () => console.log('Review requests')
                  },
                  {
                    id: 'transfers',
                    label: 'amounts to transfer',
                    count: 2,
                    isActive: true,
                    buttonText: 'Transfer',
                    buttonAction: () => console.log('Transfer amounts')
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
            onVaultDetails={(vaultId) => console.log('Navigate to vault details:', vaultId)}
          />
        </div>
      )}
    </div>
  );
};