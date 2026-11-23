import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Check, ChevronRight, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function SettingsLayout({ title, description, icon: Icon, children, back = "/settings", backLabel = "Back to settings" }: { title: string; description: string; icon: LucideIcon; children: ReactNode; back?: string; backLabel?: string }) {
  return <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 sm:py-8"><div className="mx-auto max-w-4xl space-y-6"><Link to={back} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-blue-400"><ArrowLeft size={17} aria-hidden="true" />{backLabel}</Link><header className="rounded-3xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/25 sm:p-8"><span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-blue-200 bg-white text-blue-700 dark:border-blue-800 dark:bg-gray-900 dark:text-blue-400"><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span><p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Personal Finance Tracker</p><h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">{description}</p></header>{children}</div></main>;
}

export function SettingsNotice({ message, error = false, className = "" }: { message: string; error?: boolean; className?: string }) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({ message, error });

  // Keep the last message visible while its container closes.
  if (message && (message !== content.message || error !== content.error)) {
    setContent({ message, error });
  }

  useEffect(() => {
    let nextFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      nextFrame = window.requestAnimationFrame(() => setVisible(!!message));
    });
    return () => { window.cancelAnimationFrame(frame); window.cancelAnimationFrame(nextFrame); };
  }, [message]);

  const Icon = content.error ? CircleAlert : Check;
  return (
    <div aria-hidden={!message} style={{ marginBlock: visible ? undefined : 0 }} className={"grid transition-[grid-template-rows,opacity,transform,margin] duration-250 ease-out motion-reduce:transition-none " + (visible ? "grid-rows-[1fr] translate-y-0 opacity-100" : "pointer-events-none grid-rows-[0fr] -translate-y-1 opacity-0") + " " + className}>
      <div className="min-h-0 overflow-hidden">
        <div role={message ? (content.error ? "alert" : "status") : undefined} className={"flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 " + (content.error ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300")}>
          <Icon size={18} className="mt-1 shrink-0" aria-hidden="true" /><p>{content.message}</p>
        </div>
      </div>
    </div>
  );
}

export function SettingsLink({ to, title, description, icon: Icon }: { to: string; title: string; description: string; icon: LucideIcon }) {
  return <Link to={to} className="group flex min-h-22 items-center gap-4 p-5 transition hover:bg-blue-50/60 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-500 dark:hover:bg-blue-950/20 sm:p-6"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><Icon size={20} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-gray-900 dark:text-white">{title}</span><span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">{description}</span></span><ChevronRight size={18} className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" /></Link>;
}
