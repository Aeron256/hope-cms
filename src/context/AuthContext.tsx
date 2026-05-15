import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// 1. Extended User type including custom database fields
export type AuthUser = User & {
  user_type?: string;
  record_status?: string;
};

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUserRef = useRef<AuthUser | null>(currentUser);
  currentUserRef.current = currentUser;

  // 2. Extracted fetch function with a 3-second safety timeout
  const fetchUserProfile = async (authUser: User | null): Promise<AuthUser | null> => {
    if (!authUser) return null;

    try {
      // Safety timeout to prevent infinite loading if the database hangs
      const timeout = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 3000));

      // Querying the 'user' table for record_status and user_type
      const dbQuery = supabase
        .from('users')
        .select('user_type, record_status')
        .eq('id', authUser.id)
        .single();

      const result: any = await Promise.race([dbQuery, timeout]);


      // If the query timed out or failed, return the basic auth user
      if (!result || result.timeout || result.error) {
        console.warn("🟠 [Auth] Profile fetch failed or timed out. Using basic auth data.");
        return authUser as AuthUser;
      }

      return { ...authUser, ...result.data };
    } catch (err) {
      console.error("🔴 [Auth] Unexpected fetch error:", err);
      return authUser as AuthUser;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const mergedUser = await fetchUserProfile(session.user);
          if (mounted) setCurrentUser(mergedUser);
        } else {
          if (mounted) setCurrentUser(null);
        }
      } catch (err) {
        console.error("🔴 [Auth] Initial load error:", err);
      } finally {
        // ALWAYS release the loading lock to prevent white/spinner screens
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 3. Listen for SIGNED_IN and SIGNED_OUT events
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`🔵 [Auth] Event: ${event}`);

    if (event === 'SIGNED_IN') {
      // ONLY show loading spinner if we don't have a user yet
      // This prevents the Alt-Tab loading flicker
      if (!currentUserRef.current && mounted) {
        setLoading(true);
      }

      const mergedUser = await fetchUserProfile(session?.user ?? null);

      if (mounted) {
        if (!currentUserRef.current || currentUserRef.current.id !== mergedUser?.id) {
          setCurrentUser(mergedUser);
        }
        setLoading(false);
      }
    }

    if (event === 'SIGNED_OUT') {
      if (mounted) {
        setCurrentUser(null);
        setLoading(false);
      }
    }
  });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {/* Renders children regardless of loading status so ProtectedRoute can show its spinner */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};