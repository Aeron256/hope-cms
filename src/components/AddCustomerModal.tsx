import { useState, type FormEvent } from 'react';
import { addCustomer } from '../services/customerService';
import type { CustomerData } from '../types/customer';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (customer: CustomerData) => void;
}

const defaultFormState = {
  custno: '',
  custname: '',
  address: '',
  payterm: 'COD',
  record_status: 'ACTIVE' as const,
};

export function AddCustomerModal({ open, onClose, onCreated }: AddCustomerModalProps) {
  const [form, setForm] = useState<CustomerData>(defaultFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (field: keyof CustomerData, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    } as CustomerData));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.custno || !form.custname || !form.address || !form.payterm) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await addCustomer(form);
      onCreated(created);
      setForm(defaultFormState);
      onClose();
    } catch (err: any) {
      console.error('Add customer failed:', err);
      setError(err?.message || 'Failed to add customer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Add Customer</h2>
            <p className="mt-1 text-sm text-slate-500">Create a new customer record.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Customer No.</label>
            <input
              value={form.custno}
              onChange={(event) => handleChange('custno', event.target.value.toUpperCase())}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              placeholder="C0001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.custname}
              onChange={(event) => handleChange('custname', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              placeholder="Customer name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
            <textarea
              value={form.address}
              onChange={(event) => handleChange('address', event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              placeholder="Street address, city, state"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Payment Term</label>
            <select
              value={form.payterm}
              onChange={(event) => handleChange('payterm', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="COD">COD</option>
              <option value="30D">30D</option>
              <option value="45D">45D</option>
            </select>
          </div>

          {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
  type="submit"
  disabled={submitting}
  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
  style={{ color: '#ffffff' }} // 🟢 Explicit inline style safety net
>
  {submitting ? 'Saving...' : 'Create Customer'}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}
