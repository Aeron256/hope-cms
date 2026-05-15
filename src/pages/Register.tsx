import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';
import { supabase } from '../lib/supabaseClient';

interface RegisterError {
  field: string;
  message: string;
}

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<RegisterError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: RegisterError[] = [];
    
    if (!email.includes('@')) {
      newErrors.push({ field: 'email', message: 'Valid email is required.' });
    }
    if (password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters.' });
    }
    if (password !== confirmPassword) {
      newErrors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    // Remove the 'options' block entirely for this test
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    if (error) throw error;
    if (data.user) setSuccess(true);
  } catch (err: any) {
    setErrors([{ field: 'form', message: err.message }]);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Essential: Point this to your AuthCallback component route
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrors([{ field: 'form', message: error.message }]);
      setLoading(false);
    }
  };

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-700 tracking-tight">JOIN HOPE, INC.</h1>
          <p className="text-slate-500 text-sm font-medium uppercase">Create your CMS account</p>
        </header>

        {success ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-green-800 font-bold mb-2 text-lg">Check your email!</h2>
            <p className="text-green-600 text-sm leading-relaxed">
              We've sent a confirmation link to <strong>{email}</strong>. 
              Please verify your email to activate your account.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            {/* Global Error Display (For Supabase 500/400 errors) */}
            {getError('form') && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                <p className="font-bold uppercase text-[10px] mb-1">System Error</p>
                {getError('form')}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Email Address</label>
                <input
                  type="email"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getError('email') ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {getError('email') && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase ml-1">{getError('email')}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
                <input
                  type="password"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getError('password') ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {getError('password') && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase ml-1">{getError('password')}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Confirm Password</label>
                <input
                  type="password"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getError('confirmPassword') ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {getError('confirmPassword') && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase ml-1">{getError('confirmPassword')}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="my-8 flex items-center justify-between">
              <hr className="w-full border-slate-100" />
              <span className="text-[10px] uppercase text-slate-400 font-bold px-4 whitespace-nowrap">Or join with</span>
              <hr className="w-full border-slate-100" />
            </div>

            <GoogleButton onClick={handleGoogleRegister} isLoading={loading} text="Register with Google" />
          </>
        )}
        
        <p className="mt-8 text-center text-sm text-slate-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;