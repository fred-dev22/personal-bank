import  { useState } from "react";
import { Button } from "@jbaluch/components";
import "./accessibility.css";

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L10 8L6 4" stroke="#BFC4CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Accessibility = () => {
  const [showPlusMinus, setShowPlusMinus] = useState(false);
  const [accessibleColors, setAccessibleColors] = useState(false);

  return (
    <div className="accessibility-root">
      <div className="accessibility-title">Accessibility</div>
      <div className="accessibility-row">
        <span className="accessibility-label">Display activities with + and –</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={showPlusMinus}
            onChange={() => setShowPlusMinus(v => !v)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="accessibility-row">
        <span className="accessibility-label">Accessible colors</span>
        <Button
          icon="iconless"
          iconComponent={<ChevronRight />}
          interaction="default"
          justified="right"
          onClick={() => setAccessibleColors(v => !v)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          className="accessibility-btn"
          name="accessible-colors"
          form=""
          ariaLabel="Toggle accessible colors"
          disabled={false}
          size="medium"
        >
          {accessibleColors ? "On" : "Off"}
        </Button>
      </div>
    </div>
  );
}; 