import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getDeletedCustomers, recoverCustomer } from '../services/customerService';
import type { CustomerData } from '../types/customer';

export default function DeletedCustomers() {
  const { currentUser, loading: authLoading } = useAuth();
  const { rights, loadingRights } = useRights();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentUser?.user_type?.toString().toLowerCase() === 'admin' ||
    currentUser?.user_type?.toString().toLowerCase() === 'superadmin' ||
    rights.ADM_USER;

  useEffect(() => {
    const loadDeleted = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDeletedCustomers();
        setCustomers(data || []);
      } catch (err: any) {
        console.error('Failed to load deleted customers:', err);
        setError(err?.message || 'Unable to load deleted customers.');
      } finally {
        setLoading(false);
      }
    };

    loadDeleted();
  }, []);

  const handleRecover = async (custno: string) => {
    setActionLoading(custno);
    setError(null);

    try {
      await recoverCustomer(custno);
      setCustomers((current) => current.filter((customer) => customer.custno !== custno));
    } catch (err: any) {
      console.error('Recover failed:', err);
      setError(err?.message || 'Failed to recover customer.');
    } finally {
      setActionLoading(null);
    }
  };

  // 🟢 Fixed Layout: Replaced h-screen wrapper to prevent app container breakages
  if (authLoading || loadingRights || loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-2">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700 shadow-xs">
          🚫 You do not have permission to access deleted customer recovery. Please contact your system administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Deleted Customers</h1>
          <p className="mt-1 text-sm text-slate-600">Recover inactive or soft-deleted customer accounts.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-xs">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cust No.</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                  No inactive customers found in the system log.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.custno} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{customer.custno}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{customer.custname}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    {/* 🟢 Updated Button with Indigo colors, clean tracking adjustments, and inline contrast rules */}
                    <button
                      type="button"
                      onClick={() => handleRecover(customer.custno)}
                      disabled={actionLoading !== null}
                      className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm shadow-indigo-100"
                      style={{ color: '#ffffff' }}
                    >
                      {actionLoading === customer.custno ? 'Recovering...' : 'Recover'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}