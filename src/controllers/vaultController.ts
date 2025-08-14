import { API_BASE_URL } from '../config/api';
import type { Vault, PaymentProjection } from '../types/types';
import { addCreateDates, addModifiedDate } from '../utils/dateUtils';

export type VaultCreateInput = Partial<Vault>;

export const fetchVaults = async (token: string, bankId: string): Promise<Vault[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banks/${bankId}/vaults`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vaults');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vaults:', error);
    throw error;
  }
};

// Fonction pour récupérer la projection d'un Super Vault
export const fetchVaultProjection = async (token: string, vaultData: Partial<Vault>): Promise<PaymentProjection> => {
  try {
    console.log('📊 Preparing projection payload from vault data:', vaultData);
    
    const projectionPayload = {
      meclimit: vaultData.annualNonMecLimit ? parseFloat(vaultData.annualNonMecLimit) : 39000,
      monthlypayment: 0,
      maxltv: vaultData.debtLtv ? parseFloat(vaultData.debtLtv) / 100 : 0.72,
      startingcv: vaultData.amount ? (typeof vaultData.amount === 'string' ? parseFloat(vaultData.amount) : vaultData.amount) : 30000,
      cvgrowthrate: vaultData.annualGrowthRate ? parseFloat(vaultData.annualGrowthRate) / 100 : 0.07,
      startingPolicyLoan: vaultData.debtBalance ? parseFloat(vaultData.debtBalance) : 0,
      policyloanrate: vaultData.debtCeilingRate ? parseFloat(vaultData.debtCeilingRate) / 100 : 0.05,
      targetDSCR: 1.5,
      monthlypassiveincomegoal: 0
    };
    
    console.log('📊 Projection payload to send:', projectionPayload);

    const azureFunctionKey = import.meta.env.VITE_AZURE_FUNCTION_KEY;
    if (!azureFunctionKey) {
      throw new Error('Azure Function Key not configured');
    }

    const response = await fetch(`https://iris-iul-calc-dev.azurewebsites.net/api/iulloans?code=${azureFunctionKey}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(projectionPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Projection API error:', response.status, errorText);
      throw new Error(`Failed to fetch vault projection: ${response.status} ${errorText}`);
    }

    const projectionData = await response.json();
    console.log('📊 Projection API response:', projectionData);
    
    return projectionData;
  } catch (error) {
    console.error('Error fetching vault projection:', error);
    throw error;
  }
};

export const createVault = async (token: string, bankId: string, data: VaultCreateInput): Promise<Vault> => {
  // Add created_date and modified_date to vault data
  let dataWithDates = addCreateDates(data);

  // Si c'est un Super Vault, récupérer la projection AVANT la création
  if (dataWithDates.type === 'super vault') {
    console.log('🚀  detected, fetching projection before creation...', { 
      vaultType: dataWithDates.type,
      dataForProjection: dataWithDates 
    });
    
    try {
      const projection = await fetchVaultProjection(token, dataWithDates);
      console.log('✅ Projection fetched successfully:', projection);
      
      // Ajouter la projection aux données de création
      dataWithDates = { ...dataWithDates, payment_projection: projection };
      console.log('✅ Projection added to vault creation data');
    } catch (error) {
      console.error('❌ Error fetching projection for Super Vault:', error);
      // Continue la création même si la projection échoue
    }
  }

  const response = await fetch(`${API_BASE_URL}/banks/${bankId}/vaults`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataWithDates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create vault');
  }
  
  const createdVault = await response.json();
  console.log('✅ Vault created successfully:', createdVault.id);
  
  return createdVault;
};

export const updateVault = async (token: string, bankId: string, vaultId: string, data: Partial<Vault>): Promise<Vault> => {
  // Add modified_date to vault data
  const dataWithModifiedDate = addModifiedDate(data);
  
  console.log('🔄 Updating vault with projection:', {
    url: `${API_BASE_URL}/banks/${bankId}/vaults/${vaultId}`,
    vaultId,
    bankId,
    data: dataWithModifiedDate
  });
  
  const response = await fetch(`${API_BASE_URL}/vaults/${vaultId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataWithModifiedDate),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to update vault:', response.status, errorText);
    throw new Error(`Failed to update vault: ${response.status} ${errorText}`);
  }
  
  const updatedVault = await response.json();
  console.log('✅ Vault updated successfully:', updatedVault);
  
  // Si c'est un Super Vault et qu'on modifie des données importantes, recalculer la projection
  if (updatedVault.type === 'super vault' && shouldRecalculateProjection(data)) {
    try {
      const projection = await fetchVaultProjection(token, updatedVault);
      updatedVault.payment_projection = projection;
      
      // Mettre à jour une seconde fois avec la nouvelle projection
      await fetch(`${API_BASE_URL}/banks/${bankId}/vaults/${vaultId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ payment_projection: projection, modified_date: addModifiedDate({}).modified_date }),
      });
    } catch (error) {
      console.error('Error updating projection for Super Vault:', error);
      // Continue même si la projection échoue
    }
  }
  
  return updatedVault;
};

// Fonction helper pour déterminer si on doit recalculer la projection
const shouldRecalculateProjection = (data: Partial<Vault>): boolean => {
  const fieldsToWatch = [
    'amount', 'annualNonMecLimit', 'debtLtv', 'annualGrowthRate', 
    'debtBalance', 'debtCeilingRate'
  ];
  
  return fieldsToWatch.some(field => data[field as keyof Vault] !== undefined);
}; 