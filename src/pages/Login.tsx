import { supabase } from "../lib/supabaseClient";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';
import { type AuthUser } from '../types/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Updated Login Logic using Supabase
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Map Supabase user to your internal AuthUser type
        const userProfile: AuthUser = {
          email: data.user.email || '',
          role: 'ADMIN', // You might fetch this from a custom 'profiles' table later
          status: 'ACTIVE'
        };

        localStorage.setItem('hope_cms_session', JSON.stringify(userProfile));
        navigate('/customers');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  // Keep for UI demonstration or replace with supabase.auth.signInWithOAuth()
  const handleGoogleMock = async () => {
    setLoading(true);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/customers'
        }
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-700 tracking-tight">HOPE, INC.</h1>
          <p className="text-slate-500 text-sm font-medium">Customer Management System</p>
        </header>

        {error && (
          <div className="mb-4 p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="admin@hope.inc"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-slate-300"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <hr className="w-full border-slate-200" />
          <span className="text-[10px] uppercase text-slate-400 font-bold px-4 whitespace-nowrap">Or sign in with</span>
          <hr className="w-full border-slate-200" />
        </div>

        <GoogleButton onClick={handleGoogleMock} isLoading={loading} />
        
        <footer className="mt-8 text-center text-[10px] text-slate-400 font-medium">
          &copy; 2026 Hope, Inc. CMS • PR 1 - UI Foundation
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;