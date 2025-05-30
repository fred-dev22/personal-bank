import React, { useState } from "react";
import { SettingsMenu } from "./SettingsMenu/SettingsMenu";
import { ProfileBox } from "./ProfileBox/ProfileBox";
import { Accessibility } from "./Accessibility/Accessibility";
import { Loans } from "./Loans/Loans";
import { Vaults } from "./Vaults/Vaults";
import { Activity } from "./Activity/Activity";
import "./SettingsMenu/settings-menu.css";

const accountItems = [
  { id: "profile", label: "Profile" },
  { id: "accessibility", label: "Accessibility" }
];

const bankItems = [
  { id: "loans", label: "Loans" },
  { id: "vaults", label: "Vaults" },
  { id: "activity", label: "Activity" }
];

export const Settings: React.FC = () => {
  const [selected, setSelected] = useState("profile");

  const renderContent = () => {
    switch (selected) {
      case "profile":
        return (
          <ProfileBox
            call="/src/assets/icons/call-2.svg"
            className="profile-box-instance"
            headerClassName="profile-box-2"
            img="/src/assets/icons/line-3.svg"
            line="/src/assets/icons/line-2.svg"
            locationOn="/src/assets/icons/location-on-2.svg"
            mailOutline="/src/assets/icons/mail-outline-2.svg"
          />
        );
      case "accessibility":
        return (
          <Accessibility />
        );
      case "loans":
        return <Loans />;
      case "vaults":
        return <Vaults />;
      case "activity":
        return <Activity />;
      default:
        return <div>Settings content</div>;
    }
  };

  return (
    <div className="settings-layout">
      <SettingsMenu
        selected={selected}
        onSelect={setSelected}
        accountItems={accountItems}
        bankItems={bankItems}
      />
      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
}; 