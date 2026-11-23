import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const Register: React.FC = () => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4 py-10 sm:py-14 dark:bg-gray-950">
      <RegisterForm />
    </main>
  );
};

export default Register;
