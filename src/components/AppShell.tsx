import { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { supabase } from '../lib/supabaseClient';

const navItems = [
  { 
    to: '/customers', 
    label: 'Customers',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    to: '/sales', 
    label: 'Sales Orders',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    to: '/products', 
    label: 'Product Catalogue',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
];

export function AppShell() {
  const { currentUser } = useAuth();
  const { rights } = useRights();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = useMemo(() => {
    if (!currentUser) return 'Guest';
    return (
      currentUser.user_metadata?.full_name ||
      currentUser.user_metadata?.name ||
      currentUser.email ||
      currentUser.id
    );
  }, [currentUser]);

  const isAdmin = currentUser?.user_type?.toString().toLowerCase() === 'admin' ||
    currentUser?.user_type?.toString().toLowerCase() === 'superadmin' ||
    rights.ADM_USER;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  // NavLink active styling coordinator block
  const getNavLinkClass = (isActive: boolean) => {
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative group ${
      isActive 
        ? 'bg-indigo-50 text-indigo-600 shadow-xs' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr]">
        
        {/* MOBILE TOP BAR NAVIGATION LAYER */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm text-sm">
              CMS
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">Hope CMS</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* SIDEBAR SIDE PANEL (DESKTOP VIEW) */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-[280px] transform border-r border-slate-200 bg-white px-5 py-6 shadow-xs transition-transform duration-300 lg:static lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Logo Branding */}
          <div className="mb-8 flex items-center gap-3 pb-5 border-b border-slate-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 font-black text-white shadow-md shadow-indigo-200 text-base tracking-wider">
              CMS
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 tracking-tight">Hope CMS</p>
              <p className="text-xs font-medium text-slate-400">Enterprise Control Unit</p>
            </div>
          </div>

          {/* Navigation Links Group */}
          <nav className="space-y-1">
            <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Core Operations</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-lg bg-indigo-600" />}
                  </>
                )}
              </NavLink>
            ))}

            {isAdmin && (
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-1">
                <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">System Admin</p>
                <NavLink
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <svg className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin Settings</span>
                      {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-lg bg-indigo-600" />}
                    </>
                  )}
                </NavLink>
                <NavLink
                  to="/deleted-customers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <svg className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Archive Recovery</span>
                      {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-lg bg-indigo-600" />}
                    </>
                  )}
                </NavLink>
              </div>
            )}
          </nav>
        </aside>

        {/* MOBILE BLUR BACKDROP OVERLAY */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* MAIN DISPLAY REGION */}
        <div className="flex flex-col min-w-0">
          <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Identity Active</p>
                <h1 className="text-sm font-bold text-slate-900 mt-0.5">{displayName}</h1>
              </div>
              
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold tracking-wide text-slate-700 uppercase border border-slate-200">
                  {currentUser?.user_type?.toString().toUpperCase() || 'USER'}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition active:scale-[0.98]"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
}