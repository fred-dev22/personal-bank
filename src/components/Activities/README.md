# Generic AddEditActivity Component

This component provides a **single, reusable modal** for adding and editing activities throughout the entire application. It follows the principle of **"don't create more than necessary"** by being configurable for different contexts.

## 🎯 Key Features

- **One component for all activity types** (vault, loan, general, payment, etc.)
- **Context-aware** - adapts based on where it's used
- **Configurable fields** - show/hide fields based on context
- **Generic categories** - works with any activity category
- **Consistent UI** - same look and feel everywhere

## 🚀 Quick Start

```tsx
import { AddEditActivity } from './AddEditActivity';
import { createVaultActivityConfig } from './activityConfigs';

// In your component
const [showModal, setShowModal] = useState(false);
const config = createVaultActivityConfig(vault, allVaults, allLoans, accounts);

<AddEditActivity
  open={showModal}
  mode="add"
  config={config}
  onClose={() => setShowModal(false)}
  onSubmit={(data) => {
    console.log('Activity data:', data);
    setShowModal(false);
  }}
/>
```

## 📋 Configuration Options

The component uses an `ActivityConfig` object to determine its behavior:

```tsx
interface ActivityConfig {
  context: 'vault' | 'loan' | 'general';
  contextId?: string;
  contextName?: string;
  availableCategories: Array<{ value: string; label: string; emoji?: string }>;
  availableVaults?: Array<{ value: string; label: string }>;
  availableAccounts?: Array<{ value: string; label: string }>;
  availableLoans?: Array<{ value: string; label: string }>;
  showVaultField?: boolean;
  showAccountField?: boolean;
  showLoanField?: boolean;
  showApplyToLoan?: boolean;
  defaultCategory?: string;
  defaultVault?: string;
  defaultAccount?: string;
}
```

## 🛠️ Pre-built Configurations

### 1. Vault Activity
```tsx
import { createVaultActivityConfig } from './activityConfigs';

const config = createVaultActivityConfig(vault, allVaults, allLoans, accounts);
// Shows: Vault field, Account field, Loan field, Apply to loan checkbox
// Categories: Vault-specific + General categories
```

### 2. Loan Activity
```tsx
import { createLoanActivityConfig } from './activityConfigs';

const config = createLoanActivityConfig(loan, allVaults, allLoans, accounts);
// Shows: Vault field, Account field, Loan field, Apply to loan checkbox
// Categories: Loan-specific + Payment + General categories
```

### 3. General Activity
```tsx
import { createGeneralActivityConfig } from './activityConfigs';

const config = createGeneralActivityConfig(allVaults, allLoans, accounts);
// Shows: Vault field, Account field
// Categories: General + Payment categories
```

### 4. Simple Vault Activity
```tsx
import { createSimpleVaultConfig } from './activityConfigs';

const config = createSimpleVaultConfig(vault, accounts);
// Shows: Account field only (vault is pre-selected)
// Categories: Vault-specific categories only
```

## 🎨 Available Categories

The component comes with predefined categories for different contexts:

### General Categories
- 💰 Income
- 💸 Expense  
- 🔄 Transfer
- 📈 Investment

### Loan Categories
- 🏦 Loan Funding
- 💳 Loan Payment
- 📊 Interest Payment
- 📋 Principal Payment
- ⚠️ Late Fee
- 💱 Transfer Fee

### Vault Categories
- 🏛️ Vault Contribution
- 📤 Vault Withdrawal
- 🔄 Vault Transfer
- 💸 Vault Fee
- 💰 Vault Income

### Payment Categories
- ✅ Payment Received
- 📤 Payment Sent
- 💸 Payment Fee

## 📝 Usage Examples

### In Vault Details Page
```tsx
const VaultDetailsPage = ({ vault, vaults, loans, accounts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const config = createVaultActivityConfig(vault, vaults, loans, accounts);

  return (
    <div>
      <button onClick={() => setShowAddModal(true)}>Add Activity</button>
      
      <AddEditActivity
        open={showAddModal}
        mode="add"
        config={config}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
```

### In Loan Details Page
```tsx
const LoanDetailsPage = ({ loan, vaults, loans, accounts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const config = createLoanActivityConfig(loan, vaults, loans, accounts);

  return (
    <div>
      <button onClick={() => setShowAddModal(true)}>Add Activity</button>
      
      <AddEditActivity
        open={showAddModal}
        mode="add"
        config={config}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
```

### Edit Existing Activity
```tsx
const EditActivity = ({ activity, vaults, loans, accounts }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const config = createGeneralActivityConfig(vaults, loans, accounts);

  return (
    <AddEditActivity
      open={showEditModal}
      mode="edit"
      config={config}
      initialData={activity}
      onClose={() => setShowEditModal(false)}
      onSubmit={handleSubmit}
    />
  );
};
```

## 🎛️ Custom Configuration

You can create custom configurations for specific use cases:

```tsx
const customConfig = {
  context: 'general' as const,
  contextName: 'Custom Activity',
  availableCategories: [
    { value: 'custom_income', label: 'Custom Income', emoji: '💎' },
    { value: 'custom_expense', label: 'Custom Expense', emoji: '🔥' },
  ],
  availableVaults: [{ value: 'vault1', label: 'My Vault' }],
  availableAccounts: [{ value: 'account1', label: 'My Account' }],
  showVaultField: true,
  showAccountField: true,
  showLoanField: false,
  showApplyToLoan: false,
  defaultCategory: 'custom_income',
};
```

## 🔄 Form Data Structure

The component returns data in this format:

```tsx
{
  type: 'incoming' | 'outgoing',
  tag: string, // category
  amount: number,
  date: Date,
  vault: string,
  account: string,
  loan?: string, // only if showLoanField is true
  note: string,
  applyToLoan?: boolean, // only if showApplyToLoan is true
}
```

## ✨ Benefits

1. **Consistency** - Same UI everywhere
2. **Maintainability** - One component to maintain
3. **Flexibility** - Works in any context
4. **Reusability** - No code duplication
5. **Type Safety** - Full TypeScript support

## 🎯 Best Practices

1. **Use pre-built configs** when possible
2. **Pass real data** for vaults, loans, and accounts
3. **Handle form submission** properly in your parent component
4. **Provide meaningful defaults** in your config
5. **Test in different contexts** to ensure it works as expected

This component follows the principle of **"don't create more than necessary"** by providing a single, flexible solution for all activity-related forms in your application. 