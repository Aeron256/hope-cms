import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton'; // Reusable component natin

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
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: RegisterError[] = [];
    
    // Basic Validation Rules
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    // MOCK REGISTRATION LOGIC
    setTimeout(() => {
      console.log("Mock Registering:", { email, role: 'USER', status: 'INACTIVE' });
      setLoading(false);
      // I-redirect sa login page pagkatapos mag-register
      alert("Registration successful! Please wait for Admin approval (INACTIVE status).");
      navigate('/login');
    }, 1500);
  };

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-700 tracking-tight">JOIN HOPE, INC.</h1>
          <p className="text-slate-500 text-sm font-medium uppercase">Create your CMS account</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getError('email') ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {getError('email') && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{getError('email')}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getError('password') ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {getError('password') && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{getError('password')}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getError('confirmPassword') ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {getError('confirmPassword') && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{getError('confirmPassword')}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-200 disabled:bg-slate-300"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <hr className="w-full border-slate-200" />
          <span className="text-[10px] uppercase text-slate-400 font-bold px-4 whitespace-nowrap">Or use Google</span>
          <hr className="w-full border-slate-200" />
        </div>

        <GoogleButton onClick={() => console.log("Google Register Clicked")} isLoading={loading} text="Sign up with Google" />
        
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