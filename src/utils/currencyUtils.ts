/**
 * Formate un montant en devise USD avec le format standard $48,500.00
 * @param amount - Montant à formater (peut être number, string, ou undefined)
 * @returns Montant formaté en string
 */
export const formatCurrency = (amount: number | string | undefined | null): string => {
  // Gérer les cas null/undefined
  if (amount === null || amount === undefined) {
    return '$0.00';
  }
  
  // Convertir en nombre
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Vérifier si c'est un nombre valide
  if (isNaN(num) || num === 0) {
    return '$0.00';
  }
  
  // Formater avec le format standard $48,500.00
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Formate un montant en pourcentage avec 2 décimales
 * @param amount - Montant à formater
 * @returns Pourcentage formaté en string
 */
export const formatPercentage = (amount: number | string | undefined | null): string => {
  if (amount === null || amount === undefined) {
    return '0.00%';
  }
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '0.00%';
  }
  
  return `${num.toFixed(2)}%`;
};
