import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateCustomer } from '../services/customerService';
import type { CustomerData } from '../types/customer';

interface EditCustomerModalProps {
  open: boolean;
  customer: CustomerData | null;
  onClose: () => void;
  onUpdated: (customer: CustomerData) => void;
}

export function EditCustomerModal({ open, customer, onClose, onUpdated }: EditCustomerModalProps) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState<CustomerData | null>(customer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🟢 Controls modal layer visibility if status changes to INACTIVE
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    setForm(customer);
    setError(null);
    setIsConfirmModalOpen(false); 
  }, [customer, open]);

  if (!open || !form) return null;

  const userRole = currentUser?.user_type?.toString().toUpperCase();
  const isSuperAdmin = userRole === 'SUPERADMIN';

  const handleChange = (field: keyof CustomerData, value: string) => {
    setForm((current) =>
      current ? ({ ...current, [field]: value } as CustomerData) : current,
    );
  };

  // 🟢 Core Save Logic Shared by both normal submit and confirmation paths
  const executeUpdate = async (finalData: CustomerData) => {
    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateCustomer(finalData.custno, {
        custname: finalData.custname,
        address: finalData.address,
        payterm: finalData.payterm,
        record_status: finalData.record_status,
      });
      if (updated) {
        onUpdated(updated);
        setIsConfirmModalOpen(false);
        onClose();
      }
    } catch (err: any) {
      console.error('Update customer failed:', err);
      setError(err?.message || 'Failed to update customer.');
      setIsConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    if (!form.custname || !form.address || !form.payterm) {
      setError('Name, address, and payterm are required.');
      return;
    }

    // 🟢 Intercept form if record status was changed to INACTIVE from an originally ACTIVE state
    if (form.record_status === 'INACTIVE' && customer?.record_status === 'ACTIVE') {
      setIsConfirmModalOpen(true);
    } else {
      // Proceed directly with a normal save if no deactivation occurred
      executeUpdate(form);
    }
  };

  return (
    <>
      {/* MAIN EDIT CUSTOMER MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
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

            {/* 🟢 Status dropdown is restored */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status {!isSuperAdmin && <span className="text-xs text-slate-400 font-normal">(Super Admin Only)</span>}
              </label>
              <select
                value={form.record_status}
                disabled={!isSuperAdmin}
                onChange={(event) => handleChange('record_status', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <div className="flex items-center justify-end gap-3 pt-2">
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
                style={{ color: '#ffffff' }}
              >
                {submitting ? 'Saving...' : 'Update Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🟢 FLOATING DEACTIVATION CONFIRMATION MODAL LAYER */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Record Deactivation</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  You have marked <span className="font-semibold text-slate-800">{form.custname}</span> as <span className="font-semibold text-rose-600">INACTIVE</span>. 
                  Are you sure you want to save this change? It will hide or restrict this user record across active database configurations.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel Change
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => executeUpdate(form)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition active:scale-[0.98] disabled:opacity-50"
                style={{ color: '#ffffff' }}
              >
                {submitting ? 'Updating...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}