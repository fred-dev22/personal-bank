/**
 * Calcule le montant mensuel que l'utilisateur doit payer
 * @param principal - Montant du prêt
 * @param numberOfPayments - Nombre total de paiements
 * @param annualRate - Taux annuel en pourcentage
 * @returns Montant mensuel arrondi à 2 décimales
 */
export const calculateMonthlyPayment = (
  principal: number,
  numberOfPayments: number,
  annualRate: number
): number => {
  if (!principal || !numberOfPayments || !annualRate) {
    return 0;
  }
  
  const annualRateDecimal = annualRate / 100; // Convertir le pourcentage en décimal
  const monthlyRate = annualRateDecimal / 12; // Taux mensuel
  
  // Formule de calcul du paiement mensuel : P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  // Où P = paiement mensuel, L = montant du prêt, c = taux mensuel, n = nombre de paiements
  if (monthlyRate === 0) {
    // Si le taux est 0%, c'est un prêt sans intérêt
    return principal / numberOfPayments;
  }
  
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Math.round(monthlyPayment * 100) / 100; // Arrondir à 2 décimales
};
