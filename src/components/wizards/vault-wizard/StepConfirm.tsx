import React, { useState } from 'react';
import { TabNavigation } from '../../ui/TabNavigation';
import { DottedUnderline } from '../../ui/DottedUnderline';
import { HelpTooltip } from '../../ui/HelpTooltip';
import type { Vault } from '../../../types/types';

export const StepConfirm: React.FC<{ vaultData: Vault; gatewayMode?: boolean }> = ({ vaultData, gatewayMode }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const isSuperVault = vaultData.type === 'super vault';

  // Icon components
  const SummaryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_15560_39860)">
        <path d="M15.1516 6.35389C15.1516 5.93968 14.8158 5.60389 14.4016 5.60389C13.9873 5.60389 13.6516 5.93968 13.6516 6.35389H15.1516ZM9.64728 2.34961C10.0615 2.34961 10.3973 2.01382 10.3973 1.59961C10.3973 1.1854 10.0615 0.849609 9.64728 0.849609V2.34961ZM4.4149 9.68294C4.16637 10.0143 4.23353 10.4844 4.5649 10.7329C4.89627 10.9815 5.36637 10.9143 5.6149 10.5829L4.4149 9.68294ZM7.5749 6.71961L8.10512 6.18918C7.95137 6.03549 7.7385 5.95607 7.52166 5.9715C7.30481 5.98693 7.10533 6.0957 6.9749 6.26961L7.5749 6.71961ZM9.28223 8.42628L8.752 8.95671C8.90576 9.11041 9.11866 9.18983 9.33552 9.17438C9.55238 9.15893 9.75186 9.05014 9.88229 8.8762L9.28223 8.42628ZM12.4416 5.46287C12.6901 5.13147 12.6229 4.66137 12.2915 4.41289C11.9601 4.1644 11.49 4.23162 11.2415 4.56302L12.4416 5.46287ZM14.4016 6.35389H13.6516V12.6929H14.4016H15.1516V6.35389H14.4016ZM14.4016 12.6929H13.6516C13.6516 13.2213 13.2232 13.6496 12.6949 13.6496V14.3996V15.1496C14.0517 15.1496 15.1516 14.0497 15.1516 12.6929H14.4016ZM12.6949 14.3996V13.6496H3.30823V14.3996V15.1496H12.6949V14.3996ZM3.30823 14.3996V13.6496C2.77988 13.6496 2.35156 13.2213 2.35156 12.6929H1.60156H0.851562C0.851562 14.0497 1.95145 15.1496 3.30823 15.1496V14.3996ZM1.60156 12.6929H2.35156V3.30628H1.60156H0.851562V12.6929H1.60156ZM1.60156 3.30628H2.35156C2.35156 2.77792 2.77988 2.34961 3.30823 2.34961V1.59961V0.849609C1.95145 0.849609 0.851562 1.9495 0.851562 3.30628H1.60156ZM3.30823 1.59961V2.34961H9.64728V1.59961V0.849609H3.30823V1.59961ZM13.5482 3.30628V4.05628C14.4337 4.05628 15.1516 3.33844 15.1516 2.45294H14.4016H13.6516C13.6516 2.51001 13.6053 2.55628 13.5482 2.55628V3.30628ZM14.4016 2.45294H15.1516C15.1516 1.56745 14.4337 0.849609 13.5482 0.849609V1.59961V2.34961C13.6053 2.34961 13.6516 2.39587 13.6516 2.45294H14.4016ZM13.5482 1.59961V0.849609C12.6627 0.849609 11.9449 1.56745 11.9449 2.45294H12.6949H13.4449C13.4449 2.39587 13.4912 2.34961 13.5482 2.34961V1.59961ZM12.6949 2.45294H11.9449C11.9449 3.33844 12.6627 4.05628 13.5482 4.05628V3.30628V2.55628C13.4912 2.55628 13.4449 2.51001 13.4449 2.45294H12.6949ZM5.0149 10.1329L5.6149 10.5829L8.1749 7.16961L7.5749 6.71961L6.9749 6.26961L4.4149 9.68294L5.0149 10.1329ZM7.5749 6.71961L7.04467 7.25004L8.752 8.95671L9.28223 8.42628L9.81246 7.89584L8.10512 6.18918L7.5749 6.71961ZM9.28223 8.42628L9.88229 8.8762L12.4416 5.46287L11.8416 5.01294L11.2415 4.56302L8.68217 7.97635L9.28223 8.42628Z"/>
      </g>
      <defs>
        <clipPath id="clip0_15560_39860">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
  
  const InstructionsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_15588_35511)">
        <path d="M13.4008 13.5988H2.60078V2.60078H13.4008C13.4008 2.60078 13.4008 1.50372 13.4008 0.800781C9.18312 0.800781 2.60078 0.800781 2.60078 0.800781C1.61078 0.800781 0.800781 1.61078 0.800781 2.60078C0.800781 3.59078 0.800781 13.4008 0.800781 13.4008C0.800781 14.3908 1.61078 15.2008 2.60078 15.2008H13.4008C14.3908 15.2008 15.2008 14.3908 15.2008 13.4008C15.2008 13.4008 15.2008 3.55249 15.2008 2.60078C15.2008 1.64907 14.3008 0.800781 13.4008 0.800781C13.4008 5.79871 13.4008 13.5988 13.4008 13.5988Z"/>
        <path d="M11.6008 4.40078H4.40078V6.20078H11.6008V4.40078Z"/>
        <path d="M4.40078 7.10078V8.90078H11.6008V7.10078H4.40078Z"/>
        <path d="M11.6008 9.80078H4.40078V11.6008H11.6008V9.80078Z"/>
      </g>
      <defs>
        <clipPath id="clip0_15588_35511">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  // Détermine le nom à afficher
  const vaultName = gatewayMode ? 'Gateway' : (vaultData.name || 'Vault');
  // Détermine le type d'account
  const accountTypeLabel = vaultData.accountType === 'savings' ? 'Savings' : 'Checking';
  // Taux d'intérêt
  const appreciation = isSuperVault 
    ? (vaultData.annualGrowthRate ? `${vaultData.annualGrowthRate}%` : '7.00%')
    : (vaultData.interestRate ? `${String(vaultData.interestRate).replace(/%$/, '')}%` : '0.00%');
  // Montant
  const accountAmount = Number(vaultData.amount ?? vaultData.balance ?? 0);

  // Calculs pour Super Vault
  const parseCurrency = (val: string | number | undefined) => Number(String(val || '0').replace(/[^0-9.-]+/g, ''));
  
  // Calcul du credit limit basé sur le type
  const getCreditLimit = () => {
    if (!isSuperVault) return 0;
    
    const assetValue = Number(vaultData.amount) || 0;
    const creditLimitValue = Number(vaultData.debtLtv) || 0;
    const creditLimitType = vaultData.creditLimitType || 'percentage';
    
    if (creditLimitType === 'percentage') {
      return (creditLimitValue / 100) * assetValue;
    } else {
      return creditLimitValue;
    }
  };
  
  const creditLimit = getCreditLimit();
  
  // Calcul des valeurs de reserve et hold basé sur leur type
  const getReserveValue = () => {
    if (!isSuperVault) return parseCurrency(vaultData.reserve);
    
    const reserveType = vaultData.reserve_type || 'amount';
    if (reserveType === 'percentage') {
      return (parseCurrency(vaultData.reserve) / 100) * creditLimit;
    }
    return parseCurrency(vaultData.reserve);
  };
  
  const getHoldValue = () => {
    if (!isSuperVault) return parseCurrency(vaultData.hold);
    
    const holdType = vaultData.hold_type || 'amount';
    if (holdType === 'percentage') {
      return (parseCurrency(vaultData.hold) / 100) * creditLimit;
    }
    return parseCurrency(vaultData.hold);
  };
  
  const reserveValue = getReserveValue();
  const holdValue = getHoldValue();
  const debtBalance = parseCurrency(vaultData.debtBalance);
  const availableToLend = Math.max(0, creditLimit - reserveValue - holdValue - debtBalance);
  const cashValue = Number(vaultData.amount) || 0;
  const equity = cashValue - debtBalance;

  const tabs = [
    { 
      id: 'summary', 
      label: 'Summary',
      icon: <SummaryIcon />
    },
    { 
      id: 'instructions', 
      label: 'Instructions',
      icon: <InstructionsIcon />
    }
  ];

  return (
    <div style={{
      width: 488,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      alignItems: 'center',
      padding: '0 0 32px 0',
    }}>
      {/* Header */}
      <div style={{
        alignItems: 'center',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '32px 24px 16px',
        width: '100%',
        marginBottom: '2rem'
      }}>
        <div style={{
          color: '#0d1728',
          fontFamily: 'var(--headings-h3-font-family)',
          fontSize: 'var(--headings-h3-font-size)',
          fontWeight: 'var(--headings-h3-font-weight)',
          textAlign: 'center',
        }}>{vaultName}</div>
        <div style={{
          color: '#595959',
          fontFamily: 'var(--body-text-body-2-regular-font-family)',
          fontSize: 'var(--body-text-body-2-regular-font-size)',
        }}>{isSuperVault ? 'Super vault' : 'Cash vault'}</div>
      </div>
      {/* Tabs */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: 0
      }}>
        <div style={{ minWidth: 320 }}>
          <TabNavigation
            tabs={tabs}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
            className="vault-confirm-tabs"
          />
        </div>
      </div>
      {/* Content */}
      {activeTab === 'summary' ? (
        isSuperVault ? (
          // Résumé Super Vault avec sections Accounts et Equity
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Section commune avec Hold/Reserve pour Super Vault (même format que Cash Vault) */}
            <div style={{
              width: '100%',
              background: '#fbfbfd',
              borderRadius: 8,
              boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
              border: '1px solid #dfdfe6',
              padding: 32,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 24 }}>${availableToLend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Available to lend</div>
              <div style={{ height: 1, background: '#eeeef2', width: 200, margin: '16px 0' }} />
              <div style={{ paddingLeft: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#297598', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>
                    <HelpTooltip 
                      term="Credit limit" 
                      definition="refers to this vault's line of credit. It's the amount of money that your lender has given you access to."
                    >
                      Credit limit
                    </HelpTooltip>
                  </div>
                  <div style={{ color: '#595959' }}>${creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#b49d47', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>
                    <HelpTooltip 
                      term="Hold" 
                      definition="is a restriction on your vault. It's an amount of money that you might set aside for other uses."
                    >
                      <DottedUnderline color="#8FA7DE">Hold</DottedUnderline>
                    </HelpTooltip>
                  </div>
                  <div style={{ color: '#595959' }}>-${holdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#ff7f50', borderRadius: 5, marginRight: 8 }} /> 
                  <div style={{ color: '#595959', flex: 1 }}>
                    <HelpTooltip 
                      term="Reserve" 
                      definition="are extra money for emergencies. They protect you from volatility, which may occur in lending or the market."
                    >
                      <DottedUnderline color="#8FA7DE">Safety buffer</DottedUnderline>
                    </HelpTooltip>
                  </div>
                  <div style={{ color: '#595959' }}>-${reserveValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#595959', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#595959', flex: 1 }}>
                    <HelpTooltip 
                      term="Outstanding balance" 
                      definition="is the amount owed on the line of credit."
                    >
                      LOC outstanding balance
                    </HelpTooltip>
                  </div>
                  <div style={{ color: '#595959', position: 'relative' }}>
                    -${debtBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <div style={{
                      position: 'absolute',
                      bottom: '-12px',
                      left: '0',
                      height: '1px',
                      backgroundColor: '#0d1728',
                      width: '120%'
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
                  <div style={{ width: 10, height: 10, background: '#00b5ae', borderRadius: 5, marginRight: 8 }} />
                  <div style={{ color: '#0d1728', fontWeight: 700, flex: 1 }}>Available to lend</div>
                  <div style={{ color: '#0d1728', fontWeight: 700 }}>
                    ${availableToLend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
            {/* Section Accounts */}
            <div style={{
              background: '#fbfbfd',
              borderRadius: 8,
              boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
              border: '1px solid #dfdfe6',
              padding: 24,
            }}>
              <div style={{ color: '#595959', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Accounts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                 {/* Cash Value */}
                 <div style={{
                   background: '#fff',
                   border: '1px solid #00b5ae',
                   borderRadius: 8,
                   padding: 16,
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                 }}>
                   <div style={{ textAlign: 'left' }}>
                     <div style={{ fontWeight: 600, marginBottom: 4 }}>Cash Value</div>
                     <div style={{ color: '#595959', fontSize: 14 }}>Asset</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                         <span style={{ color: '#00B5AE', fontSize: '16px', fontWeight: '700', lineHeight: '1' }}>~</span>
                         <div style={{ color: '#00B5AE', fontWeight: 700, fontSize: 18 }}>{appreciation}</div>
                       </div>
                       <div style={{ color: '#595959', fontSize: 14, marginTop: 2 }}>Appreciation</div>
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 18 }}>${cashValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                   </div>
                 </div>
                                 {/* Line-of-Credit */}
                 <div style={{
                   background: '#fff',
                   border: '1px solid #00b5ae',
                   borderRadius: 8,
                   padding: 16,
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                 }}>
                   <div style={{ textAlign: 'left' }}>
                     <div style={{ fontWeight: 600, marginBottom: 4 }}>Line-of-Credit</div>
                     <div style={{ color: '#595959', fontSize: 14 }}>Strategic debt</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                         <span style={{ color: '#00B5AE', fontSize: '16px', fontWeight: '700', lineHeight: '1' }}>~</span>
                         <div style={{ color: '#00B5AE', fontWeight: 700, fontSize: 18 }}>{vaultData.debtCeilingRate || '0.00%'}</div>
                       </div>
                       <div style={{ color: '#595959', fontSize: 14, marginTop: 2 }}>Interest rate</div>
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 18 }}>${debtBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                   </div>
                 </div>
              </div>
            </div>
            {/* Section Equity */}
            <div style={{
              background: '#fbfbfd',
              borderRadius: 8,
              boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
              border: '1px solid #dfdfe6',
              padding: 24,
            }}>
              <div style={{ color: '#595959', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Equity</div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ color: '#595959', fontSize: 14 }}>Equity</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#595959' }}>Cash Value</div>
                  <div style={{ color: '#0d1728', fontWeight: 600 }}>${cashValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#595959' }}>Line of credit</div>
                  <div style={{ color: '#0d1728', fontWeight: 600 }}>-${debtBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ height: 1, background: '#eeeef2', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#0d1728', fontWeight: 700 }}>Equity</div>
                  <div style={{ color: '#0d1728', fontWeight: 700 }}>${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Résumé Cash Vault (déjà existant)
          <div style={{
            width: '100%',
            background: '#fbfbfd',
            borderRadius: 8,
            boxShadow: 'var(--grey-shadows-tertiary-grey-shadow)',
            border: '1px solid #dfdfe6',
            padding: 32,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ color: '#0d1728', fontWeight: 700, fontSize: 24 }}>${Number(vaultData.amount ?? vaultData.balance ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0)}</div>
            </div>
            <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>Available to lend</div>
            <div style={{ height: 1, background: '#eeeef2', width: 200, margin: '16px 0' }} />
            <div style={{ paddingLeft: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#297598', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#595959', flex: 1 }}>
                  <HelpTooltip 
                    term="Balance" 
                    definition="is the current amount of money in your vault, reflecting all credits and debits. It includes the amounts set aside as reserves and holds, as well as the available funds after accounting for all transactions."
                  >
                    Balance
                  </HelpTooltip>
                </div>
                <div style={{ color: '#595959' }}>${vaultData.amount || vaultData.balance || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#b49d47', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#595959', flex: 1 }}>
                  <HelpTooltip 
                    term="Hold" 
                    definition="is a restriction on your vault. It's an amount of money that you might set aside for other uses."
                  >
                    <DottedUnderline color="#8FA7DE">Hold</DottedUnderline>
                  </HelpTooltip>
                </div>
                <div style={{ color: '#595959' }}>-${vaultData.hold || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeef2', padding: '12px 16px' }}>
                <div style={{ width: 10, height: 10, background: '#ff7f50', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#595959', flex: 1 }}>
                  <HelpTooltip 
                    term="Reserve" 
                    definition="are extra money for emergencies. They protect you from volatility, which may occur in lending or the market."
                  >
                    <DottedUnderline color="#8FA7DE">Reserve</DottedUnderline>
                  </HelpTooltip>
                </div>
                <div style={{ color: '#595959' }}>-${vaultData.reserve || 0}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', position: 'relative' }}>
                <div style={{ width: 10, height: 10, background: '#00b5ae', borderRadius: 5, marginRight: 8 }} />
                <div style={{ color: '#0d1728', fontWeight: 700, flex: 1 }}>Available to lend</div>
                <div style={{ color: '#0d1728', fontWeight: 700, position: 'relative' }}>
                  ${Number(vaultData.amount ?? vaultData.balance ?? 0) - (Number(vaultData.reserve) || 0) - (Number(vaultData.hold) || 0)}
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '0',
                    right: '0',
                    height: '1px',
                    backgroundColor: '#0d1728',
                    width: '100%'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div style={{
          width: '100%',
          background: '#fbfbfd',
          border: '1px solid #eeeef2',
          borderRadius: 8,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* Setup */}
          <div style={{
            paddingBottom: 12,
            marginBottom: 12,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: 16,
                color: '#595959'
              }}>Setup:</div>
            </div>
            <div style={{ 
              color: '#000000', 
              marginBottom: 4,
              fontWeight: 400,
              fontSize: 14
            }}>
              • Open a {accountTypeLabel} account at your local bank.
            </div>
            <div style={{ 
              color: '#000000',
              fontWeight: 400,
              fontSize: 14
            }}>
              • Dedicate this account to the bank. This will make it easy to review the ledger and reconcile activity in the bank.
            </div>
          </div>
          {/* Reconcile */}
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 8,
              color: '#595959'
            }}>Reconcile</div>
            <div style={{ 
              color: '#000000',
              fontWeight: 400,
              fontSize: 14
            }}>
              • Schedule time every month to reconcile this vault's activity with your bank statement.
            </div>
          </div>
        </div>
      )}
      {/* Account section : visible seulement sur Summary et pour Cash Vault */}
      {activeTab === 'summary' && !isSuperVault && (
        <div style={{ width: '100%' }}>
          <div style={{ color: '#595959', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Account</div>
          <div style={{
            background: '#ffffffa6',
            border: '1px solid #dfdfe6',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
          }}>
            <div style={{ color: '#0d1728', fontWeight: 600 }}>{accountTypeLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#00B5AE', fontSize: '16px', fontWeight: '700', lineHeight: '1' }}>~</span>
                <div style={{ color: '#00B5AE', fontWeight: 700, fontSize: 18 }}>{appreciation}</div>
              </div>
              <div style={{ color: '#595959', fontSize: 14, marginTop: 2 }}>Appreciation</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#000', fontWeight: 700, fontSize: 18 }}>${accountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepConfirm; 