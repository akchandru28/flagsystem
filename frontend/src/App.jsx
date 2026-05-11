import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';

// Super Admin
import SuperAdminLogin from './portals/SuperAdmin/Login';
import SuperAdminDashboard from './portals/SuperAdmin/Dashboard';

// Org Admin
import AdminLogin from './portals/Admin/Login';
import AdminSignup from './portals/Admin/Signup';
import AdminDashboard from './portals/Admin/Dashboard';

// End User
import UserPortal from './portals/User/UserPortal';

// Protected route wrapper
function ProtectedRoute({ children, requiredRole, redirectTo = "/" }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

// Public route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children, roleRouteMap }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (token && role && roleRouteMap[role]) {
    return <Navigate to={roleRouteMap[role]} replace />;
  }
  return children;
}

export default function App() {
  const roleRouteMap = {
    super_admin: '/super-admin/dashboard',
    org_admin: '/admin/dashboard',
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Home - Portal Selector */}
        <Route path="/" element={
          <PublicRoute roleRouteMap={roleRouteMap}>
            <Home />
          </PublicRoute>
        } />

        {/* Super Admin Portal */}
        <Route path="/super-admin" element={
          <PublicRoute roleRouteMap={roleRouteMap}>
            <SuperAdminLogin />
          </PublicRoute>
        } />
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute requiredRole="super_admin" redirectTo="/super-admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal */}
        <Route path="/admin" element={
          <PublicRoute roleRouteMap={roleRouteMap}>
            <AdminLogin />
          </PublicRoute>
        } />
        <Route path="/admin/signup" element={
          <PublicRoute roleRouteMap={roleRouteMap}>
            <AdminSignup />
          </PublicRoute>
        } />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="org_admin" redirectTo="/admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Portal */}
        <Route path="/user" element={<UserPortal />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
