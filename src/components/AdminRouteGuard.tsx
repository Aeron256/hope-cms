import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext'; // Hook from PR-03

export const AdminRouteGuard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { rights, loadingRights: rightsLoading } = useRights();

  // 1. Wait for both the session verification and the permissions map to finish hydrating
  if (authLoading || rightsLoading) {
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
  const hasAdminAccess = currentUser?.user_type === 'ADMIN' || currentUser?.user_type == "SUPERADMIN";

  // 4. Render protected child routes if allowed; otherwise, kick them back to /customers
  return hasAdminAccess ? <Outlet /> : <Navigate to="/customers" replace />;
};