import React, { useState } from "react";
import { Button, Input, DatePicker, TagCell } from "@jbaluch/components";
import { Modal } from "../Modal/Modal";
import type { Activity } from '../../types/types';

interface AddEditActivityProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData?: Partial<Activity> & { vault?: string; account?: string; note?: string };
  onClose: () => void;
  onSubmit: (data: Partial<Activity> & { vault: string; account: string; note: string }) => void;
}

const categories = [
  { value: 'Transfer fee', label: 'Transfer fee' },
  { value: 'Loan funding', label: 'Loan funding' },
  // ... autres catégories possibles
];

const vaults = [
  { value: 'Vault ABC', label: 'Vault ABC' },
  // ... à remplacer par la vraie liste
];

const accounts = [
  { value: 'Line of credit', label: 'Line of credit' },
  // ... à remplacer par la vraie liste
];

export const AddEditActivity: React.FC<AddEditActivityProps> = ({ open, mode, initialData = {}, onClose, onSubmit }) => {
  const [type, setType] = useState<'incoming' | 'outgoing'>(initialData.type === 'incoming' ? 'incoming' : 'outgoing');
  const [category, setCategory] = useState(initialData.tag || 'Transfer fee');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [date, setDate] = useState(initialData.date ? new Date(initialData.date) : new Date());
  const [vault, setVault] = useState(initialData.vault ?? 'Vault ABC');
  const [account, setAccount] = useState(initialData.account ?? 'Line of credit');
  const [note, setNote] = useState(initialData.note ?? '');

  const isEdit = mode === 'edit';

  const handleSubmit = () => {
    onSubmit({
      type,
      tag: category,
      amount: Number(amount),
      date,
      vault,
      account,
      note,
    });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100vh',
    background: '#fff',
  };

  const scrollableContentStyle: React.CSSProperties = {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: '24px',
    minHeight: 0,
  };

  const footerStyle: React.CSSProperties = {
    flex: '0 0 auto',
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f1',
    display: 'flex',
    gap: '16px',
    backgroundColor: '#fff',
  };

  // Modal pour add, panneau latéral pour edit
  const Content = (
    <div style={scrollableContentStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{vault}</div>
          <div style={{ fontSize: 14, color: '#595959' }}>
            <TagCell label={category} emoji="🏷️" size="small" backgroundColor="#f0f0f1" textColor="#595959" severity="info" />
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          ${amount || '0.00'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Button
          iconComponent={undefined}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          name="incoming"
          form=""
          ariaLabel="Incoming"
          type={type === 'incoming' ? 'primary' : 'secondary'}
          onClick={() => setType('incoming')}
          style={{ flex: 1 }}
        >
          Incoming
        </Button>
        <Button
          iconComponent={undefined}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          name="outgoing"
          form=""
          ariaLabel="Outgoing"
          type={type === 'outgoing' ? 'primary' : 'secondary'}
          onClick={() => setType('outgoing')}
          style={{ flex: 1 }}
        >
          Outgoing
        </Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eeeef2', fontSize: 14 }}>
          {categories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Input
          label="Amount"
          value={amount}
          onChange={setAmount}
          type="number"
          required
          style={{ flex: 1 }}
        />
        <DatePicker
          label="Date"
          value={date}
          onChange={setDate}
          required
          errorMessage=""
          minDate={undefined}
          maxDate={undefined}
          style={{ flex: 1 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Vault</label>
          <select value={vault} onChange={e => setVault(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eeeef2', fontSize: 14 }}>
            {vaults.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Account</label>
          <select value={account} onChange={e => setAccount(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eeeef2', fontSize: 14 }}>
            {accounts.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Note</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          style={{ width: '100%', borderRadius: 6, border: '1px solid #eeeef2', padding: 8, fontFamily: 'inherit', fontSize: 14 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input type="checkbox" checked={false} disabled style={{ accentColor: '#b5b5b5' }} />
        <span style={{ color: '#b5b5b5' }}>Apply to loan</span>
      </div>
    </div>
  );

  const Footer = (
    <div style={footerStyle}>
      <Button type="secondary" iconComponent={undefined} onMouseEnter={() => {}} onMouseLeave={() => {}} name="cancel" form="" ariaLabel="Cancel" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
      <Button type="primary" iconComponent={undefined} onMouseEnter={() => {}} onMouseLeave={() => {}} name={isEdit ? 'save' : 'add'} form="" ariaLabel={isEdit ? 'Save' : 'Add'} onClick={handleSubmit} style={{ flex: 1 }}>{isEdit ? 'Save' : 'Add'}</Button>
    </div>
  );

  if (mode === 'add') {
    return (
      <Modal open={open} onClose={onClose}>
        <div style={containerStyle}>
          {Content}
          {Footer}
        </div>
      </Modal>
    );
  }

  // Mode edit : panneau latéral (drawer)
  if (!open) {
    return null;
  }

  return (
    <div style={{ width: 400, minWidth: 400, borderLeft: '1px solid #eeeef2', height: '100vh' }}>
      <div style={containerStyle}>
        {Content}
        {Footer}
      </div>
    </div>
  );
}; 