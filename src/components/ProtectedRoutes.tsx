import { Navigate } from 'react-router-dom';

// For now, this is a mock check. M4 will later connect this to Supabase auth.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Placeholder: change to false to test redirect

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;