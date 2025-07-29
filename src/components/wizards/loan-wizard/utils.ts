/**
 * Calcule le paiement mensuel selon le type de prêt
 * @param principal - Montant principal du prêt
 * @param annualRate - Taux d'intérêt annuel (en pourcentage, ex: 5 pour 5%)
 * @param numberOfPayments - Nombre total de paiements
 * @param loanType - Type de prêt ('Amortized: Due-Date', 'Interest-only', 'Revolving')
 * @returns Le paiement mensuel
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  numberOfPayments: number,
  loanType: string = 'Amortized: Due-Date'
): number => {
  if (!principal || !annualRate || !numberOfPayments || principal <= 0 || annualRate <= 0 || numberOfPayments <= 0) {
    return 0;
  }

  // Convertir le taux annuel en taux mensuel
  const monthlyRate = (annualRate / 100) / 12;
  
  switch (loanType) {
    case 'Amortized: Due-Date':
      // Formule du paiement mensuel pour un prêt amortisé
      // M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
      const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
      return principal * (numerator / denominator);
      
    case 'Interest-only':
      // Pour un prêt à intérêts seulement, le paiement mensuel = intérêts mensuels
      // Le principal est remboursé à la fin
      return principal * monthlyRate;
      
    case 'Revolving':
      // Pour un crédit revolving, on utilise généralement un paiement minimum
      // Exemple: 2% du solde ou minimum $25
      const percentagePayment = principal * 0.02; // 2% du solde
      const minimumPayment = 25; // Paiement minimum
      return Math.max(percentagePayment, minimumPayment);
      
    default:
      // Par défaut, utiliser la formule amortisée
      const defaultNumerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
      const defaultDenominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
      return principal * (defaultNumerator / defaultDenominator);
  }
};

/**
 * Formate un montant en devise
 * @param amount - Montant à formater
 * @returns Montant formaté en string
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === 0) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Calcule le taux de flux de trésorerie mensuel
 * @param monthlyPayment - Paiement mensuel
 * @param principal - Montant principal du prêt
 * @returns Taux de flux de trésorerie en pourcentage
 */
export const calculateCashFlowRate = (monthlyPayment: number, principal: number): number => {
  if (!monthlyPayment || !principal || principal <= 0) {
    return 0;
  }
  
  return (monthlyPayment / principal) * 100;
}; 