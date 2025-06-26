import React from "react";
import "./Header.css";

export const Header: React.FC = () => {
  return (
    <div className="activities-header">
      <div className="activities-table-header">
        <div className="activities-label">Name</div>
      </div>
      <div className="activities-label-wrapper">
        <div className="activities-label">Category</div>
      </div>
      <div className="activities-div-wrapper">
        <div className="activities-label">Date</div>
      </div>
      <div className="activities-div">
        <div className="activities-label">Amount</div>
      </div>
    </div>
  );
}; 