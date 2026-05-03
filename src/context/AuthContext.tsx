import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to check if the user is ACTIVE in our database
  const checkUserStatus = async (user: User) => {
    const { data: profile, error } = await supabase
      .from('USER')
      .select('record_status')
      .eq('id', user.id)
      .single();

    if (error || profile?.record_status !== 'ACTIVE') {
      // THE GUARD: If they aren't active, log them out immediately
      await supabase.auth.signOut();
      alert("Access Denied: Your account is pending administrator approval.");
      setCurrentUser(null);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Run the guard check on initial load
        await checkUserStatus(session.user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Run the guard check when a user signs in
        const isActive = await checkUserStatus(session.user);
        if (isActive) {
          setCurrentUser(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      } else {
        setCurrentUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
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