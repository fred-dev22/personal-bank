import React from "react";
import { DottedUnderline } from "../../ui/DottedUnderline";
import { HelpTooltip } from "../../ui/HelpTooltip";
import "./style.css";

interface TermsCardProps {
  amount: number;
  rate: number;
  type: string;
  startDate: string;
  numberOfMonths: number; // Ajout du nombre de mois
  isRecast?: boolean; // Indique si le loan est recasté
  recastDate?: string; // Date du recast
}

export const TermsCard: React.FC<TermsCardProps> = ({ amount, rate, type, startDate, numberOfMonths, isRecast, recastDate }) => {
  
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
                <div className="label-2">
                  <HelpTooltip
                    term="Rate"
                    definition="This is the interest rate of the loan. It is an annual number. The rate and term (length) of the loan are the levers for adjusting its profit."
                    position="top"
                  >
                    <DottedUnderline>Rate</DottedUnderline>
                  </HelpTooltip>
                </div>
              </div>
              <div className="frame-wrapper">
                <div className="label-wrapper">
                  <div className="label-3">{rate.toFixed(2)}%</div>
                </div>
              </div>
            </div>
            <div className="row-3">
              <div className="data-table-row">
                <div className="label-2">
                  <HelpTooltip
                    term="Type"
                    definition="This loan type is amortized: due-date based. Interest accrues daily based on the current loan balance. It accrues through the due date, regardless of when the payment is made."
                    position="top"
                  >
                    <DottedUnderline>Type</DottedUnderline>
                  </HelpTooltip>
                </div>
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
            {isRecast && (
              <div className="row-6">
                <div className="data-table-row">
                  <div className="label-2">Status</div>
                </div>
                <div className="frame-wrapper">
                  <div className="label-wrapper">
                    <div className="label-3 recast-status">
                      <span className="recast-badge">Recast</span>
                      {recastDate && (
                        <span className="recast-date">
                          {new Date(recastDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 