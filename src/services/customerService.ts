import { supabase } from '../lib/supabaseClient';
import type { UserRole } from '../types/auth';
import type { CustomerData } from '../types/customer';

export const getCustomers = async (userType: UserRole) => {
  let query = supabase
    .from('customer')
    .select('*');

  // Business Rule: INACTIVE customers are completely invisible to USER accounts
  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }
  // ADMIN and SUPERADMIN see everything implicitly (both ACTIVE and INACTIVE)

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getCustomerByCustNo = async (custNo: string) => {
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .eq('custno', custNo)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const addCustomer = async (customerData: CustomerData) => {
  const { data, error } = await supabase
    .from('customer')
    .insert([customerData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateCustomer = async (customerId: string, updatedFields: Partial<CustomerData>) => {
    console.log(`Updating customer ${customerId} with fields:`, updatedFields);
    const { data, error } = await supabase
    .from('customer')
    .update(updatedFields)
    .eq('custno', customerId) // Use .eq() instead of .where()
    .select();                // Forces Supabase to return the modified record

  if (error) {
    console.error("Supabase Update Error:", error);
    throw error;
  }

  // If data is empty or undefined, handle it gracefully
  if (!data || data.length === 0) {
    console.warn(`No customer found with custno: ${customerId}`);
    return null;
  }

  return data[0]; // Returns the updated customer object
};
export const softDeleteCustomer = async (customerId: string) => {
  const { data, error } = await supabase
    .from('customer')
    .update({ record_status: 'INACTIVE' })
    .eq('custno', customerId) // Match against your primary key identifier
    .select();

  if (error) throw error;
  return data[0];
};

export const recoverCustomer = async (customerId: string) => {
  const { data, error } = await supabase
    .from('customer')
    .update({ record_status: 'ACTIVE' })
    .eq('custno', customerId)
    .select();

  if (error) throw error;
  return data[0];
};