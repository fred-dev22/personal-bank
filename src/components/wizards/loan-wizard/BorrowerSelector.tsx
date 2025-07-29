import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from '@jbaluch/components';
import type { Borrower } from '../../../types/types';
import './BorrowerSelector.css';

interface BorrowerSelectorProps {
  borrowers: Borrower[];
  value: string;
  onChange: (borrowerId: string) => void;
  onCreateBorrower: (borrowerData: Partial<Borrower>) => void;
  error?: string;
}

export const BorrowerSelector: React.FC<BorrowerSelectorProps> = ({
  borrowers,
  value,
  onChange,
  onCreateBorrower,
  error
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewBorrowerPopup, setShowNewBorrowerPopup] = useState(false);
  const [filteredBorrowers, setFilteredBorrowers] = useState<Borrower[]>(borrowers);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [autofillStatus, setAutofillStatus] = useState<'off' | 'on' | 'filled'>('off');

  
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize input value from selected borrower
  useEffect(() => {
    console.log('🔍 BorrowerSelector - borrowers:', borrowers);
    if (value && borrowers.length > 0) {
      const borrower = borrowers.find(b => b.id === value);
      if (borrower) {
        console.log('🔍 Found borrower:', borrower);
        // L'API utilise first_name et last_name (avec underscore)
        const fullName = `${borrower.firstName || borrower.first_name || ''} ${borrower.lastName || borrower.last_name || ''}`.trim();
        setInputValue(fullName);
        setSelectedBorrower(borrower);
        setShowNewBorrowerPopup(false); // Fermer le popup si ouvert
      }
    } else if (!value) {
      // Reset state when value is cleared
      setInputValue('');
      setSelectedBorrower(null);
      setShowNewBorrowerPopup(false);
    }
  }, [value, borrowers]);

  // Update filtered borrowers when borrowers list changes
  useEffect(() => {
    setFilteredBorrowers(borrowers);
  }, [borrowers]);

  // Filter borrowers based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = borrowers.filter(borrower => {
        // L'API utilise first_name et last_name (avec underscore)
        const fullName = `${borrower.firstName || borrower.first_name || ''} ${borrower.lastName || borrower.last_name || ''}`.toLowerCase();
        return fullName.includes(inputValue.toLowerCase());
      });
      setFilteredBorrowers(filtered);
    } else {
      setFilteredBorrowers(borrowers);
    }
  }, [inputValue, borrowers]);

  const handleInputChange = (newValue: string) => {
    console.log('handleInputChange called with:', newValue);
    setInputValue(newValue);
    setSelectedBorrower(null);
    setAutofillStatus('off');
    
    // If user clears the input, reset everything
    if (!newValue.trim()) {
      onChange('');
    }
  };

  const handleBorrowerSelect = (borrower: Borrower) => {
    // L'API utilise first_name et last_name (avec underscore)
    const fullName = `${borrower.firstName || borrower.first_name || ''} ${borrower.lastName || borrower.last_name || ''}`.trim();
    console.log('Selecting borrower:', borrower, 'Full name:', fullName);
    setInputValue(fullName);
    setSelectedBorrower(borrower);
    setShowDropdown(false);
    setAutofillStatus('filled');
    onChange(borrower.id);
    console.log('After selection - inputValue should be:', fullName);
  };

  const handleInputBlur = () => {
    // Small delay to allow clicking on dropdown items
    console.log('Input blur triggered');
    setTimeout(() => {
      console.log('Hiding dropdown after blur delay');
      setShowDropdown(false);
      // Reset autofill status if no borrower is selected
      if (!selectedBorrower) {
        setAutofillStatus('off');
      }
    }, 200);
  };

  // Fonction exposée pour vérifier et ouvrir le popup depuis l'extérieur
  const checkAndOpenPopup = () => {
    if (inputValue.trim() && !selectedBorrower && filteredBorrowers.length === 0) {
      setShowNewBorrowerPopup(true);
      return true;
    }
    return false;
  };

  // Fonction pour ouvrir le popup si aucun borrower n'est sélectionné
  const openPopupIfNoBorrower = () => {
    console.log('🔍 openPopupIfNoBorrower called - value:', value, 'selectedBorrower:', selectedBorrower);
    // Forcer l'ouverture du popup si aucun borrower valide n'est sélectionné
    if (!selectedBorrower) {
      console.log('✅ Opening new borrower popup (no valid borrower selected)');
      setShowNewBorrowerPopup(true);
      return true;
    }
    console.log('❌ Not opening popup - borrower already selected');
    return false;
  };

  // Fonction pour forcer l'ouverture du popup (utilisée lors de la redirection)
  const forceOpenPopup = () => {
    console.log('🔍 forceOpenPopup called - forcing popup to open');
    setShowNewBorrowerPopup(true);
    return true;
  };

  // Exposer les fonctions globalement pour que le parent puisse les appeler
  useEffect(() => {
    console.log('🔍 Exposing functions to window - value:', value, 'selectedBorrower:', selectedBorrower);
    (window as unknown as { 
      checkBorrowerPopup: () => boolean;
      openBorrowerPopupIfEmpty: () => boolean;
      forceOpenBorrowerPopup: () => boolean;
      closeBorrowerPopup: () => void;
    }).checkBorrowerPopup = checkAndOpenPopup;
    (window as unknown as { 
      checkBorrowerPopup: () => boolean;
      openBorrowerPopupIfEmpty: () => boolean;
      forceOpenBorrowerPopup: () => boolean;
      closeBorrowerPopup: () => void;
    }).openBorrowerPopupIfEmpty = openPopupIfNoBorrower;
    (window as unknown as { 
      checkBorrowerPopup: () => boolean;
      openBorrowerPopupIfEmpty: () => boolean;
      forceOpenBorrowerPopup: () => boolean;
      closeBorrowerPopup: () => void;
    }).forceOpenBorrowerPopup = forceOpenPopup;
    (window as unknown as { 
      checkBorrowerPopup: () => boolean;
      openBorrowerPopupIfEmpty: () => boolean;
      forceOpenBorrowerPopup: () => boolean;
      closeBorrowerPopup: () => void;
    }).closeBorrowerPopup = closeBorrowerPopup;
    console.log('✅ Functions exposed to window');
  }, [inputValue, selectedBorrower, filteredBorrowers, value]);

  const handleCreateNewBorrower = (borrowerData: Partial<Borrower>) => {
    // Ne pas fermer le popup ici - il sera fermé par le parent après l'API call
    onCreateBorrower(borrowerData);
  };

  // Fonction pour fermer le popup depuis l'extérieur
  const closeBorrowerPopup = () => {
    console.log('🔍 Closing borrower popup from external call');
    setShowNewBorrowerPopup(false);
  };



  return (
    <div className="borrower-selector" ref={inputRef}>
             <div className="borrower-input-container">
         <div style={{ position: 'relative' }}>
           <Input
             label="Borrower"
             placeholder="Type borrower name"
             required
             value={inputValue}
             onChange={handleInputChange}
             onFocus={() => {
               setShowDropdown(true);
               if (!selectedBorrower) {
                 setAutofillStatus('on');
               }
             }}
             onBlur={handleInputBlur}
             error={error}
           />
                       {/* Autofill status indicator - positioned at top right of label */}
            {autofillStatus !== 'off' && (
              <div style={{ 
                position: 'absolute',
                top: '4px',
                right: '0',
                fontSize: '12px', 
                color: autofillStatus === 'filled' ? '#ffffff' : '#ffffff',
                fontWeight: '500',
                backgroundColor: autofillStatus === 'filled' ? '#274684' : '#274684',
                padding: '2px 8px',
                borderRadius: '4px',
                zIndex: 1
              }}>
                {autofillStatus === 'filled' ? 'Autofilled ✓' : 'Autofill On'}
              </div>
            )}
         </div>
       </div>

      {showDropdown && filteredBorrowers.length > 0 && (
                 <div className="borrower-dropdown" ref={dropdownRef}>
                     {filteredBorrowers.map(borrower => (
             <div
               key={borrower.id}
               className="borrower-option"
               onMouseDown={(e) => {
                 e.preventDefault(); // Prevent input blur
                 handleBorrowerSelect(borrower);
               }}
               style={{ 
                 cursor: 'pointer', 
                 padding: '5px', 
                 border: 'none',
                 borderBottom: '1px solid #f0f0f0',
                 fontSize: '12px',
                 color: '#666',
                 textAlign: 'left',
                 transition: 'background-color 0.2s ease',
                 backgroundColor: 'transparent',
                 width: '100%'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#f5f5f5';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'transparent';
               }}
             >
               <div className="borrower-name">
                 {borrower.firstName || borrower.first_name || ''} {borrower.lastName || borrower.last_name || ''}
               </div>
             </div>
           ))}
        </div>
      )}

      {showNewBorrowerPopup && (
        <NewBorrowerPopup
          suggestedName={inputValue}
          onClose={() => setShowNewBorrowerPopup(false)}
          onCreate={handleCreateNewBorrower}
        />
      )}
    </div>
  );
};

// Popup component for creating new borrower
const NewBorrowerPopup: React.FC<{
  suggestedName: string;
  onClose: () => void;
  onCreate: (borrowerData: Partial<Borrower>) => void;
}> = ({ suggestedName, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    firstName: suggestedName.split(' ')[0] || '',
    lastName: suggestedName.split(' ').slice(1).join(' ') || '',
    email: '',
    phone: '',
    grossIncome: ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (formData.firstName.trim()) {
      onCreate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        grossIncome: formData.grossIncome || undefined
      });
    }
  };

  return (
    <div className="new-borrower-popup-overlay">
      <div className="new-borrower-popup">
        <h3>New Borrower Detected</h3>
        <p>We can't find <strong>{suggestedName}</strong> in your list of borrowers. Do you want to add them?</p>
        
                 <div className="borrower-form">
           {/* Image upload section */}
                       <div className="form-row">
              <div className="borrower-form-group">
                <div className="image-upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  <div className="image-placeholder" onClick={handleImageClick}>
                    {selectedImage ? (
                      <img src={selectedImage} alt="Selected" />
                    ) : (
                      <span>Click to upload a photo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
           
           <div className="form-row">
             <div className="borrower-form-group">
               <Input
                 label="First Name"
                 placeholder="First name"
                 required
                 value={formData.firstName}
                 onChange={(value: string) => setFormData({ ...formData, firstName: value })}
               />
             </div>
             <div className="borrower-form-group">
               <Input
                 label="Email"
                 placeholder="name@email.com"
                 value={formData.email}
                 onChange={(value: string) => setFormData({ ...formData, email: value })}
               />
             </div>
           </div>
           
           <div className="form-row">
             <div className="borrower-form-group">
               <Input
                 label="Last Name"
                 placeholder="Last name"
                 value={formData.lastName}
                 onChange={(value: string) => setFormData({ ...formData, lastName: value })}
               />
             </div>
             <div className="borrower-form-group">
               <Input
                 label="Phone Number"
                 placeholder="(123) 123-4567"
                 value={formData.phone}
                 onChange={(value: string) => setFormData({ ...formData, phone: value })}
               />
             </div>
           </div>
           
           <div className="form-row">
             <div className="borrower-form-group">
               <Input
                 label="Annual Income"
                 placeholder="$50,000"
                 value={formData.grossIncome}
                 onChange={(value: string) => setFormData({ ...formData, grossIncome: value })}
               />
             </div>
           </div>
        </div>
        
                 <div className="popup-buttons">
           <Button
             icon="iconless"
             iconComponent={undefined}
             interaction="default"
             justified="center"
             name="go-back"
             form=""
             ariaLabel="Go Back"
             onMouseEnter={() => {}}
             onMouseLeave={() => {}}
             type="secondary"
             onClick={onClose}
             style={{ width: '150px', maxWidth: '150px', minWidth: '150px', height: '40px', fontSize: '16px' }}
           >
             Go Back
           </Button>
           <Button
             icon="iconless"
             iconComponent={undefined}
             interaction="default"
             justified="center"
             name="add"
             form=""
             ariaLabel="Add"
             onMouseEnter={() => {}}
             onMouseLeave={() => {}}
             type="primary"
             onClick={handleSubmit}
             style={{ width: '150px', maxWidth: '150px', minWidth: '150px', height: '40px', fontSize: '16px' }}
           >
             Add
           </Button>
         </div>
      </div>
    </div>
  );
}; 