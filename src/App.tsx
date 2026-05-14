import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import { AdminRouteGuard } from './components/AdminRouteGuard'; // Make sure the path matches your file tree
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Products from './pages/Products';
import Admin from './pages/Admin';
import DeletedCustomers from './pages/DeletedCustomers';
import AuthCallback from './pages/AuthCallback';
import Login from './pages/Login';
import RegisterPage from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';

function App() {
  return (
    <AuthProvider>
      <UserRightsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* 1. Global Authenticated Layer */}
            <Route element={<ProtectedRoute />}>
              
              {/* General User Routes */}
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/products" element={<Products />} />
              
              {/* 2. Elevated Administrative Layer */}
              <Route element={<AdminRouteGuard />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/deleted-customers" element={<DeletedCustomers />} />
              </Route>

            </Route>
            
            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/customers" replace />} />
          </Routes>
        </BrowserRouter>
      </UserRightsProvider>
    </AuthProvider>
  );
}

export default App;