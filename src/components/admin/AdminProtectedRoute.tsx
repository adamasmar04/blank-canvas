import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'designer' | 'manager' | 'admin' | 'super_admin';
}

const AdminProtectedRoute = ({ children, requiredRole = 'designer' }: AdminProtectedRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!userRole) return false;
    
    const roleHierarchy = ['user', 'designer', 'manager', 'admin', 'super_admin'];
    const userRoleIndex = roleHierarchy.indexOf(userRole.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    return userRoleIndex >= requiredRoleIndex && userRole.is_active;
  };

  if (!hasRequiredRole()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;