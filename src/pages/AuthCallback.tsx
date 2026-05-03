import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/customers');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login?error=auth_failed');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return <div>Verifying credentials...</div>;
};

export default AuthCallback;