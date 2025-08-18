import React from 'react';
import './DSCRCard.css';
import { DottedUnderline } from '../../ui/DottedUnderline';
import checkIcon from '../../../assets/Wavy_Check.svg';

interface DSCRCardProps {
  title: string;
  value: number;
  zone1Label: string;
  zone2Label: string;
  zone3Label: string;
  zone2Value: number;
  zone3Value: number;
  zone1Color: string;
  zone2Color: string;
  zone3Color: string;
  minValue: number;
  maxValue: number;
  percentage: boolean;
  decimalPlaces: boolean;
  hideValue: boolean;
}

export const DSCRCard: React.FC<DSCRCardProps> = ({
  title,
  value,
  zone1Label,
  zone2Label,
  zone3Label,
  zone2Value,
  zone3Value,
  zone1Color,
  zone2Color,
  zone3Color,
  minValue,
  maxValue,
  percentage,
  decimalPlaces,
  hideValue
}) => {
  console.log('DSCRCard rendering:', title, value);
  
  // Fonction pour obtenir le message selon la valeur DSCR
  const getMessage = () => {
    if (hideValue) {
      return "This loan was funded with a Cash Vault.";
    }
    if (value < 1) {
      return "This loan is losing money.";
    } else if (value < 1.25) {
      return "This is making less money than your target.";
    } else {
      return "This loan is gaining money.";
    }
  };

  // Fonction pour obtenir la description selon la valeur DSCR
  const getDescription = () => {
    if (hideValue) {
      return "DSCR applies to Super Vaults. They use debt to fund loans. The earnings of this loan will be eroded by inflation.";
    }
    if (value < 1) {
      return "The Income Debt Service Coverage Ratio shows if you're profiting from debt. This loan's cost of lending is more than the earnings.";
    } else if (value < 1.25) {
      return "The Income Debt Service Coverage Ratio shows if you're profiting from debt. This loan's ratio is less than your minimum earnings limit.";
    } else {
      return "Each payment makes much more money than it's costing to lend. It also exceeds your minimum earning limit.";
    }
  };

  // Calculer la position du marqueur de valeur
  const getValuePosition = () => {
    if (hideValue || value === undefined) return 0;
    
    let displayValue = value;
    if (value < minValue) {
      displayValue = minValue;
    } else if (value > maxValue) {
      displayValue = maxValue;
    }
    
    const percentage = ((displayValue - minValue) / (maxValue - minValue)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // Formater la valeur affichée
  const formatValue = (val: number) => {
    return val.toFixed(decimalPlaces ? 2 : 0) + (percentage ? '%' : '');
  };

  // Choose a header value: show the actual value when available, otherwise fall back to the zone3 marker (e.g., 1.50)
  const headerValue: number = hideValue || value === undefined ? zone3Value : value;

  return (
    <div className="dscr-card">
      <div className="dscr-card-header">
        <div className="dscr-header-top">
          <img src={checkIcon} alt="" className="dscr-icon" />
          <div className="dscr-large-value">{formatValue(headerValue)}</div>
        </div>
        <div className="dscr-title">
          <DottedUnderline>{title}</DottedUnderline>
        </div>
      </div>
      <div className="dscr-card-content">
        <div className="dscr-graph">
          {/* Section des valeurs avec marqueur */}
          <div className="dscr-values">
            {!hideValue && value !== undefined && (
              <div 
                className="dscr-value-marker"
                style={{ left: `${getValuePosition()}%` }}
              >
                <p>{formatValue(value)}</p>
                <svg width="18" height="18" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0 0 L 5 10 L 10 0 z" fill="#000" />
                </svg>
              </div>
            )}
          </div>

          {/* Section des zones */}
          <div className="dscr-zones">
            <div className="dscr-zone dscr-zone-1">
              <div 
                className="dscr-zone-bar"
                style={{ backgroundColor: zone1Color }}
              ></div>
              <p>{zone1Label}</p>
            </div>
            <div className="dscr-zone dscr-zone-2">
              <div 
                className="dscr-zone-bar"
                style={{ backgroundColor: zone2Color }}
              ></div>
              <p>{zone2Label}</p>
            </div>
            <div className="dscr-zone dscr-zone-3">
              <div 
                className="dscr-zone-bar"
                style={{ backgroundColor: zone3Color }}
              ></div>
              <p>{zone3Label}</p>
            </div>
          </div>

          {/* Valeurs aux bordures - séparées des zones */}
          <div className="dscr-border-values">
            <span className="dscr-border-value dscr-border-value-1">{formatValue(minValue)}</span>
            <span className="dscr-border-value dscr-border-value-2">{formatValue(zone2Value)}</span>
            <span className="dscr-border-value dscr-border-value-3">{formatValue(zone3Value)}</span>
          </div>
        </div>

        <div className="dscr-card-description">
          <div className="dscr-message">
            <p>{getMessage()}</p>
          </div>
          <div className="dscr-description">
            <p>{getDescription()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 