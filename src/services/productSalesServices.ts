import { supabase } from '../lib/supabaseClient';
import type { SalesDetailItem, SalesRecord } from '../types/sales';
import type { ProductData } from '../types/product';

/**
 * Fetches all sales transaction records associated with a specific customer
 * Used to populate the embedded sales history panel in the CustomerDetailPage
 */
export const getSalesByCustomer = async (custNo: string): Promise<SalesRecord[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('custno', custNo)
    .order('salesdate', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetches detailed line items for a specific transaction invoice
 * Joins sales detail records with product profiles and historic item pricing
 */
export const getSalesDetail = async (transNo: string): Promise<SalesDetailItem[]> => {
  const { data, error } = await supabase
    .from('salesdetail')
    .select(`
      transno,
      prodcode,
      quantity,
      product (
        prodcode,
        description,
        unit
      )
    `)
    .eq('transno', transNo);

  if (error) throw error;

  return (
    (data as any[] | null)?.map((item) => ({
      transNo: item.transno,
      prodCode: item.prodcode,
      quantity: Number(item.quantity),
      product: item.product
        ? {
            prodcode: item.product.prodcode,
            description: item.product.description,
            unit: item.product.unit,
          }
        : undefined,
    })) ?? []
  );
};

export const getSalesDetailWithLatestPrice = async (transNo: string): Promise<SalesDetailItem[]> => {
  const details = await getSalesDetail(transNo);
  if (!details || !Array.isArray(details)) {
    return [];
  }

  const enriched = await Promise.all(
    details.map(async (item) => {
      return {
        ...item,
        unitPrice: await getCurrentPrice(item.prodCode),
      };
    })
  );

  return enriched;
};

/**
 * Fetches a list of all products in the database inventory catalogs
 */
export const getProducts = async (): Promise<ProductData[]> => {
  const { data, error } = await supabase
    .from('product')
    .select('*');

  if (error) throw error;

  return (
    (data as any[] | null)?.map((item) => ({
      prodcode: item.prodcode,
      description: item.description,
      unit: item.unit,
    })) ?? []
  );
};

export const getProductCatalogue = async (): Promise<ProductData[]> => {
  const products = await getProducts();

  return await Promise.all(
    products.map(async (product) => ({
      ...product,
      unitPrice: await getCurrentPrice(product.prodcode),
    })),
  );
};

/**
 * Retrieves the complete historical pricing changes log for a targeted item stock unit
 */
export const getPriceHistory = async (prodCode: string) => {
  const { data, error } = await supabase
    .from('pricehist')
    .select('*')
    .eq('prodcode', prodCode)
  if (error) throw error;
  return data;
};

/**
 * Grabs the most recent active market rate for an inventory asset listing
 */
export const getCurrentPrice = async (prodCode: string) => {
  console.log(prodCode)
  const { data, error } = await supabase
    .from('pricehist')
    .select('unitprice')
    .eq('prodcode', prodCode)
    .order('effdate', { ascending: false })
    .limit(1)

  if (error) throw error;
  console.log(data)
  return data && data.length > 0 ? data[0].unitprice : null;
};