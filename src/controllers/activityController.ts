import type { Activity, Loan, Vault } from '../types/types';
import { API_BASE_URL } from '../config/api';

// Mapping utilitaire pour adapter l'API au type Activity du front
function mapApiActivity(apiAct: any): Activity {
  return {
    id: apiAct.id || apiAct._id || '',
    name: apiAct.state || apiAct.name || '',
    type: apiAct.state || '',
    date: apiAct.date ? new Date(apiAct.date) : new Date(),
    amount: typeof apiAct.amount === 'number' ? apiAct.amount : 0,
    tag: apiAct.tag || '',
  };
}

export async function fetchNoteActivities(azure_note_id: string, token: string): Promise<Activity[]> {
  const url = `${API_BASE_URL}/notes/${azure_note_id}/activities`;
  const res = await fetch(url, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch note activities');
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapApiActivity) : [];
}

export async function fetchVaultActivities(azure_vault_id: string, token: string): Promise<Activity[]> {
  const url = `${API_BASE_URL}/vaults/${azure_vault_id}/activities`;
  const res = await fetch(url, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch vault activities');
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapApiActivity) : [];
}

export async function fetchAllActivities(
  azure_note_id: string,
  azure_vault_id: string,
  token: string
): Promise<Activity[]> {
  const [noteActivities, vaultActivities] = await Promise.all([
    fetchNoteActivities(azure_note_id, token),
    fetchVaultActivities(azure_vault_id, token),
  ]);
  const all = [...noteActivities, ...vaultActivities];
  // On s'assure que la date est bien un objet Date
  all.forEach(a => { if (typeof a.date === 'string') a.date = new Date(a.date); });
  // Tri décroissant (plus récent en haut)
  all.sort((a, b) => b.date.getTime() - a.date.getTime());
  return all;
}

export async function fetchAllUserActivities(
  loans: Loan[],
  vaults: Vault[],
  token: string
): Promise<Activity[]> {
  const noteIds = loans.map(l => l.note_id).filter(Boolean);
  const vaultIds = vaults.map(v => v.id).filter(Boolean);
  const notePromises = noteIds.map(id => fetchNoteActivities(id, token));
  const vaultPromises = vaultIds.map(id => fetchVaultActivities(id, token));
  const results = await Promise.allSettled([...notePromises, ...vaultPromises]);
  const all: Activity[] = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => (r.status === 'fulfilled' ? r.value : []));
  all.forEach(a => { if (typeof a.date === 'string') a.date = new Date(a.date); });
  all.sort((a, b) => b.date.getTime() - a.date.getTime());
  return all;
} 