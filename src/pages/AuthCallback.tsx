import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // This helper specifically exchanges the URL fragments for a real session
      const { data, error } = await supabase.auth.getSession();
      
      if (data?.session) {
        // Map the Supabase user to your custom local storage session
        const userProfile = {
          email: data.session.user.email,
          role: 'USER', // Default role
          status: 'ACTIVE'
        };
        localStorage.setItem('hope_cms_session', JSON.stringify(userProfile));
        
        navigate('/customers');
      } else if (error) {
        console.error("Auth callback error:", error.message);
        navigate('/login?error=auth_failed');
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium text-sm">Verifying credentials...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
