import type { ReactNode } from "react";
import { ArrowRight, LoaderCircle, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function VerifiedTransactionGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const status = useQuery({
    queryKey: ["verification-status", user?.id],
    queryFn: async ({ signal }) => {
      const response = await api.get<{ user: { emailVerified: boolean } }>("/auth/me", { signal });
      return response.data.user.emailVerified;
    },
    enabled: !!user,
    refetchOnWindowFocus: "always",
    retry: 1,
  });

  if (status.isPending) return <p role="status" className="flex items-center gap-2 py-6 text-sm text-gray-500 dark:text-gray-400"><LoaderCircle aria-hidden="true" size={18} className="animate-spin motion-reduce:animate-none" />Checking your account…</p>;
  if (status.isError) return <div className="my-5 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm dark:border-gray-700 dark:bg-gray-900/50"><p className="text-gray-600 dark:text-gray-300">We couldn’t check your verification status.</p><button type="button" onClick={() => void status.refetch()} className="mt-3 inline-flex cursor-pointer items-center gap-2 font-semibold text-blue-600 hover:underline dark:text-blue-400"><RefreshCw size={16} aria-hidden="true" />Try again</button></div>;
  if (!status.data) return (
    <section aria-label="Email verification required" className="my-5 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/60 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"><ShieldCheck size={15} aria-hidden="true" />One step to get started</div>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><MailCheck size={25} strokeWidth={1.7} aria-hidden="true" /></div>
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Confirm your email. Start tracking.</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">Verify your email before adding income or expenses. You can explore your dashboard and settings in the meantime.</p>
        {user?.email && <p className="mt-4 break-all rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">{user.email}</p>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/verify-email" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Verify my email<ArrowRight size={16} aria-hidden="true" /></Link>
          <button type="button" onClick={() => void status.refetch()} disabled={status.isFetching} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"><RefreshCw size={16} aria-hidden="true" className={status.isFetching ? "animate-spin motion-reduce:animate-none" : ""} />{status.isFetching ? "Checking…" : "I’ve verified my email"}</button>
        </div>
        <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">Already requested a link? Check your inbox and spam folder.</p>
      </div>
    </section>
  );
  return children;
}
