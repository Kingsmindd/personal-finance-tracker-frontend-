import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import LoginForm from "../components/auth/LoginForm";
const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4 py-10 sm:py-14 dark:bg-gray-950">
      <LoginForm />
    </main>
  );
};

export default Login;
