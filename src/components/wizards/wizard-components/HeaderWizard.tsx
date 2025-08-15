import React from "react";
import { CloseButton, IconButton } from "@jbaluch/components";
import "./HeaderWizard.css";

export const HeaderWizard: React.FC<{
  title: string;
  onExit: () => void;
  showPreview?: boolean;
  onPreview?: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}> = ({ title, onExit, showPreview, onPreview, onPrevious, showPrevious }) => (
  <div
    style={{
      background: 'transparent',
      borderRadius: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
      marginBottom: 12,
      width: '100%',
      position: 'relative'
    }}
  >
    {/* Left side - Previous button */}
    <div style={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
      {showPrevious ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
          <IconButton
            aria-label="Previous"
            icon={() => <img src="/nav_arrow_back.svg" alt="Back" style={{ width: 20, height: 20 }} />}
            onClick={onPrevious || (() => {})}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="tertiary"
            notificationCount={0}
            interaction="default"
          />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#222', marginLeft: 4 }}>Previous</span>
        </div>
      ) : showPreview ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
          <IconButton
            aria-label="Previous"
            icon={() => <img src="/nav_arrow_back.svg" alt="Back" style={{ width: 20, height: 20 }} />}
            onClick={onPreview || (() => {})}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="tertiary"
            notificationCount={0}
            interaction="default"
          />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#222', marginLeft: 4 }}>Preview</span>
        </div>
      ) : null}
    </div>
    
    {/* Center - Title */}
    <h2 
      className="wizard-header-title"
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 0
      }}
    >
      {title}
    </h2>
    
    {/* Right side - Close button */}
    <CloseButton
      aria-label="Close"
      onClick={onExit}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
      type="dark"
      interaction=""
      className="custom-close-button"
    />
  </div>
);

export default HeaderWizard; 