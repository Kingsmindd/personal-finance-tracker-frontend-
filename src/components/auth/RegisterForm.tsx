import { SettingsNotice as Notice } from "../SettingsLayout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LoaderCircle, ShieldCheck, UserRoundPlus } from "lucide-react";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../../api/axios";
import {
  registerSchema,
  type RegisterFormData,
} from "../../validations/auth.schema";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const validationErrorKey = [
    errors.name?.message,
    errors.email?.message,
    errors.password?.message,
    errors.confirmPassword?.message,
  ]
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

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage("");

    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigate("/login", {
        state: {
          message: response.data.message || "Registration successful! Please log in to continue.",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Registration failed.",
        );
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  };

  const [email, password, confirmation] = useWatch({ control, name: ["email", "password", "confirmPassword"] });
  const passwordLength = password?.length || 0;
  const minimumMet = passwordLength >= 8;
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  const passwordsMatch = !!confirmation && password === confirmation;
  const inputClass = "min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/60";
  const errorClass = "mt-2 text-xs leading-5 text-red-600 dark:text-red-400";

  return (
    <div className="w-full max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="border-b border-blue-100 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/30 sm:p-8">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-blue-200 bg-white text-blue-700 dark:border-blue-800 dark:bg-gray-900 dark:text-blue-400"><UserRoundPlus size={24} strokeWidth={1.7} aria-hidden="true" /></div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Personal Finance Tracker</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Make room for better habits.</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">Create your account to track income, understand your spending, and see where your money goes.</p>
        </header>
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
            <Notice message={errorMessage} error className="mb-5" />
            <fieldset disabled={isSubmitting} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Your name</label>
                <input {...register("name")} id="name" type="text" autoComplete="name" placeholder="Enter your full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={inputClass} />
                {errors.name && <p id="name-error" className={errorClass}>{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Email address</label>
                <div className="relative">
                  <input {...register("email")} id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : "email-help"} className={inputClass + " pr-12"} />
                  {emailLooksValid && <Check size={19} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />}
                </div>
                {errors.email ? <p id="email-error" className={errorClass}>{errors.email.message}</p> : <p id="email-help" className={"mt-2 text-xs " + (emailLooksValid ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400")}>{emailLooksValid ? "Email format looks valid" : "We’ll send your verification link here."}</p>}
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Password</label>
                <div className="relative">
                  <input {...register("password")} id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" aria-invalid={!!errors.password} aria-describedby="password-help password-error" className={inputClass + " pr-14"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-300">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
                <div id="password-help" className="mt-3">
                  <div role="progressbar" aria-label="Password minimum length" aria-valuemin={0} aria-valuemax={8} aria-valuenow={Math.min(passwordLength, 8)} aria-valuetext={minimumMet ? "Minimum length met" : passwordLength + " of 8 required characters"} className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"><div style={{ width: Math.min(passwordLength / 8 * 100, 100) + "%" }} className={"h-full rounded-full transition-all duration-200 motion-reduce:transition-none " + (minimumMet ? "bg-emerald-600" : "bg-amber-400")} /></div>
                  <div className="mt-2 flex justify-between gap-3 text-xs"><span className={"flex items-center gap-1 " + (minimumMet ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400")}>{minimumMet && <Check size={14} aria-hidden="true" />}{minimumMet ? "Minimum length met" : "Use at least 8 characters"}</span><span className="shrink-0 text-gray-400">{passwordLength} characters</span></div>
                </div>
                {errors.password && <p id="password-error" className={errorClass}>{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Confirm password</label>
                <div className="relative">
                  <input {...register("confirmPassword")} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "confirm-error" : "confirm-help"} className={inputClass + " pr-14"} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"} aria-pressed={showConfirmPassword} className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-300">{showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
                {errors.confirmPassword ? <p id="confirm-error" className={errorClass}>{errors.confirmPassword.message}</p> : <p id="confirm-help" className="mt-2 flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">{passwordsMatch && <><Check size={14} aria-hidden="true" />Passwords match</>}</p>}
              </div>
              <button type="submit" className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}{isSubmitting ? "Creating your account…" : "Create account"}</button>
            </fieldset>
          </form>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-500 dark:text-gray-400"><ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />Explore after signing in. Verify your email when you’re ready to add transactions.</p>
          <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">Already have an account?</p>
            <Link to="/login" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-blue-950/30">Sign in</Link>
          </div>
        </div>
      </div>
      <Link to="/" className="mx-auto mt-5 flex min-h-11 w-fit items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowLeft size={16} aria-hidden="true" />Back to home</Link>
    </div>
  );
};

export default RegisterForm;
