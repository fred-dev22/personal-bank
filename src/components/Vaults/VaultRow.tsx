import PropTypes from "prop-types";
import React from "react";
import "./style.css";

interface Props {
  state: "default";
  status: "bad" | "good";
  className: any;
}

export const VaultRow = ({ state, status, className }: Props): JSX.Element => {
  return (
    <div className={`vault-row ${className}`}>
      <div className="table-cell">
        <div className="label">
          {status === "bad" && <>Vault ABC</>}

          {status === "good" && <>Gateway 1</>}
        </div>

        {status === "bad" && <div className="text-wrapper">Super vault</div>}
      </div>

      <div className={`metric-tag-wrapper ${status}`}>
        <div className="metric-tag">
          <div className="tag">
            <div className="div">1.43</div>
          </div>
        </div>
      </div>

      <div className="label-wrapper">
        <div className="label-2">5.04%</div>
      </div>

      <div className="div-wrapper">
        <div className={`tag-wrapper status-1-${status}`}>
          <div className="tag-2">
            <div className="label-3">1.43</div>
          </div>
        </div>
      </div>

      <div className="table-cell-2">
        <div className="text-wrapper">$29,000.00</div>
      </div>

      <div className="icon-button-wrapper">
        <div className="icon-button">
          <div className="button">
            <img className="information-circle" alt="Information circle" />
          </div>
        </div>
      </div>
    </div>
  );
};

VaultRow.propTypes = {
  state: PropTypes.oneOf(["default"]),
  status: PropTypes.oneOf(["bad", "good"]),
};