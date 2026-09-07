import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../../validations/auth.schema";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

import { Eye, EyeOff } from "lucide-react";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)
    ?.message;
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      trustDevice: false,
    },
  });

  const validationErrorKey = [errors.email?.message, errors.password?.message]
    .filter(Boolean)
    .join("|");

  useEffect(() => {
    if (!errorMessage && !validationErrorKey) return;

    const timer = window.setTimeout(() => {
      setErrorMessage("");
      clearErrors();
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [errorMessage, validationErrorKey, clearErrors]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");
    try {
      const response = await api.post("/auth/login", data);

      login(response.data.token, response.data.user);

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message = error.response.data.message || "Login failed.";

          setErrorMessage(message);

        } else {
          setErrorMessage("Unable to connect to the server.");
        }
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-8 shadow-xl dark:bg-gray-900">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Welcome back! Sign in to your account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>

          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>

          <input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-14 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {successMessage && !errorMessage && (
          <div
            className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            {...register("trustDevice")}
            id="trustDevice"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <label htmlFor="trustDevice" className="text-sm text-gray-600 dark:text-gray-400">
            Trust this device
          </label>
        </div>
        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Register */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-gray-900 hover:underline dark:text-white"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
