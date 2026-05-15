import { useEffect, useMemo, useState } from 'react';
import { getProductCatalogue } from '../services/productSalesServices';
import type { ProductData } from '../types/product';

export default function ProductCatalogue() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🟢 State tracking the search bar query string
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCatalogue = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProductCatalogue();
        setProducts(data || []);
      } catch (err: any) {
        console.error('Failed to load product catalogue:', err);
        setError(err?.message || 'Unable to load product catalogue.');
      } finally {
        setLoading(false);
      }
    };

    loadCatalogue();
  }, []);

  // 🟢 Client side memoized search filtering layer
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      const prodCodeStr = product.prodcode ? product.prodcode.toString().toLowerCase() : '';
      const descriptionStr = product.description ? product.description.toLowerCase() : '';

      return prodCodeStr.includes(searchLower) || descriptionStr.includes(searchLower);
    });
  }, [products, searchTerm]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Catalogue</h1>
          <p className="mt-1 text-sm text-slate-600">Read-only product list with current price.</p>
        </div>

        {/* 🟢 Search Input Box Layout */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by prod code or description..."
            className="w-full h-[42px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Swapped mint-500 loading ring indicator helper */}
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Prod Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Unit</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Current Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    No products matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.prodcode} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.prodcode}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{product.description}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{product.unit}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-900">
                      {product.unitPrice != null ? `$${product.unitPrice.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}