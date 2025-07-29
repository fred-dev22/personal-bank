import React from 'react';
import './addBorrower.css';
import { Button, Input, CloseButton } from "@jbaluch/components";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import type { Borrower } from '../../types/types';
import { useActivity } from '../../contexts/ActivityContext';

interface AddBorrowerProps {
  onClose?: () => void;
  onCancel?: () => void;
  onAdd?: (data: Borrower) => void;
  onEdit?: (data: Borrower) => void;
  initialData?: Partial<Borrower>;
  mode?: 'add' | 'edit';
}

export const AddBorrower: React.FC<AddBorrowerProps> = ({ 
  onClose,
  onCancel,
  onAdd,
  onEdit,
  initialData,
  mode = 'add',
}) => {
  const { showActivity, hideActivity } = useActivity();
  
  // Détermination du type par défaut
  const defaultType: 'person' | 'institution' = initialData?.type === 'institution' ? 'institution' : 'person';

  // Découpage du fullName si besoin
  let firstName = initialData?.firstName || '';
  let lastName = initialData?.lastName || '';
  if ((!firstName || !lastName) && initialData?.fullName) {
    const parts = initialData.fullName.trim().split(' ');
    if (parts.length > 1) {
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    } else {
      firstName = initialData.fullName;
      lastName = '';
    }
  }

  const [borrowerType, setBorrowerType] = React.useState<'person' | 'institution'>(defaultType);
  const [formData, setFormData] = React.useState<Partial<Borrower>>({
    firstName,
    lastName,
    grossIncome: initialData?.grossIncome || '',
    netIncome: initialData?.netIncome || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    type: initialData?.type || 'person',
    fullName: initialData?.fullName || '',
    pb: initialData?.pb || '',
    userId: initialData?.userId || '',
    bankId: initialData?.bankId || '',
    notes: initialData?.notes || [],
    totalPayment: initialData?.totalPayment || 0,
    unpaidBalance: initialData?.unpaidBalance || 0,
    website: initialData?.website || ''
  });
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null);

  const handleInputChange = (field: keyof Borrower, value: string | number | string[]): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (): void => {
    // Show activity indicator immediately when button is clicked
    if (mode === 'add') {
      showActivity('Creating borrower...');
    } else if (mode === 'edit') {
      showActivity('Editing borrower...');
    }
    
    if (borrowerType === 'person' && !formData.firstName && !formData.fullName) {
      hideActivity();
      alert('Borrower name is required.');
      return;
    }
    if (borrowerType === 'institution' && !formData.fullName) {
      hideActivity();
      alert('Institution name is required.');
      return;
    }
    const fullName = borrowerType === 'person'
      ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
      : formData.fullName || '';
    const borrowerData = {
      ...formData,
      fullName,
      type: borrowerType,
      photo: selectedPhoto || undefined,
    } as Borrower;
    
    if (mode === 'edit' && onEdit) {
      onEdit(borrowerData);
      hideActivity();
      if (onClose) onClose();
    } else if (mode === 'add' && onAdd) {
      onAdd(borrowerData);
      hideActivity();
      // Nettoyage du formulaire après ajout
      setFormData({
        firstName: '',
        lastName: '',
        grossIncome: '',
        netIncome: '',
        email: '',
        phone: '',
        type: 'person',
        fullName: '',
        pb: '',
        userId: '',
        bankId: '',
        notes: [],
        totalPayment: 0,
        unpaidBalance: 0,
        website: ''
      });
      setSelectedPhoto(null);
      if (onClose) onClose();
    }
  };

  const handleClose = (): void => {
    if (onClose) {
      onClose();
    }
  };

  const handleTypeChange = (type: 'person' | 'institution'): void => {
    setBorrowerType(type);
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handlePhotoChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setSelectedPhoto(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="add-borrower">
      {/* Header */}
      <div className="add-borrower__header">
        <h2 className="add-borrower__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {mode === 'edit' ? 'Edit Borrower' : 'Add Borrower'}
          {borrowerType === 'institution' && (
            <span className="add-borrower__institution-label" style={{ marginLeft: 12 }}>
              <img
                src="/Icon-Institution.svg"
                alt="Institution"
                style={{ width: 20, height: 20, marginRight: 4 }}
              />
              Institution
            </span>
          )}
        </h2>
        <CloseButton
          aria-label="Close"
          onClick={handleClose}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="dark"
          interaction=""
          style={{ width: 36, height: 36 }}
        />
      </div>

      {/* Person/Institution Toggle */}
      <div className="add-borrower__toggle-section">
        <div className="add-borrower__toggle">
          <button
            type="button"
            className={`add-borrower__toggle-item ${borrowerType === 'person' ? 'add-borrower__toggle-item--active' : ''}`}
            onClick={() => handleTypeChange('person')}
          >
            Person
          </button>
          <div className="add-borrower__toggle-divider"></div>
          <button
            type="button"
            className={`add-borrower__toggle-item ${borrowerType === 'institution' ? 'add-borrower__toggle-item--active' : ''}`}
            onClick={() => handleTypeChange('institution')}
          >
            Institution
          </button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="add-borrower__avatar-section">
        {selectedPhoto ? (
          <>
            <div className="add-borrower__avatar" style={{overflow: 'hidden', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src={selectedPhoto} alt="Profile" style={{width: 72, height: 72, borderRadius: '50%', objectFit: 'cover'}} />
            </div>
            <Button
              icon="iconless"
              iconComponent={undefined}
              interaction="default"
              justified="right"
              onClick={handlePhotoChange}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="secondary"
              name="change-photo"
              form=""
              ariaLabel="Change photo"
              width="106px"
            >
              Change Photo
            </Button>
          </>
        ) : (
          <div
            className="add-borrower__avatar"
            style={{cursor: 'pointer', background: '#e9ecef', color: '#23263B', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: '50%', textAlign: 'center', fontSize: 16, fontWeight: 500}}
            onClick={handlePhotoChange}
          >
            Click to<br />Upload a<br />Photo
          </div>
        )}
      </div>

      {/* Form */}
      <div className="add-borrower__form">
        {borrowerType === 'person' ? (
          <>
            {/* First/Last Name Row */}
            <div className="add-borrower__input-group">
              <div className="add-borrower__inputs-row">
                <Input
                  label="First name"
                  onChange={(value: string) => handleInputChange('firstName', value)}
                  placeholder="Enter first name"
                  required
                  value={formData.firstName}
                />
                <Input
                  label="Last name"
                  onChange={(value: string) => handleInputChange('lastName', value)}
                  placeholder="Enter last name"
                  value={formData.lastName}
                />
              </div>
            </div>

            {/* Income Row */}
            <div className="add-borrower__input-group">
              <div className="add-borrower__inputs-row">
                <Input
                  currency={{
                    allowNegative: false,
                    currency: 'USD',
                    formatOnType: false,
                    locale: 'en-US',
                    maxDecimals: 2,
                    thousandSeparator: true
                  }}
                  label="Gross income"
                  onChange={(value: string) => handleInputChange('grossIncome', value)}
                  placeholder="Enter gross income"
                  type="currency"
                  value={formData.grossIncome}
                />
                <Input
                  currency={{
                    allowNegative: false,
                    currency: 'USD',
                    formatOnType: false,
                    locale: 'en-US',
                    maxDecimals: 2,
                    thousandSeparator: true
                  }}
                  label="Net income"
                  onChange={(value: string) => handleInputChange('netIncome', value)}
                  placeholder="Enter net income"
                  type="currency"
                  value={formData.netIncome}
                />
              </div>
            </div>

            {/* Email */}
            <div className="add-borrower__input-group add-borrower__input-group--single">
              <Input
                label="Email"
                onChange={(value: string) => handleInputChange('email', value)}
                placeholder="email@example.com"
                type="email"
                validateOnChange
                value={formData.email}
              />
            </div>

            {/* Phone */}
            <div className="add-borrower__input-group add-borrower__input-group--single">
              <Input
                label="Phone Number"
                onChange={(value: string) => handleInputChange('phone', value)}
                phone={{
                  format: '(###) ###-####',
                  international: false
                }}
                placeholder="(555) 123-4567"
                type="phone"
                value={formData.phone}
              />
            </div>
          </>
        ) : (
          <>
            {/* Institution Form */}
            <div className="add-borrower__input-group add-borrower__input-group--single">
              <Input
                label="Name"
                onChange={(value: string) => handleInputChange('fullName', value)}
                placeholder="Enter institution name"
                required
                value={formData.fullName}
              />
            </div>
            <div className="add-borrower__input-group add-borrower__input-group--single">
              <Input
                label="Website"
                onChange={(value: string) => handleInputChange('website', value)}
                placeholder="www.site.com"
                value={formData.website || ''}
              />
            </div>
          </>
        )}
      </div>
      <div className="modal-footer">
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="right"
          onClick={() => {
            setFormData({
              firstName: '',
              lastName: '',
              grossIncome: '',
              netIncome: '',
              email: '',
              phone: '',
              type: 'person',
              fullName: '',
              pb: '',
              userId: '',
              bankId: '',
              notes: [],
              totalPayment: 0,
              unpaidBalance: 0,
              website: ''
            });
            setSelectedPhoto(null);
            if (onCancel) onCancel();
            if (onClose) onClose();
          }}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="secondary"
          name="cancel"
          form=""
          ariaLabel="Cancel"
          width="106px"
        >
          Cancel
        </Button>
        <Button
          icon="iconless"
          iconComponent={undefined}
          interaction="default"
          justified="right"
          onClick={handleSubmit}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          type="primary"
          name={mode === 'edit' ? 'edit' : 'add'}
          form=""
          ariaLabel={mode === 'edit' ? 'Edit borrower' : 'Add borrower'}
          width="80px"
        >
          {mode === 'edit' ? 'Edit' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default AddBorrower;