import React from "react";
import "./style.css";

interface TermsCardProps {
  amount: number;
  rate: number;
  type: string;
  startDate: string;
  numberOfMonths: number; // Ajout du nombre de mois
}

export const TermsCard: React.FC<TermsCardProps> = ({ amount, rate, type, startDate, numberOfMonths }) => {
  
  // Fonction pour calculer la payoff date en ajoutant les mois au start date
  const calculatePayoffDate = (startDate: string, numberOfMonths: number) => {
    if (!startDate || !numberOfMonths) return "Not set";
    
    try {
      // Parser la date de départ (format YYYY-MM-DD)
      const [year, month, day] = startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day); // month - 1 car les mois commencent à 0
      
      // Vérifier si la date de départ est valide
      if (isNaN(start.getTime())) {
        return "Invalid start date";
      }
      
      // Calculer la payoff date en ajoutant les mois
      const payoff = new Date(start);
      payoff.setMonth(payoff.getMonth() + numberOfMonths);
      
      // Formater la date
      const formattedDate = payoff.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return formattedDate;
    } catch (error) {
      console.error('Error calculating payoff date:', error);
      return "Invalid date";
    }
  };

  // Fonction pour formater la start date pour l'affichage
  const formatStartDate = (startDate: string) => {
    if (!startDate) return "Not set";
    
    try {
      const [year, month, day] = startDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return startDate; // Retourner la date originale si le formatage échoue
    }
  };

  // Calculer la payoff date
  const payoffDate = calculatePayoffDate(startDate, numberOfMonths);
  const formattedStartDate = formatStartDate(startDate);

  return (
    <div className="terms-card">
      <div className="card">
        <div className="frame">
          <div className="frame-2">
            <div className="title-3">Terms</div>
            <div className="text-wrapper-2">Never recasted</div>
          </div>
          <div className="rectangle" />
          <div className="static-table">
            <div className="row">
              <div className="data-table-row">
                <div className="label-2">Amount</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
            <div className="row-2">
              <div className="data-table-row">
                <div className="label-2">Rate</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{rate.toFixed(2)}%</div>
                </div>
              </div>
            </div>
            <div className="row-3">
              <div className="data-table-row">
                <div className="label-2">Type</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{type}</div>
                </div>
              </div>
            </div>
            <div className="row-4">
              <div className="data-table-row">
                <div className="label-2">Start date</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{formattedStartDate}</div>
                </div>
              </div>
            </div>
            <div className="row-5">
              <div className="data-table-row">
                <div className="label-2">Payoff date</div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{payoffDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 