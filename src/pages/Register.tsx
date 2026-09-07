import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const Register: React.FC = () => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <RegisterForm />
    </main>
  );
};

export default Register;
