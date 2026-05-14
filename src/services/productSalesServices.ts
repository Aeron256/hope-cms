import { supabase } from '../lib/supabaseClient';

/**
 * Fetches all sales transaction records associated with a specific customer
 * Used to populate the embedded sales history panel in the CustomerDetailPage
 */
export const getSalesByCustomer = async (custNo: string) => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('custno', custNo);

  if (error) throw error;
  return data;
};

/**
 * Fetches detailed line items for a specific transaction invoice
 * Joins sales detail records with product profiles and historic item pricing
 */
export const getSalesDetail = async (transNo: string) => {
  const { data, error } = await supabase
    .from('salesdetail')
    .select(`
      transno,
        prodcode,
      product (
        prodcode,
        description,
        unit
      )
    `)
    .eq('transno', transNo);

  if (error) throw error;
  return data;
};

/**
 * Fetches a list of all products in the database inventory catalogs
 */
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('product')
    .select('*');

  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('pricehist')
    .select('unitprice')
    .eq('prodcode', prodCode)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0].unitprice : null;
};