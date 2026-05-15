import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCustomers } from "../services/customerService";
import type { CustomerData } from "../types/customer";
import type { UserRole } from "../types/auth";

export default function Customers() {
  const { currentUser, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paytermFilter, setPaytermFilter] = useState<string>("");

  useEffect(() => {
    const loadCustomers = async () => {
      if (!currentUser) return;

      const userType = currentUser?.user_type?.toString().toUpperCase() as UserRole | undefined;
      if (!userType) return;

      setLoading(true);
      try {
        const data = await getCustomers(userType);
        setCustomers(data || []);
      } catch (error) {
        console.error("Failed to load customers:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [currentUser]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Convert custno to a string safely in case it is a number type
      const customerNoStr = customer.custno ? customer.custno.toString().toLowerCase() : "";
      
      const matchesSearch =
        customerNoStr.includes(searchTerm.toLowerCase()) || // 🟢 Added custno matching
        customer.custname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.payterm.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayterm =
        paytermFilter === "" || customer.payterm === paytermFilter;

      return matchesSearch && matchesPayterm;
    });
  }, [customers, searchTerm, paytermFilter]);
  const userType = currentUser?.user_type?.toString().toUpperCase();
  const showStampColumn = userType === "ADMIN" || userType === "SUPERADMIN";

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-600">Customer list connected to the database.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or payterm"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          />
          <select
            value={paytermFilter}
            onChange={(event) => setPaytermFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          >
            <option value="">All payterms</option>
            <option value="COD">COD</option>
            <option value="30D">30D</option>
            <option value="45D">45D</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cust No.</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Payterm</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              {showStampColumn && (
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stamp</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={showStampColumn ? 6 : 5} className="px-6 py-10 text-center text-sm text-slate-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.custno} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{customer.custno}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{customer.custname}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{customer.address}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{customer.payterm}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      customer.record_status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {customer.record_status}
                    </span>
                  </td>
                  {showStampColumn && (
                    <td className="px-6 py-4 text-sm text-slate-700">{customer.stamp || '-'}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        Showing {filteredCustomers.length} of {customers.length} customers.
      </div>
    </div>
  );
}
