import React, { useState, useEffect } from "react";
import { Button, Input, CloseButton, DatePicker } from "@jbaluch/components";
import './EditLoan.css';
import { updateLoan } from '../../controllers/loanController';
import { useActivity } from '../../contexts/ActivityContext';
import type { Loan } from '../../types/types';

interface UIFormFields {
  lateFee?: string;
  gracePeriod?: string;
  paymentDue?: string | Date | null;
}

interface EditLoanProps {
  onClose: () => void;
  initialData?: Partial<Loan> & UIFormFields;
  env: string;
  onSave?: (data: Partial<Loan>) => void;
  onRecastLoan?: (loan: Loan) => void;
  onDeleteLoan?: (loan: Partial<Loan>) => void;
}

interface FormData {
  nickname: string;
  dscr_limit: number;
  // UI-only fields
  lateFee: string;
  gracePeriod: string;
  paymentDue: Date | null;
}

export const EditLoan: React.FC<EditLoanProps> = ({ onClose, initialData = {}, onSave, env, onRecastLoan, onDeleteLoan }) => {
  const { showActivity, hideActivity } = useActivity();
  const [form, setForm] = useState<FormData>({
    nickname: initialData.nickname || '',
    dscr_limit: initialData.dscr_limit || 1.50,
    lateFee: initialData.lateFee || '$5.00',
    gracePeriod: initialData.gracePeriod || '10 days',
    paymentDue: initialData.paymentDue ? (() => {
      const date = new Date(initialData.paymentDue);
      return isNaN(date.getTime()) ? new Date() : date;
    })() : new Date(),
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mettre à jour le formulaire quand initialData change
  useEffect(() => {
    if (initialData) {
      setForm({
        nickname: initialData.nickname || '',
        dscr_limit: initialData.dscr_limit || 1.50,
        lateFee: initialData.lateFee || '$5.00',
        gracePeriod: initialData.gracePeriod || '10 days',
        paymentDue: initialData.paymentDue ? (() => {
          const date = new Date(initialData.paymentDue);
          return isNaN(date.getTime()) ? new Date() : date;
        })() : new Date(),
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof FormData, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    // Show activity indicator immediately when button is clicked
    showActivity('Editing loan...');
    
    const token = localStorage.getItem('authToken');
    console.log('handleSave called', { env, noteId: initialData?.note_id, token, form });
    if (!token) {
      console.log('No token found');
      hideActivity();
      onClose();
      return;
    }
    if (!initialData?.note_id) {
      console.log('No note_id found in initialData');
      hideActivity();
      onClose();
      return;
    }
    try {
      console.log('Calling updateLoan...');
      await updateLoan(
        token,
        initialData.note_id,
        {
          ...initialData,
          nickname: form.nickname,
          dscr_limit: Number(form.dscr_limit)
        }
      );
      console.log('updateLoan success');
      hideActivity();
      if (onSave) onSave(form);
      onClose();
    } catch (e) {
      console.log('updateLoan error', e);
      hideActivity();
      onClose();
    }
  };

  const handleDeleteLoan = () => {
    if (onDeleteLoan) {
      onDeleteLoan(initialData);
    }
    onClose();
  };



  // No custom calendar popover; using DatePicker from the component library

  return (
    <div className="edit-loan-modal">
      <div className="edit-loan__scrollable">
        <div className="edit-loan__header">
          <h2 className="edit-loan__title">Edit Loan</h2>
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
        <div className="edit-loan__form-block">
          <div className="edit-loan__input-group">
            <label className="edit-loan__label"><span className="edit-loan__asterisk">*</span> Loan Name</label>
            <Input
              value={form.nickname}
              onChange={(v: string) => handleChange('nickname', v)}
              placeholder="Enter loan name"
            />
          </div>
          <div className="edit-loan__input-group-row">
            <div className="edit-loan__input-group">
              <label className="edit-loan__label"><span className="edit-loan__asterisk">*</span> Late fee</label>
              <Input
                value={form.lateFee}
                onChange={(v: string) => handleChange('lateFee', v)}
                placeholder="$5.00"
                style={{ flex: 1 }}
              />
            </div>
            <div className="edit-loan__input-group">
              <label className="edit-loan__label"><span className="edit-loan__asterisk">*</span> Grace period</label>
              <Input
                value={form.gracePeriod}
                onChange={(v: string) => handleChange('gracePeriod', v)}
                placeholder="10 days"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div className="edit-loan__input-group">
            <label className="edit-loan__label"><span className="edit-loan__asterisk">*</span> Target income DSCR</label>
            <Input
              value={form.dscr_limit.toString()}
              onChange={(v: string) => handleChange('dscr_limit', v)}
              placeholder="1.50"
            />
          </div>
          <div className="edit-loan__input-group">
            <label className="edit-loan__label">Payment due</label>
            <DatePicker
              value={form.paymentDue}
              onChange={(date: Date) => setForm(f => ({ ...f, paymentDue: date }))}
              required
              errorMessage=""
              minDate={undefined}
              maxDate={undefined}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="edit-loan__change-terms">
          <div className="change-terms__row">
            <div className="change-terms__col">
              <span className="change-terms__title">Change Terms</span>
              <div className="change-terms__message">Adjust the payments, improve DSCR.</div>
            </div>
            <Button
              icon="iconless"
              interaction="default"
              justified="right"
              onClick={() => onRecastLoan && onRecastLoan(initialData as Loan)}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              type="secondary"
              style={{ width: 115 }}
              iconComponent={undefined}
              name="change"
              form=""
              ariaLabel="Change"
            >
              Change
            </Button>
          </div>
        </div>
        {/* Delete Loan section */}
        <div className="edit-loan__delete-loan">
          {!showDeleteConfirm ? (
            <div className="delete-loan__row">
              <div className="delete-loan__col">
                <span className="delete-loan__title">Delete Loan</span>
                <div className="delete-loan__message">The loan is canceled. Funds are returned to the bank. All loan data is eliminated.</div>
              </div>
              <Button
                icon="iconless"
                interaction="default"
                justified="right"
                onClick={() => setShowDeleteConfirm(true)}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                type="secondary"
                style={{ width: 115 }}
                className="delete-loan-button"
                iconComponent={undefined}
                name="delete"
                form=""
                ariaLabel="Delete"
              >
                Delete
              </Button>
            </div>
          ) : (
            <div className="delete-loan__confirm-inline">
              <div className="delete-loan__confirm-message">
                Are you sure you want to delete this loan? This action cannot be undone.
              </div>
              <div className="delete-loan__confirm-buttons">
                <Button
                  icon="iconless"
                  interaction="default"
                  onClick={() => setShowDeleteConfirm(false)}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="secondary"
                  name="cancel"
                  form=""
                  ariaLabel="Cancel"
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button
                  icon="iconless"
                  interaction="default"
                  onClick={handleDeleteLoan}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  type="primary"
                  name="confirm"
                  form=""
                  ariaLabel="Confirm Delete"
                  style={{ 
                    backgroundColor: '#dc3545', 
                    border: '1px solid #dc3545',
                    color: '#fff'
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer sticky */}
      <div className="edit-loan__footer">
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
          style={{ width: 106 }}
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
          style={{ width: 80 }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}; 