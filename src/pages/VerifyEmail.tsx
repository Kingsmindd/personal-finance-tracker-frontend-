import AuthCard from "../components/AuthCard";
import { SettingsNotice as Notice } from "../components/SettingsLayout";
import { ArrowRight, Check, CircleAlert, LoaderCircle, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { queryClient } from "../lib/queryClient";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../services/verifyEmail";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useAuth();
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
      const response = await resendVerificationEmail(email.trim());
      setNotice(response.message);
    } catch {
      setNoticeIsError(true);
      setNotice("We couldn’t process your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const verificationStarted = React.useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Enter your account email to request a verification link.",
  );

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    if (!token) return;

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

  return (
    <AuthCard title={busy ? "Verifying your email…" : complete ? "Email confirmed." : failed ? "Let’s get you a fresh link." : "Confirm your email."} description={busy ? "We’re confirming your email address. This should only take a moment." : complete ? "You can now record income and expenses and build a clearer picture of your finances." : failed ? message : "We’ll send a secure link to your account email. Confirm it to start adding transactions."} icon={busy ? LoaderCircle : complete ? Check : failed ? CircleAlert : Mail} busy={busy} tone={complete ? "green" : failed ? "amber" : "blue"} back={destination} backLabel={user ? "Back to dashboard" : "Back to sign in"}>
      {busy ? <p role="status" className="text-sm text-gray-500 dark:text-gray-400">Please keep this page open while we check your link.</p> : complete ? <Link to={destination} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{user ? "Continue to dashboard" : "Continue to sign in"}<ArrowRight size={17} aria-hidden="true" /></Link> : <form onSubmit={requestLink} aria-busy={sending} className="space-y-5"><div><label htmlFor="verification-email" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Account email</label><div className="relative"><Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="verification-email" type="email" autoComplete="email" required maxLength={254} disabled={sending} placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-11 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900" /></div></div><Notice message={notice} error={noticeIsError} /><button type="submit" disabled={sending} className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{sending ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{sending ? "Sending your link…" : "Send verification link"}</button><p className="text-xs leading-6 text-gray-500 dark:text-gray-400">Your link expires in 24 hours. Check your spam or junk folder if it doesn’t arrive.</p></form>}
    </AuthCard>
  );
};

export default VerifyEmail;
