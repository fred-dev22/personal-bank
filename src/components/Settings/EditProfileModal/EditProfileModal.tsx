import React, { useState } from 'react';
import { Modal } from '../../Modal/Modal';
import { Button, Input, CloseButton } from "@jbaluch/components";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import { useAuth } from '../../../contexts/AuthContext';
import { useActivity } from '../../../contexts/ActivityContext';
import './EditProfileModal.css';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open, 
  onClose, 
  onSave 
}) => {
  const { user } = useAuth();
  const { showActivity } = useActivity();
  
  // Split full name into first and last name
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [annualGrossIncome, setAnnualGrossIncome] = useState('');
  const [annualAfterTax, setAnnualAfterTax] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleSave = () => {
    if (!firstName.trim()) {
      showActivity('First name is required');
      return;
    }

    const profileData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      annualGrossIncome,
      annualAfterTax,
      email,
      phone,
      occupation,
      state,
      zipCode,
      photo: selectedPhoto
    };

    if (onSave) {
      onSave(profileData);
    }
    
    showActivity('Profile updated successfully');
    onClose();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="edit-profile-modal">
        <div className="edit-profile__header">
          <h2 className="edit-profile__title">Edit Profile</h2>
          <CloseButton
            aria-label="Close"
            onClick={onClose}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="dark"
            interaction=""
            className="custom-close-button"
          />
        </div>

        <div className="edit-profile__content">
          {/* Photo Upload Section */}
          <div className="edit-profile__photo-section">
            <div className="edit-profile__photo-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                id="photo-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" className="edit-profile__photo-placeholder">
                {selectedPhoto ? (
                  <img src={selectedPhoto} alt="Profile" className="edit-profile__photo-preview" />
                ) : (
                  <div className="edit-profile__photo-text">
                    <div>Click to upload</div>
                    <div>a photo</div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="edit-profile__form">
            {/* Name Row */}
            <div className="edit-profile__input-row">
              <div className="edit-profile__input-group">
                <label className="edit-profile__label">
                  Name <span className="edit-profile__asterisk">*</span>
                </label>
                <Input
                  value={firstName}
                  onChange={(value: string) => setFirstName(value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="edit-profile__input-group">
                <label className="edit-profile__label">
                  Last Name <span className="edit-profile__asterisk">*</span>
                </label>
                <Input
                  value={lastName}
                  onChange={(value: string) => setLastName(value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Income Row */}
            <div className="edit-profile__input-row">
              <div className="edit-profile__input-group">
                <label className="edit-profile__label">Annual Gross Income</label>
                <Input
                  value={annualGrossIncome}
                  onChange={(value: string) => setAnnualGrossIncome(value)}
                  placeholder="$"
                  prefix="$"
                />
              </div>
              <div className="edit-profile__input-group">
                <label className="edit-profile__label">Annual After-Tax</label>
                <Input
                  value={annualAfterTax}
                  onChange={(value: string) => setAnnualAfterTax(value)}
                  placeholder="$"
                  prefix="$"
                />
              </div>
            </div>

            {/* Email */}
            <div className="edit-profile__input-group">
              <label className="edit-profile__label">Account Email</label>
              <Input
                value={email}
                onChange={(value: string) => setEmail(value)}
                placeholder="email@example.com"
                disabled
              />
            </div>

            {/* Phone */}
            <div className="edit-profile__input-group">
              <label className="edit-profile__label">Phone</label>
              <Input
                value={phone}
                onChange={(value: string) => setPhone(value)}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Occupation */}
            <div className="edit-profile__input-group">
              <label className="edit-profile__label">Occupation</label>
              <Input
                value={occupation}
                onChange={(value: string) => setOccupation(value)}
                placeholder="Enter occupation"
              />
            </div>

            {/* State and Zip Code Row */}
            <div className="edit-profile__input-row">
              <div className="edit-profile__input-group">
                <label className="edit-profile__label">State</label>
                <Input
                  value={state}
                  onChange={(value: string) => setState(value)}
                  placeholder="State"
                />
              </div>
              <div className="edit-profile__input-group">
                <label className="edit-profile__label">Zip Code</label>
                <Input
                  value={zipCode}
                  onChange={(value: string) => setZipCode(value)}
                  placeholder="XXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            justified="right"
            onClick={onClose}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="secondary"
            name="cancel"
            form=""
            ariaLabel="Cancel"
            disabled={false}
            size="medium"
            width="106px"
          >
            Cancel
          </Button>
          <Button
            icon="iconless"
            iconComponent={undefined}
            interaction="default"
            justified="right"
            onClick={handleSave}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            type="primary"
            name="save"
            form=""
            ariaLabel="Save"
            disabled={false}
            size="medium"
            width="80px"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 