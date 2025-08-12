import React from "react";
import "./style.css";
import { DottedUnderline } from "../../ui/DottedUnderline";
import checkIcon from "../../../assets/Wavy_Check.svg";

type DscrStatus = "no-DSCR" | "bad" | "mediocre" | "good";

interface IncomeDscrCardProps {
  status: DscrStatus;
  className?: string;
}

export const IncomeDscrCard: React.FC<IncomeDscrCardProps> = ({
  status,
  className = "",
}) => {
  const getDscrValue = () => {
    switch (status) {
      case "mediocre":
        return "1.43";
      case "bad":
        return "0.93";
      case "good":
        return "1.50";
      case "no-DSCR":
        return "n/a";
    }
  };

  const getMessage = () => {
    switch (status) {
      case "mediocre":
        return "This is making less money than your target.";
      case "bad":
        return "This loan is losing money.";
      case "good":
        return "This loan is gaining money.";
      case "no-DSCR":
        return "This loan was funded with a Cash Vault.";
    }
  };

  const getDescription = () => {
    switch (status) {
      case "mediocre":
        return "The Income Debt Service Coverage Ratio shows if you're profiting from debt. This loan's ratio is less than your minimum earnings limit.";
      case "bad":
        return "The Income Debt Service Coverage Ratio shows if you're profiting from debt. This loan's cost of lending is more than the earnings.";
      case "good":
        return "Each payment makes much more money than it's costing to lend. It also exceeds your minimum earning limit.";
      case "no-DSCR":
        return "DSCR applies to Super Vaults. They use debt to fund loans. The earnings of this loan will be eroded by inflation.";
    }
  };

  return (
    <div className={`income-DSCR-card ${className}`}>
      <div className="frame">
        <div className="frame-wrapper">
          <div className="frame-2">
            <div className={`frame-3 ${status}`}>
              <img src={checkIcon} alt="Check" className="check-icon" />
              <div className="title">{getDscrValue()}</div>
            </div>
          </div>
        </div>

        <div className="title-section">
          <DottedUnderline>Income DSCR</DottedUnderline>
        </div>

        <div className={`income-DSCR property-1-${status}`}>
          <div className="overlap-group">
            <div className="bottom">
              <div className="element-3">1.0</div>
              <div className="text-wrapper-3">1.50</div>
            </div>
          </div>
        </div>
      </div>

      <div className="description">
        <div className="message">
          <p className="p">{getMessage()}</p>
        </div>

        <div className="the-income-debt">
          <p className="p">{getDescription()}</p>
        </div>
      </div>
    </div>
  );
}; 