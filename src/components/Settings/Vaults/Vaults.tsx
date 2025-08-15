import React from "react";
import { Input, Table, TextCell, Button } from "@jbaluch/components";
import "./vaults.css";
import type { Vault, Loan } from "../../../types/types";
import { useAuth } from "../../../contexts/AuthContext";
import { updateVault } from "../../../controllers/vaultController";
import { useActivity } from "../../../contexts/ActivityContext";

interface VaultsProps {
  vaults: Vault[];
  loans?: Loan[];
  onVaultUpdate?: (updatedVault: Vault) => void;
}

export const Vaults: React.FC<VaultsProps> = ({ vaults, loans = [], onVaultUpdate }) => {
  const { user } = useAuth();
  const { showActivity } = useActivity();
  
  // État local pour gérer les vaults et leur mise à jour
  const [localVaults, setLocalVaults] = React.useState<Vault[]>(vaults);
  
  // Mettre à jour les vaults locaux quand les props changent
  React.useEffect(() => {
    console.log('🔄 useEffect: vaults prop changed:', vaults.length);
    setLocalVaults(vaults);
  }, [vaults]);
  
  // Debug: afficher l'état actuel des vaults
  React.useEffect(() => {
    console.log('📊 Current localVaults state:', {
      total: localVaults.length,
      archived: localVaults.filter(v => v.archived).length,
      vaults: localVaults.map(v => ({ id: v.id, archived: v.archived, nickname: v.nickname }))
    });
  }, [localVaults]);

  // Fonction pour compter les loans d'un vault
  const getTotalLoans = (vaultId: string) => {
    return loans.filter(loan => loan.vault_id === vaultId).length;
  };

  // Fonction pour désarchiver un vault
  const handleUnarchiveVault = async (vault: Vault) => {
    console.log('🚀 handleUnarchiveVault called with vault:', vault);
    
    // Vérifier que le vault est valide
    if (!vault || !vault.id) {
      console.error('❌ Invalid vault object:', vault);
      showActivity('Invalid vault data. Please try again.');
      return;
    }
    
    if (!user || !user.current_pb) {
      console.log('❌ User not authenticated:', { user, current_pb: user?.current_pb });
      showActivity('User not authenticated');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('❌ No auth token found in localStorage');
        showActivity('Authentication token not found');
        return;
      }

      console.log('🔄 Starting unarchive process:', {
        vaultId: vault.id,
        bankId: user.current_pb,
        token: token.substring(0, 10) + '...'
      });
      
      const updatedVault = await updateVault(token, user.current_pb, vault.id, {
        archived: false
      });

      console.log('✅ Vault unarchived successfully:', updatedVault);
      console.log('📊 Updated vault details:', {
        id: updatedVault.id,
        archived: updatedVault.archived,
        nickname: updatedVault.nickname
      });

      // Mettre à jour l'état local immédiatement
      setLocalVaults(prevVaults => {
        console.log('🔄 Updating local vaults:', {
          before: prevVaults.filter(v => v.archived).length,
          vaultId: vault.id, // Utiliser vault.id au lieu de updatedVault.id
          archived: false
        });
        
        // Forcer la mise à jour avec archived: false en utilisant vault.id
        const newVaults = prevVaults.map(v => 
          v.id === vault.id ? { ...v, archived: false } : v
        );
        
        console.log('🔄 After update:', {
          after: newVaults.filter(v => v.archived).length,
          vaults: newVaults.map(v => ({ id: v.id, archived: v.archived }))
        });
        
        return newVaults;
      });
      
      // Appeler le callback parent si fourni
      if (onVaultUpdate) {
        // Créer un vault mis à jour avec les données que nous avons
        const updatedVaultForCallback = { ...vault, archived: false };
        console.log('🔄 Calling onVaultUpdate with:', updatedVaultForCallback);
        onVaultUpdate(updatedVaultForCallback);
      } else {
        console.log('⚠️ onVaultUpdate is not provided');
      }

      // Afficher le message de succès
      showActivity('Vault unarchived successfully');
    } catch (error) {
      console.error('❌ Error unarchiving vault:', error);
      showActivity('Failed to unarchive vault. Please try again.');
    }
  };

  return (
    <div className="vaults-settings">
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Default settings</div>
          <p className="subtitle">Applies to newly added loans</p>
        </div>
        <div className="settings-caption">
          <div className="input-molecule">
            <div className="labels-wrapper">
              <div className="labels">
                <div className="label-asterisk">
                  <div className="asterisk">
                    <div className="text-wrapper-2">*</div>
                  </div>
                  <div className="label-2">Minimum Income DSCR</div>
                </div>
              </div>
            </div>
            <div className="input">
              <Input
                className="text-input-instance"
                placeholder="1.25"
                value="1.25"
                type="text"
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="input-molecule">
            <div className="labels-wrapper">
              <div className="labels">
                <div className="label-asterisk">
                  <div className="asterisk">
                    <div className="text-wrapper-2">*</div>
                  </div>
                  <div className="label-2">Minimum Growth DSCR</div>
                </div>
              </div>
            </div>
            <div className="input">
              <Input
                className="text-input-instance"
                placeholder="1.25"
                value="1.25"
                type="text"
                onChange={() => {}}
              />
            </div>
          </div>
          <button className="save-btn" disabled>Save</button>
        </div>
      </div>
             <div className="settings-box archived-vaults-section">
         <div className="title-subtitle">
           <div className="title">Archived vaults</div>
           <p className="subtitle">You cannot lend from an archived vault.</p>
         </div>
         <div className="settings-caption">
          {localVaults.filter(vault => vault.archived).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
              No vaults have been archived.
            </div>
          ) : (
            <Table
              columns={[
                {
                  key: 'nickname',
                  label: 'Name',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'left',
                  getCellProps: (row: Vault) => ({ 
                    text: row.is_gateway ? 'Gateway' : (row.nickname || 'Unnamed Vault') 
                  }),
                },
                {
                  key: 'total_loans',
                  label: 'Total Loans',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'center',
                  getCellProps: (row: Vault) => ({ 
                    text: getTotalLoans(row.id).toString() 
                  }),
                },
                {
                  key: 'created_date',
                  label: 'Created Date',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'center',
                  getCellProps: (row: Vault) => ({ 
                    text: row.created_date ? new Date(row.created_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'Unknown' 
                  }),
                },
                {
                  key: 'archived_date',
                  label: 'Archive Date',
                  cellComponent: TextCell,
                  width: '100%',
                  alignment: 'center',
                  getCellProps: (row: Vault) => ({ 
                    text: row.modified_date ? new Date(row.modified_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'Unknown' 
                  }),
                },
                                 {
                   key: 'actions',
                   label: '',
                   getCellProps: (row: Vault) => ({
                     text: 'Unarchive',
                     onClick: () => {
                       console.log('🔘 Button clicked, calling handleUnarchiveVault with:', row);
                       handleUnarchiveVault(row);
                     }
                   }),
                   cellComponent: ({ text, onClick }: { text: string; onClick: () => void }) => (
                     <Button
                       icon="iconless"
                       iconComponent={undefined}
                       interaction="default"
                       onClick={onClick}
                       onMouseEnter={() => {}}
                       onMouseLeave={() => {}}
                       type="secondary"
                       name="unarchive"
                       form=""
                       ariaLabel="Unarchive"
                       style={{ 
                         backgroundColor: '#f5f5f5', 
                         border: '1px solid #e0e0e0',
                         color: '#000',
                         fontWeight: 'bold',
                         fontSize: '14px',
                         padding: '8px 16px',
                         borderRadius: '6px',
                         cursor: 'pointer'
                       }}
                     >
                       {text}
                     </Button>
                   ),
                   width: '120px',
                   alignment: 'right',
                 },
                             ]}
               data={localVaults.filter(vault => vault.archived)}
               clickableRows={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 