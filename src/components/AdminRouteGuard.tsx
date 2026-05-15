import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext'; // Hook from PR-03
import { useEffect, useState } from 'react';

export const AdminRouteGuard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { rights, loadingRights: rightsLoading } = useRights();
  const [ userTypeLoading, setUserTypeLoading ] = useState(true);

  useEffect(() => {
    if(currentUser?.user_type !== undefined) {
      setUserTypeLoading(false);
    }
  }, [currentUser]);

  // 1. Wait for both the session verification and the permissions map to finish hydrating
  if (authLoading || rightsLoading || userTypeLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
      </div>
    );
  }

  // 2. If no authenticated session exists at all, redirect straight to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. SECURITY GATE: Check if the user has the administrative management flag set to true
  const hasAdminAccess = currentUser?.user_type === 'admin' || currentUser?.user_type === "superadmin";

  // 4. Render protected child routes if allowed; otherwise, kick them back to /customers
  return hasAdminAccess ? <Outlet /> : <Navigate to="/customers" replace />;
};