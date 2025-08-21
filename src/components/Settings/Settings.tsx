import React, { useState } from "react";
import { SettingsMenu } from "./SettingsMenu/SettingsMenu";
import { ProfileBox } from "./ProfileBox/ProfileBox";
import { Accessibility } from "./Accessibility/Accessibility";
import { Loans } from "./Loans/Loans";
import { Vaults } from "./Vaults/Vaults";
import { Activity } from "./Activity/Activity";
import { EditProfileModal } from "./EditProfileModal/EditProfileModal";
import "./SettingsMenu/settings-menu.css";
import "./Settings.css";
import type { Vault, Loan } from "../../types/types";

const accountItems = [
  { id: "profile", label: "Profile" },
  { id: "accessibility", label: "Accessibility" }
];

const bankItems = [
  { id: "loans", label: "Loans" },
  { id: "vaults", label: "Vaults" },
  { id: "activity", label: "Activity" }
];

interface SettingsProps {
  vaults?: Vault[];
  loans?: Loan[];
  onVaultUpdate?: (updatedVault: Vault) => void;
}

export const Settings: React.FC<SettingsProps> = ({ vaults = [], loans = [], onVaultUpdate }) => {
  const [selected, setSelected] = useState("profile");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleSaveProfile = (profileData: any) => {
    console.log('Profile data to save:', profileData);
    // Here you would typically save the profile data to your backend
    // For now, we'll just close the modal
    setIsEditProfileModalOpen(false);
  };

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
            onEditProfile={handleEditProfile}
          />
        );
      case "accessibility":
        return (
          <Accessibility />
        );
      case "loans":
        return <Loans />;
      case "vaults":
        return <Vaults vaults={vaults} loans={loans} onVaultUpdate={onVaultUpdate} />;
      case "activity":
        return <Activity />;
      default:
        return <div>Settings content</div>;
    }
  };

  return (
    <div className="settings-layout">
      <div className="settings-content">
        <div className="settings-page-title">Settings</div>
        <div className="settings-cards-container">
          <SettingsMenu
            selected={selected}
            onSelect={setSelected}
            accountItems={accountItems}
            bankItems={bankItems}
          />
          <div className="settings-content-wrapper">
            {renderContent()}
          </div>
        </div>
      </div>
      
      <EditProfileModal
        open={isEditProfileModalOpen}
        onClose={handleCloseEditProfileModal}
        onSave={handleSaveProfile}
      />
    </div>
  );
}; 