import AuthCard from "../components/AuthCard";
import { SettingsNotice as Notice } from "../components/SettingsLayout";
import React, { useEffect, useState } from "react";
import { ArrowRight, Check, CircleAlert, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { resetPassword } from "../services/passwordReset";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../validations/auth.schema";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (status !== "error" || !serverMessage) return;
    const timer = window.setTimeout(() => setServerMessage(""), 7000);
    return () => window.clearTimeout(timer);
  }, [status, serverMessage]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerMessage("");

    if (!token) {
      setStatus("error");
      setServerMessage("This password reset link is invalid or missing.");
      return;
    }

    try {
      const response = await resetPassword(token, data.newPassword);

      reset();
      setStatus("success");
      setServerMessage(response.message);
    } catch (error) {
      setStatus("error");

      if (axios.isAxiosError(error)) {
        setServerMessage(
          error.response?.data?.message ||
            "We couldn't reset your password. The link may be invalid or expired.",
        );
      } else {
        setServerMessage("Something went wrong. Please try again.");
      }
    }
  };

  const complete = status === "success";
  return (
    <AuthCard title={complete ? "A fresh start." : !token ? "This link is incomplete." : "Choose a new password."} description={complete ? "Your password has been reset. Sign in with your new password to continue." : !token ? "Request a new reset link to safely recover your account." : "Create a memorable password you haven’t used elsewhere."} icon={complete ? Check : !token ? CircleAlert : LockKeyhole} tone={complete ? "green" : !token ? "amber" : "blue"}>
      {complete || !token ? <Link to={complete ? "/login" : "/forgot-password"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{complete ? "Continue to sign in" : "Request a new link"}<ArrowRight size={17} aria-hidden="true" /></Link> : <form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className="space-y-5"><fieldset disabled={isSubmitting} className="space-y-5">{([{name:"newPassword",label:"New password",visible:showPassword,toggle:setShowPassword},{name:"confirmPassword",label:"Confirm password",visible:showConfirmPassword,toggle:setShowConfirmPassword}] as const).map(field => <div key={field.name}><label htmlFor={field.name} className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">{field.label}</label><div className="relative"><input {...register(field.name)} id={field.name} type={field.visible ? "text" : "password"} autoComplete="new-password" placeholder={field.label} aria-invalid={!!errors[field.name]} className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-14 pl-4 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900" /><button type="button" onClick={() => field.toggle(value => !value)} aria-label={(field.visible ? "Hide " : "Show ") + field.label.toLowerCase()} aria-pressed={field.visible} className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">{field.visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors[field.name] && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors[field.name]?.message}</p>}</div>)}<p className="text-xs leading-6 text-gray-500 dark:text-gray-400">Use at least 8 characters. A longer passphrase can be easier to remember.</p><Notice message={status === "error" ? serverMessage : ""} error /><button type="submit" className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{isSubmitting ? "Updating password…" : "Reset password"}</button></fieldset><Link to="/forgot-password" className="inline-flex min-h-10 items-center text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">Need a fresh reset link?</Link></form>}
    </AuthCard>
  );
};

export default ResetPassword;
