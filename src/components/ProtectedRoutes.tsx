import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useRights } from '../context/UserRightsContext'; // Import the rights hook

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const { rights, loadingRights: rightsLoading } = useRights(); // Access rights map

  // 1. Wait for both Auth and Rights to finish loading
  if (authLoading || rightsLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-500 border-t-transparent"></div>
      </div>
    );
  }

  // 2. Auth Gate: Redirect to login if no session exists
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Status Gate: Lockdown for INACTIVE accounts
  // This satisfies the M4 requirement where provisioned users start as INACTIVE
  if (currentUser?.record_status === 'INACTIVE') {
    return <Navigate to="/inactive-account" replace />;
  }

  // 4. Render 'children' or '<Outlet />' for authorized users
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;