import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if our specific session key exists in localStorage
  const session = localStorage.getItem('hope_cms_session');
  
  // If the string is missing or null, they aren't logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // They are authenticated, let them through
  return <>{children}</>;
};

export default ProtectedRoute;