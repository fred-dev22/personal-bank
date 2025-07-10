import React from "react";
import { CloseButton } from "@jbaluch/components";
import "./HeaderWizard.css";

export const HeaderWizard: React.FC<{
  title: string;
  onExit: () => void;
  showPreview?: boolean;
  onPreview?: () => void;
}> = ({ title, onExit, showPreview, onPreview }) => (
  <div
    style={{
      background: 'transparent',
      borderRadius: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
      marginBottom: 24,
      width: '100%'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
      {showPreview ? (
        <button className="icon-button" onClick={onPreview} style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
          <img src="/nav_arrow_back.svg" alt="Back" style={{ width: 20, height: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#222', marginLeft: 4 }}>Preview</span>
        </button>
      ) : null}
    </div>
    <h2 className="wizard-header-title">{title}</h2>
    <CloseButton
      aria-label="Close"
      onClick={onExit}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
      type="dark"
      interaction=""
      className="edit-vault__close-button"
    />
  </div>
);

export default HeaderWizard; 