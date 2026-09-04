import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProctectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProctectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
