import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin } = useAuth();

  // Se não está logado, redireciona para login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Se requer admin mas não é admin, redireciona para home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
