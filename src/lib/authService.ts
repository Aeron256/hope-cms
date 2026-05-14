import { supabase } from "./supabaseClient";
import { type AuthResponse} from '@supabase/supabase-js';

export const handleRegister = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await supabase.auth.signUp({ email, password });
  if (response.error) throw response.error;
  return response;
};

export const handleLogin = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await supabase.auth.signInWithPassword({ email, password });
  if (response.error) throw response.error;
  return response;
};