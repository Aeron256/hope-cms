import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRights } from "../context/UserRightsContext";
import { getCustomerByCustNo } from "../services/customerService";
import { getSalesByCustomer } from "../services/productSalesServices";
import { SalesHistoryPanel } from "../components/SalesHistoryPanel";
import { SalesDetailModal } from "../components/SalesDetailModal";
import type { CustomerData } from "../types/customer";
import type { SalesRecord } from "../types/sales";

function formatDate(dateInput: string | undefined) {
  if (!dateInput) return '-';
  const parsed = new Date(dateInput);
  return Number.isNaN(parsed.getTime()) ? dateInput : parsed.toLocaleDateString();
}

export default function CustomerDetail() {
  const { custno } = useParams<{ custno: string }>();
  const { currentUser, loading: authLoading } = useAuth();
  const { rights, loadingRights } = useRights();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [salesHistory, setSalesHistory] = useState<SalesRecord[]>([]);
  const [selectedTransNo, setSelectedTransNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!custno) return;

    const loadCustomerDetail = async () => {
      setLoading(true);
      try {
        const [customerData, salesData] = await Promise.all([
          getCustomerByCustNo(custno),
          getSalesByCustomer(custno),
        ]);
        setCustomer(customerData || null);
        setSalesHistory(salesData || []);
      } catch (error) {
        console.error("Unable to load customer details:", error);
        setCustomer(null);
        setSalesHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomerDetail();
  }, [custno]);

  if (authLoading || loadingRights || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 text-slate-800">
        <h2 className="text-xl font-semibold">Customer Detail</h2>
        <p className="mt-2 text-sm text-slate-600">Sign in to view customer details.</p>
      </div>
    );
  }

  if (!custno || !customer) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Customer not found</h2>
          <p className="mt-2 text-sm text-slate-600">The customer you requested could not be found.</p>
          <Link to="/customers" className="mt-6 inline-flex rounded-lg bg-mint-600 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-700">
            Back to customer list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SalesDetailModal
        open={Boolean(selectedTransNo)}
        transNo={selectedTransNo}
        onClose={() => setSelectedTransNo(null)}
      />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Profile</h1>
          <p className="mt-1 text-sm text-slate-600">Profile and sales history for customer {customer.custno}.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/customers"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Customers
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Customer Information</h2>
              <p className="mt-1 text-sm text-slate-500">Key details for this account.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${customer.record_status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {customer.record_status}
            </span>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer No.</dt>
              <dd className="mt-2 text-sm text-slate-900">{customer.custno}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Term</dt>
              <dd className="mt-2 text-sm text-slate-900">{customer.payterm}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
              <dd className="mt-2 text-sm text-slate-900">{customer.custname}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-700">{customer.address}</dd>
            </div>
            {customer.stamp && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stamp</dt>
                <dd className="mt-2 text-sm text-slate-900">{customer.stamp}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Sales Summary</h2>
          <p className="mt-1 text-sm text-slate-500">Quick metrics for this customer.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Transactions</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{salesHistory.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Most recent sale</p>
              <p className="mt-3 text-sm text-slate-900">{salesHistory.length > 0 ? formatDate(salesHistory[0].salesdate) : '-'}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6">
        {rights.SALES_VIEW ? (
          <SalesHistoryPanel
            sales={salesHistory}
            loading={false}
            onSelectTransaction={setSelectedTransNo}
          />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            You do not have permission to view sales history for this customer.
          </div>
        )}
      </div>
    </div>
  );
}
