import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Syncs with your global Auth Context layer

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 1. If the Supabase auth state is still loading/hydrating, show a clean spinner
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
      </div>
    );
  }

  // 2. If no valid user session is detected, redirect them straight to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render 'children' if passed directly, or fallback to '<Outlet />' for nested layouts
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;