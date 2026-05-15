import { useEffect, useState } from 'react';
import { getSalesDetailWithLatestPrice } from '../services/productSalesServices';
import type { SalesDetailItem } from '../types/sales';

interface SalesDetailModalProps {
  open: boolean;
  transNo: string | null;
  onClose: () => void;
}

export function SalesDetailModal({ open, transNo, onClose }: SalesDetailModalProps) {
  const [lineItems, setLineItems] = useState<SalesDetailItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


   useEffect(() => {
        console.log('Sales data updated:', lineItems);
    }, [lineItems]);
  useEffect(() => {
    if (!open || !transNo) {
      setLineItems([]);
      setError(null);
      return;
    }

    const loadDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const items = await getSalesDetailWithLatestPrice(transNo);
        setLineItems(items || []);
      } catch (err: any) {
        console.error('Failed to load sales detail:', err);
        setError(err?.message || 'Unable to load transaction details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [open, transNo]);

  if (!open || !transNo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Transaction {transNo}</h2>
            <p className="mt-1 text-sm text-slate-500">Line items with latest catalog pricing.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Product</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Quantity</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-10 text-center text-sm text-slate-500">
                        No item details are available for this transaction.
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-100">
                        <td className="px-5 py-4 text-sm text-slate-900">
                          {item.product?.description || item.prodCode}
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-slate-700">{item.quantity}</td>
                        <td className="px-5 py-4 text-right text-sm text-slate-700">
                          {item.unitPrice != null ? `$${item.unitPrice.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
