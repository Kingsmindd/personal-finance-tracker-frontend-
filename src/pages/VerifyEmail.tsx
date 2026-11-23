import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import AuthCard from "../components/AuthCard";
import SettingsLayout, { SettingsNotice as Notice } from "../components/SettingsLayout";
import { ArrowRight, Check, CircleAlert, LoaderCircle, Mail, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { queryClient } from "../lib/queryClient";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../services/verifyEmail";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const location = useLocation();
  const inSettings = location.pathname === "/settings/verification";
  const { user } = useAuth();
  const verification = useQuery({
    queryKey: ["verification-status", user?.id],
    queryFn: async ({ signal }) => {
      const response = await api.get<{ user: { emailVerified: boolean } }>("/auth/me", { signal });
      return response.data.user.emailVerified;
    },
    enabled: inSettings && !!user,
    refetchOnWindowFocus: "always",
    retry: 1,
  });
  const [email, setEmail] = useState(user?.email || "");
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), noticeIsError ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [notice, noticeIsError]);

  async function requestLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice("");
    setNoticeIsError(false);
    try {
      const response = await resendVerificationEmail((inSettings ? user?.email || "" : email).trim());
      setNotice(response.message);
    } catch {
      setNoticeIsError(true);
      setNotice("We couldn’t process your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const verificationStarted = React.useRef<string | null>(null);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Enter your account email to request a verification link.",
  );

  useEffect(() => {
    if (!token || verificationStarted.current === token) return;
    verificationStarted.current = token;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        void queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        setStatus("success");
        setMessage(response.message);
      } catch (error: unknown) {
        setStatus("error");

        setMessage(
          (axios.isAxiosError(error) && error.response?.data?.message) ||
            "We couldn't verify your email. The link may be invalid or expired.",
        );
      }
    };

    verify();
  }, [token]);

  const complete = status === "success";
  const failed = status === "error" && !!token;
  const busy = status === "loading";
  const destination = user ? "/dashboard" : "/login";

  if (inSettings) return (
    <SettingsLayout title="Email verification." description="Confirm your account email to start recording income and expenses." icon={MailCheck}>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><Mail size={20} aria-hidden="true" /></span>
          <div className="min-w-0"><h2 className="text-sm font-semibold text-gray-900 dark:text-white">Account email</h2><p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">{user?.email}</p></div>
        </header>
        <div className="space-y-5 p-5 sm:p-6">
          {verification.isPending ? <p role="status" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />Checking your email status…</p> : verification.isError ? <div><p className="text-sm text-gray-600 dark:text-gray-400">We couldn’t check your verification status.</p><button type="button" onClick={() => void verification.refetch()} className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400"><RefreshCw size={16} aria-hidden="true" />Try again</button></div> : verification.data ? <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/25"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /><div><h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Your email is verified</h3><p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-400">You’re ready to add transactions and track your finances.</p></div></div> : <>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/25"><h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">One step left</h3><p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-400">Send a secure link to your account email, then open it to finish verification.</p></div>
            <form onSubmit={requestLink} className="space-y-4" aria-busy={sending}>
              <Notice message={notice} error={noticeIsError} />
              <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" disabled={sending} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{sending ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}{sending ? "Sending your link…" : "Send verification email"}</button><button type="button" disabled={verification.isFetching} onClick={() => void verification.refetch()} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"><RefreshCw size={16} className={verification.isFetching ? "animate-spin motion-reduce:animate-none" : ""} aria-hidden="true" />{verification.isFetching ? "Checking…" : "I’ve verified my email"}</button></div>
              <p className="text-xs leading-6 text-gray-500 dark:text-gray-400">Your link expires in 24 hours. Check your spam or junk folder if it doesn’t arrive.</p>
            </form>
          </>}
        </div>
      </section>
    </SettingsLayout>
  );

  return (
    <AuthCard title={busy ? "Verifying your email…" : complete ? "Email confirmed." : failed ? "Let’s get you a fresh link." : "Confirm your email."} description={busy ? "We’re confirming your email address. This should only take a moment." : complete ? "You can now record income and expenses and build a clearer picture of your finances." : failed ? message : "We’ll send a secure link to your account email. Confirm it to start adding transactions."} icon={busy ? LoaderCircle : complete ? Check : failed ? CircleAlert : Mail} busy={busy} tone={complete ? "green" : failed ? "amber" : "blue"} back={destination} backLabel={user ? "Back to dashboard" : "Back to sign in"}>
      {busy ? <p role="status" className="text-sm text-gray-500 dark:text-gray-400">Please keep this page open while we check your link.</p> : complete ? <Link to={destination} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{user ? "Continue to dashboard" : "Continue to sign in"}<ArrowRight size={17} aria-hidden="true" /></Link> : <form onSubmit={requestLink} aria-busy={sending} className="space-y-5"><div><label htmlFor="verification-email" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Account email</label><div className="relative"><Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="verification-email" type="email" autoComplete="email" required maxLength={254} disabled={sending} placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-11 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900" /></div></div><Notice message={notice} error={noticeIsError} /><button type="submit" disabled={sending} className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{sending ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{sending ? "Sending your link…" : "Send verification link"}</button><p className="text-xs leading-6 text-gray-500 dark:text-gray-400">Your link expires in 24 hours. Check your spam or junk folder if it doesn’t arrive.</p></form>}
    </AuthCard>
  );
};

export default VerifyEmail;
