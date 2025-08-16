import React, { useState } from 'react';
import { HeaderWizard } from '../wizard-components/HeaderWizard';
import { Button } from '@jbaluch/components';
import StepsWizard from '../wizard-components/StepsWizard';
import { useAuth } from '../../../contexts/AuthContext';
import { useActivity } from '../../../contexts/ActivityContext';
import type { Loan, Borrower, Vault } from '../../../types/types';
import { addBorrower } from '../../../controllers/borrowerController';
import { createLoan } from '../../../controllers/loanController';
import { updateBankField } from '../../../controllers/bankController';
import { createPayment } from '../../../controllers/paymentController';
import { calculateMonthlyPayment } from '../../../utils/loanUtils';
import { StepPurpose } from './StepPurpose';
import { StepTerms } from './StepTerms';
import { StepContext } from './StepContext';
import { StepFunding } from './StepFunding';
import { StepHistory } from './StepHistory';
import { StepConfirm } from './StepConfirm';
import './index.css';

// Fonction pour déterminer si la date est dans le futur
const isDateInFuture = (dateString: string): boolean => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  selectedDate.setHours(0, 0, 0, 0); // Reset time to compare only dates
  return selectedDate > today;
};

// Fonction pour obtenir les étapes dynamiques
const getDynamicSteps = (startDate: string) => {
  // Si pas de date sélectionnée, utiliser les étapes par défaut (future)
  if (!startDate) {
    return [
      { label: 'Purpose' },
      { label: 'Terms' },
      { label: 'Context' },
      { label: 'Funding' },
      { label: 'Confirm' },
    ];
  }
  
  const isFutureDate = isDateInFuture(startDate);
  
  if (isFutureDate) {
    // Date future: Terms → Context → Funding → Confirm
    return [
      { label: 'Purpose' },
      { label: 'Terms' },
      { label: 'Context' },
      { label: 'Funding' },
      { label: 'Confirm' },
    ];
  } else {
    // Date présente/passée: Terms → Funding → History → Confirm
    return [
      { label: 'Purpose' },
      { label: 'Terms' },
      { label: 'Funding' },
      { label: 'History' },
      { label: 'Confirm' },
    ];
  }
};

export const LoanWizard: React.FC<{
  onClose: () => void;
  onLoanCreated?: (loan: Loan) => void;
  loanToEdit?: Loan;
  borrowers: Borrower[];
  onBorrowersUpdate: (borrowers: Borrower[]) => void;
  onBorrowersRefresh?: () => Promise<void>;
  loans: Loan[];
  setLoans: (loans: Loan[]) => void;
  vaults: Vault[];
  onVaultsUpdate?: () => void;
}> = ({ onClose, onLoanCreated, loanToEdit, borrowers, onBorrowersUpdate, onBorrowersRefresh, loans, setLoans, vaults, onVaultsUpdate }) => {
  const [step, setStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [loanData, setLoanData] = useState<Partial<Loan>>(loanToEdit || {
    nickname: '',
    comments: '',
    borrower_id: '',
    start_date: '',
    initial_balance: undefined,
    initial_number_of_payments: undefined,
    initial_frequency: 'every month',
    initial_annual_rate: undefined,
    initial_payment_amount: 0,
    loan_type: 'Amortized: Due-Date',
    vault_id: '',
    is_funded: false,
  });

  const { user, current_pb_onboarding_state, setCurrentPbOnboardingState } = useAuth();
  const { showActivity, hideActivity } = useActivity();
  
  // Obtenir les étapes dynamiques basées sur la date (par défaut: étapes futures)
  const steps = React.useMemo(() => getDynamicSteps(loanData.start_date || ''), [loanData.start_date]);

  const handleCreateBorrower = async (borrowerData: Partial<Borrower>) => {
    const token = localStorage.getItem('authToken');
    if (!user || !token || !user.current_pb) return;

    try {
      // Afficher le snackbar pendant que le popup reste ouvert
      showActivity('Creating borrower...');
      
      // S'assurer que fullName est défini
      const borrowerDataWithFullName = {
        ...borrowerData,
        fullName: borrowerData.fullName || `${borrowerData.firstName || ''} ${borrowerData.lastName || ''}`.trim()
      };
      
      const newBorrower = await addBorrower(token, user.current_pb, borrowerDataWithFullName);
      
      // Mettre à jour immédiatement la liste locale pour que le composant BorrowerSelector voit le nouveau borrower
      const updatedBorrowers = [...borrowers, newBorrower];
      onBorrowersUpdate(updatedBorrowers);
      console.log('✅ Borrowers list updated immediately with new borrower:', newBorrower);
      
      // En parallèle, recharger depuis l'API pour s'assurer de la synchronisation
      if (onBorrowersRefresh) {
        // Ne pas attendre cette opération pour ne pas bloquer l'interface
        onBorrowersRefresh().then(() => {
          console.log('✅ Borrowers list refreshed from API in background');
        }).catch(error => {
          console.warn('Failed to refresh borrowers from API:', error);
        });
      }
      
      // Auto-select the new borrower
      setLoanData(prev => ({ ...prev, borrower_id: newBorrower.id }));
      
      // Clear any validation errors
      setValidationErrors({});
      
      console.log('✅ Borrower created successfully');
      
      // Fermer le popup via la fonction globale
      const closeBorrowerPopup = (window as unknown as { closeBorrowerPopup?: () => void }).closeBorrowerPopup;
      if (closeBorrowerPopup) {
        closeBorrowerPopup();
      }
      
      // Petit délai pour montrer que l'opération est terminée avant de cacher le snackbar
      setTimeout(() => {
        // Cacher le snackbar
        hideActivity();
        
        // Avancer automatiquement à l'étape suivante
        if (step < steps.length - 1) {
          setStep(step + 1);
        }
      }, 300); // 300ms pour laisser l'utilisateur voir que c'est terminé
      
    } catch (error) {
      console.error('Error creating borrower:', error);
      hideActivity();
    }
  };

  // Fonction de validation pour chaque étape
  const validateStep = (stepIndex: number): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};
    const currentStepLabel = steps[stepIndex]?.label;
    
    switch (currentStepLabel) {
      case 'Purpose':
        if (!loanData.nickname?.trim()) {
          errors.nickname = 'Loan name or ID is required';
        }
        break;
      case 'Terms': {
        if (!loanData.borrower_id?.trim()) {
          // À l'étape Terms, ouvrir le popup si aucun borrower n'est sélectionné
          setTimeout(() => {
            const forceOpenBorrowerPopup = (window as unknown as { forceOpenBorrowerPopup?: () => boolean }).forceOpenBorrowerPopup;
            if (forceOpenBorrowerPopup) {
              console.log('🔍 Opening borrower popup from Terms validation...');
              const result = forceOpenBorrowerPopup();
              console.log('🔍 Popup opened:', result);
            }
          }, 50);
          errors.borrower_id = 'Borrower is required';
        }
        
        if (!loanData.start_date?.trim()) {
          errors.start_date = 'First payment date is required';
        }
        if (!loanData.initial_balance || isNaN(loanData.initial_balance) || loanData.initial_balance <= 0) {
          errors.initial_balance = 'Amount must be greater than 0';
        }
        if (!loanData.initial_number_of_payments || isNaN(loanData.initial_number_of_payments) || loanData.initial_number_of_payments <= 0) {
          errors.initial_number_of_payments = 'Term must be greater than 0';
        }
        if (!loanData.initial_annual_rate || isNaN(loanData.initial_annual_rate) || loanData.initial_annual_rate <= 0) {
          errors.initial_annual_rate = 'Annual interest rate must be greater than 0';
        }
        break;
      }
      case 'Context':
        if (loanData.is_funded === undefined) {
          errors.is_funded = 'Please select if the loan has been funded';
        }
        break;
      case 'Funding':
        if (!loanData.vault_id) {
          errors.vault_id = 'Please select a funding source';
        }
        break;
    }
    
    return errors;
  };

  // Pour la validation du bouton Next
  const isNextDisabled = () => {
    return false; // On ne désactive plus le bouton, on affiche les erreurs à la place
  };

     const handleNext = () => {
     // Vérification globale : si on est après l'étape Terms et qu'aucun borrower n'est sélectionné
     if (step > 1 && !loanData.borrower_id?.trim()) {
       console.log('🔍 No borrower selected, redirecting to Terms step...');
       setStep(1); // Retourner à l'étape Terms (index 1)
       setValidationErrors({ borrower_id: 'Please select or create a borrower' });
       
       // Ouvrir le popup après un petit délai pour laisser le temps au composant de se rendre
       setTimeout(() => {
         const forceOpenBorrowerPopup = (window as unknown as { forceOpenBorrowerPopup?: () => boolean }).forceOpenBorrowerPopup;
         if (forceOpenBorrowerPopup) {
           console.log('🔍 Calling forceOpenBorrowerPopup...');
           const result = forceOpenBorrowerPopup();
           console.log('🔍 forceOpenBorrowerPopup result:', result);
         } else {
           console.log('❌ forceOpenBorrowerPopup function not found');
         }
       }, 100);
       return;
     }
     
     const errors = validateStep(step);
     
     setValidationErrors(errors);
     
     // Si il y a des erreurs, on ne passe pas à l'étape suivante
     if (Object.keys(errors).length > 0) {
       return;
     }
    
    // Nettoyer les erreurs si tout est valide
    setValidationErrors({});
    
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    // Ferme le wizard et affiche le snackbar immédiatement
    onClose();
    showActivity('Creating loan...');

    // Création async en tâche de fond
    (async () => {
      const token = localStorage.getItem('authToken');
      if (!user || !token || !user.current_pb) {
        hideActivity();
        return;
      }

      try {
        // Déterminer le statut selon la date ET le choix de financement
        let loanStatus: string;
        
        // Vérifier si la date est dans le passé/présent
        const startDate = new Date(loanData.start_date || '');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        const isPastOrPresent = startDate <= today;
        
        if (isPastOrPresent) {
          // Date passée/présente → "Funded" (On Track) - le prêt est déjà actif
          loanStatus = 'Funded';
        } else {
          // Date future → statut selon le choix de financement
          if (loanData.is_funded === true) {
            // Si l'utilisateur a choisi "Yes" (déjà financé) → "Funded" (On Track)
            loanStatus = 'Funded';
          } else {
            // Si l'utilisateur a choisi "No" (pas encore financé) → "Funding" (To Fund)
            loanStatus = 'Funding';
          }
        }
        
        // Préparer les données pour l'API
        // Calculer le montant mensuel
        const monthlyPaymentAmount = calculateMonthlyPayment(
          loanData.initial_balance || 0,
          loanData.initial_number_of_payments || 0,
          loanData.initial_annual_rate || 0
        );

        const loanPayload = {
          loan_request_azure_id: `loan_${Date.now()}`, // Générer un ID temporaire
          nickname: loanData.nickname || '',
          borrower_id: loanData.borrower_id || '', // Seulement borrower_id
          vault_id: loanData.vault_id || '',
          start_date: loanData.start_date || '',
          status: loanStatus,
          loan_type: 'amortized',
          initial_payment_amount: loanData.initial_payment_amount || 0,
          monthly_payment_amount: monthlyPaymentAmount, // Ajouter le montant mensuel calculé
          initial_balance: loanData.initial_balance || 0,
          initial_number_of_payments: loanData.initial_number_of_payments || 0,
          initial_frequency: 'monthly',
          initial_annual_rate: (loanData.initial_annual_rate || 0) / 100, // Convertir en décimal
          initial_payment_day_of_month: 30, // Valeur par défaut
        };

        // Créer le loan
        const newLoan = await createLoan(token, user.current_pb, loanPayload);
        
        // S'assurer que les champs borrower sont correctement remplis
        const correctedLoan = {
          ...newLoan,
          borrowerId: loanData.borrower_id || newLoan.borrowerId || newLoan.borrower_id,
          borrower_id: loanData.borrower_id || newLoan.borrower_id || newLoan.borrowerId,
          vaultId: loanData.vault_id || newLoan.vaultId || newLoan.vault_id,
          vault_id: loanData.vault_id || newLoan.vault_id || newLoan.vaultId
        };
        
        // Créer les paiements historiques APRÈS la création du prêt si ils existent
        let finalLoan = correctedLoan;
        
        if (loanData.pendingPayments && loanData.pendingPayments.length > 0) {
          try {
            console.log('📝 Creating historical payments AFTER loan creation...');
            const createdPaymentIds: string[] = [];
            
            for (const paymentData of loanData.pendingPayments) {
              const createdPayment = await createPayment(token, newLoan.id, {
                amount: paymentData.amount,
                date: paymentData.date,
                balloon: paymentData.balloon
              });
              createdPaymentIds.push(createdPayment.id);
            }
            
            // Mettre à jour le prêt avec les IDs des paiements créés
            finalLoan = {
              ...correctedLoan,
              payments: [...(correctedLoan.payments || []), ...createdPaymentIds]
            };
            
            console.log('✅ Historical payments created:', createdPaymentIds);
          } catch (error) {
            console.error('❌ Error creating historical payments:', error);
          }
        }

        // Ajouter le prêt final à la liste
        setLoans([...loans, finalLoan]);
        console.log('✅ Loan added to list:', finalLoan);

        // Gérer l'onboarding si on est dans ce contexte
        if (current_pb_onboarding_state === 'add-loan') {
          try {
            setCurrentPbOnboardingState('done');
            await updateBankField(token, user.current_pb, { onboarding_state: 'done' });
          } catch (error) {
            console.error('Error updating onboarding state:', error);
          }
        }

        // Callback optionnel avec un petit délai pour s'assurer que la liste est mise à jour
        setTimeout(() => {
          if (onLoanCreated) {
            onLoanCreated(finalLoan);
          }
        }, 100);

        // Mettre à jour les vaults pour l'affichage dans la section loans
        if (onVaultsUpdate) {
          onVaultsUpdate();
        }

        // Passage à l'étape suivante APRÈS la fermeture du snackbar
        setTimeout(() => {
          hideActivity();
          // if (onLoanCreated) onLoanCreated(loan);
        }, 2000);
      } catch (error) {
        console.error('Error creating loan:', error);
        hideActivity();
      }
    })();
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
      setValidationErrors({}); // Nettoyer les erreurs quand on revient en arrière
    }
  };

  // Fonction pour rendre les étapes dynamiques selon le type de flux
  const renderDynamicStep = () => {
    // Si pas de date, utiliser le flux futur par défaut
    const isFutureDate = loanData.start_date ? isDateInFuture(loanData.start_date) : true;
    
    if (isFutureDate) {
      // Flux date future: Purpose → Terms → Context → Funding → Confirm
      switch (step) {
        case 2:
          return <StepContext loanData={loanData} setLoanData={setLoanData} validationErrors={validationErrors} onNext={handleNext} />;
        case 3:
          return <StepFunding loanData={loanData} setLoanData={setLoanData} validationErrors={validationErrors} vaults={vaults} />;
        case 4:
          return <StepConfirm loanData={loanData} vaults={vaults} />;
        default:
          return null;
      }
    } else {
      // Flux date présente/passée: Purpose → Terms → Funding → History → Confirm
      switch (step) {
        case 2:
          return <StepFunding loanData={loanData} setLoanData={setLoanData} validationErrors={validationErrors} vaults={vaults} hideFundingInfo={true} />;
        case 3:
          return <StepHistory loanData={loanData} setLoanData={setLoanData} validationErrors={validationErrors} />;
        case 4:
          return <StepConfirm loanData={loanData} vaults={vaults} />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="loan-wizard">
      <HeaderWizard
        title="Add loan"
        onExit={onClose}
        showPreview={step > 0}
        onPreview={step > 0 ? handlePrevious : undefined}
      />
      <div style={{ marginBottom: 32 }}>
        <StepsWizard steps={steps} currentStep={step} />
      </div>
      
                                   {/* Contenu des étapes */}
        {step === 0 && <StepPurpose loanData={loanData} setLoanData={setLoanData} validationErrors={validationErrors} />}
        {step === 1 && (
          <StepTerms 
            loanData={loanData} 
            setLoanData={setLoanData} 
            borrowers={borrowers}
            onCreateBorrower={handleCreateBorrower}
            validationErrors={validationErrors}
          />
        )}
        {renderDynamicStep()}

      {/* Footer avec boutons - Caché sur l'étape Context */}
      {!(step === 2 && (loanData.start_date ? isDateInFuture(loanData.start_date) : true)) && (
        <div className="loan-wizard-footer">
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="center"
          name="cancel"
          form=""
          ariaLabel="Cancel"
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          style={{ width: 100 }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="center"
          name={step === steps.length - 1 ? 'finish' : 'next'}
          form=""
          ariaLabel={step === steps.length - 1 ? 'Finish' : 'Next'}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="primary"
          style={{ width: 100, height: 40 }}
          onClick={handleNext}
          disabled={isNextDisabled()}
        >
          {step === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
        </div>
      )}
    </div>
  );
};

export default LoanWizard; 