import { useEffect, useState, type FormEvent } from 'react';
import { updateCustomer } from '../services/customerService';
import type { CustomerData } from '../types/customer';

interface EditCustomerModalProps {
  open: boolean;
  customer: CustomerData | null;
  onClose: () => void;
  onUpdated: (customer: CustomerData) => void;
}

export function EditCustomerModal({ open, customer, onClose, onUpdated }: EditCustomerModalProps) {
  const [form, setForm] = useState<CustomerData | null>(customer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(customer);
    setError(null);
  }, [customer]);

  if (!open || !form) return null;

  const handleChange = (field: keyof CustomerData, value: string) => {
    setForm((current) =>
      current ? ({ ...current, [field]: value } as CustomerData) : current,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    if (!form.custname || !form.address || !form.payterm) {
      setError('Name, address, and payterm are required.');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateCustomer(form.custno, {
        custname: form.custname,
        address: form.address,
        payterm: form.payterm,
        record_status: form.record_status,
      });
      if (updated) {
        onUpdated(updated);
        onClose();
      }
    } catch (err: any) {
      console.error('Edit customer failed:', err);
      setError(err?.message || 'Failed to update customer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Customer</h2>
            <p className="mt-1 text-sm text-slate-500">Update customer details.</p>
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
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-700 shadow-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.custname}
              onChange={(event) => handleChange('custname', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
            <textarea
              value={form.address}
              onChange={(event) => handleChange('address', event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.record_status}
              onChange={(event) => handleChange('record_status', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
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
              className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-mint-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Update Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
