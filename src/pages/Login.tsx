import React from "react";
import LoginForm from "../components/auth/LoginForm";
const Login: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <LoginForm />
    </main>
  );
};

export default Login;
