import type { SalesRecord } from '../types/sales';

interface SalesHistoryPanelProps {
  sales: SalesRecord[];
  loading: boolean;
  onSelectTransaction: (transNo: string) => void;
}

export function SalesHistoryPanel({ sales, loading, onSelectTransaction }: SalesHistoryPanelProps) {
   
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sales History</h2>
          <p className="mt-1 text-sm text-slate-500">Transactions linked to this customer.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Transaction</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Employee</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                  No sales history available for this customer.
                </td>
              </tr>
            ) : (
              sales.map((transaction) => {
                const dateLabel = transaction.salesdate
                  ? new Date(transaction.salesdate).toLocaleDateString()
                  : '-';

                return (
                  <tr key={transaction.transno} className="hover:bg-slate-100">
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{transaction.transno}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{dateLabel}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{transaction.empno || '-'}</td>
                    <td className="px-5 py-4 text-sm">
                     <button
  type="button"
  onClick={() => onSelectTransaction(transaction.transno)}
  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98]"
  style={{ color: '#ffffff' }} // 🟢 Forces text to remain perfectly visible
>
  View Details
</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
