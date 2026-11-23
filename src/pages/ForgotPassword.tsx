import AuthCard from "../components/AuthCard";
import { SettingsNotice as Notice } from "../components/SettingsLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LoaderCircle, Mail, MailCheck } from "lucide-react";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPassword } from "../services/passwordReset";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../validations/auth.schema";

const ForgotPassword: React.FC = () => {
  const [status, setStatus] = useState<"form" | "success">("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (!errorMessage) return;
    const timer = window.setTimeout(() => setErrorMessage(""), 7000);
    return () => window.clearTimeout(timer);
  }, [errorMessage]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage("");

    try {
      await forgotPassword(data.email);

      setRegisteredEmail(data.email);
      setStatus("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Unable to process your request.",
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const complete = status === "success";
  return (
    <AuthCard title={complete ? "Check your email." : "Let’s get you back in."} description={complete ? "If an account matches this email, we’ll send a secure password-reset link." : "Forgot your password? Enter your account email and we’ll help you choose a new one."} icon={complete ? MailCheck : Mail}>
      {complete ? <div className="space-y-5"><div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"><p className="text-xs text-gray-500 dark:text-gray-400">Requested for</p><p className="mt-2 break-all text-sm font-semibold text-gray-900 dark:text-white">{registeredEmail}</p></div><p className="text-sm leading-6 text-gray-500 dark:text-gray-400">Use the link in your inbox to reset your password. It expires in 1 hour. Check your spam or junk folder if it hasn’t arrived.</p><Link to="/login" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Back to sign in<ArrowRight size={17} aria-hidden="true" /></Link><button type="button" onClick={() => setStatus("form")} className="min-h-10 w-full cursor-pointer text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">Use a different email</button></div> : <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-busy={isSubmitting}><div><label htmlFor="recovery-email" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Account email</label><div className="relative"><Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input {...register("email")} id="recovery-email" type="email" autoComplete="email" placeholder="you@example.com" disabled={isSubmitting} aria-invalid={!!errors.email} aria-describedby={errors.email ? "recovery-email-error" : undefined} className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-11 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900" /></div>{errors.email && <p id="recovery-email-error" className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}</div><Notice message={errorMessage} error /><button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{isSubmitting ? "Sending your link…" : "Send reset link"}</button><p className="text-xs leading-6 text-gray-500 dark:text-gray-400">We’ll send instructions if this email belongs to an account.</p></form>}
    </AuthCard>
  );
};

export default ForgotPassword;
