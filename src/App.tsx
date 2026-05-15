import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Products from './pages/Products';
import Admin from './pages/Admin';
import DeletedCustomers from './pages/DeletedCustomers';
import AuthCallback from './pages/AuthCallback';
import Login from './pages/Login';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/Register';
// PR4: Added UserRightsProvider to manage user permissions across the app
import { UserRightsProvider } from './context/UserRightsContext';

function App() {


  return (
    <AuthProvider>
      <UserRightsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected Routes */}
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/deleted-customers" element={<ProtectedRoute><DeletedCustomers /></ProtectedRoute>} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/customers" replace />} />
        </Routes>
      </BrowserRouter>
    </UserRightsProvider>
    </AuthProvider>
  )
}

export default App;