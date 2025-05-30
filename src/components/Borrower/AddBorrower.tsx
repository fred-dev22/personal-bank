import React, { useState } from 'react';
import { Button, Input } from '@jbaluch/components';
import './add-borrower.css';

export const AddBorrower: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [netIncome, setNetIncome] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="add-borrower-modal">
      <div className="add-borrower-header-row">
        <h2 className="add-borrower-title">Add Borrower</h2>
      </div>
      <div className="add-borrower-tabs">
        <div className="add-borrower-tab active">General</div>
      </div>
      <div className="add-borrower-content">
        <div className="add-borrower-photo-upload">
          <div className="photo-circle">
            <span>Click to<br/>upload a<br/>photo</span>
          </div>
        </div>
        <form>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              style={{ flex: 1 }}
            />
            <Input
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <Input
              label="Annual Income"
              placeholder="$"
              value={annualIncome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnualIncome(e.target.value)}
              style={{ flex: 1 }}
            />
            <Input
              label="Net Income"
              placeholder="$"
              value={netIncome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNetIncome(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            style={{ marginTop: 8, width: '100%' }}
          />
          <Input
            label="Phone Number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            style={{ marginTop: 8, width: '100%' }}
          />
        </form>
      </div>
      <div className="add-borrower-actions">
        <Button
          type="secondary"
          style={{ width: 'auto' }}
          iconComponent={undefined}
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          interaction="default"
          justified="right"
          name="add-borrower-cancel"
          ariaLabel={undefined}
          form=""
        >
          Cancel
        </Button>
        <Button
          type="primary"
          style={{ width: 'auto' }}
          iconComponent={undefined}
          onClick={() => {}}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          interaction="default"
          justified="right"
          name="add-borrower-create"
          ariaLabel={undefined}
          form=""
        >
          Create
        </Button>
      </div>
    </div>
  );
}; 