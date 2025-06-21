import React from "react";
import "./ActivityIndicator.css";
import logoImage from "../../assets/logo.png";

interface ActivityIndicatorProps {
  message?: string;
  isVisible?: boolean;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ 
  message = "Coming soon", 
  isVisible = false 
}) => {
  if (!isVisible) return null;

  return (
    <div className="activity-indicator">
      <div className="activity-indicator__content">
        <div className="activity-indicator__left">
          <div className="activity-indicator__logo-group">
            <img src={logoImage} alt="Logo" className="activity-indicator__logo" />
          </div>
          <div className="activity-indicator__message">{message}</div>
        </div>
      </div>
    </div>
  );
}; 