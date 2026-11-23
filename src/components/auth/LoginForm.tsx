import { SettingsNotice as Notice } from "../SettingsLayout";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../../validations/auth.schema";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, LogIn, ShieldCheck } from "lucide-react";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)
    ?.message;
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setShowSuccess(false), 5000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);
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
    }, 7000);

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

  const inputClass = "min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/60";

  return (
    <div className="w-full max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="border-b border-blue-100 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/30 sm:p-8">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-blue-200 bg-white text-blue-700 dark:border-blue-800 dark:bg-gray-900 dark:text-blue-400"><LogIn size={24} strokeWidth={1.7} aria-hidden="true" /></div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Personal Finance Tracker</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back.</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">Pick up where you left off. Your transactions, spending insights, and financial overview are waiting.</p>
        </header>
        <div className="p-6 sm:p-8">
          <Notice message={showSuccess && !errorMessage ? successMessage || "" : ""} className="mb-5" />
          <form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
            <Notice message={errorMessage} error className="mb-5" />
            <fieldset disabled={isSubmitting} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Email address</label>
                <input {...register("email")} id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "login-email-error" : undefined} className={inputClass} />
                {errors.email && <p id="login-email-error" className="mt-2 text-xs leading-5 text-red-600 dark:text-red-400">{errors.email.message}</p>}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input {...register("password")} id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "login-password-error" : undefined} className={inputClass + " pr-14"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-300">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
                {errors.password && <p id="login-password-error" className="mt-2 text-xs leading-5 text-red-600 dark:text-red-400">{errors.password.message}</p>}
              </div>
              <label htmlFor="trustDevice" className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-700 dark:bg-gray-800/50">
                <input {...register("trustDevice")} id="trustDevice" type="checkbox" aria-describedby="trust-device-help" className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600" />
                <span><span className="block text-sm font-medium text-gray-800 dark:text-gray-200">Trust this device</span><span id="trust-device-help" className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">Stay signed in for up to 30 days. Use only on your own device.</span></span>
              </label>
              <button type="submit" className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}{isSubmitting ? "Signing you in…" : "Sign in"}</button>
            </fieldset>
          </form>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-500 dark:text-gray-400"><ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />You can sign in now and verify your email before adding transactions.</p>

          <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-800">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">New to Personal Finance Tracker?</p>
            <Link to="/register" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-blue-950/30">Create an account</Link>
          </div>
        </div>
      </div>
      <Link to="/" className="mx-auto mt-5 flex min-h-11 w-fit items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowLeft size={16} aria-hidden="true" />Back to home</Link>
    </div>
  );
};

export default LoginForm;
