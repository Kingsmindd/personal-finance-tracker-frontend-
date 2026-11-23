import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  ChartNoAxesCombined,
  RefreshCw,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary } from "../services/summary";
import { useAuth } from "../hooks/useAuth";
import Quicktransaction from "./Quicktransaction";
import RecentTransactions from "./RecentTransactions";
import { getRecentTransactions } from "../services/transaction";
import { Settings as SettingsIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    data: summary,
    isLoading,
    isError: summaryError,
    refetch: retrySummary,
  } = useQuery({
    queryKey: ["financial-summary", user?.id],
    queryFn: getFinancialSummary,
  });

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
    refetch: retryTransactions,
  } = useQuery({
    queryKey: ["recent-transactions", user?.id],
    queryFn: getRecentTransactions,
  });



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: user?.currency || "NGN",
      maximumFractionDigits: 4,
    }).format(amount);
  };
  const secondaryButton = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300";
  const cards = [
    { label: "Total balance", value: summary?.balance ?? 0, icon: WalletCards, note: "Income minus expenses", featured: true, tone: "bg-white/15 text-white" },
    { label: "Total income", value: summary?.totalIncome ?? 0, icon: ArrowDownLeft, note: "Money coming in", tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
    { label: "Total expenses", value: summary?.totalExpense ?? 0, icon: ArrowUpRight, note: "Money going out", tone: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
    { label: "Transactions", value: summary?.transactionCount ?? 0, icon: ReceiptText, note: "All recorded activity", count: true, tone: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <header className="overflow-hidden rounded-3xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/25 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Your financial overview</p>
              <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Welcome back, {user?.name || "there"}.</h1>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">A clearer view of what comes in, what goes out, and what’s left.</p>
            </div>
            <nav aria-label="Dashboard actions" className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap xl:shrink-0">
              <Link to="/transactions" className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"><ReceiptText size={17} aria-hidden="true" />Transactions<ArrowRight size={16} aria-hidden="true" /></Link>
              <Link to="/analytics" className={secondaryButton}><ChartNoAxesCombined size={17} aria-hidden="true" />Analytics</Link>
              <Link to="/settings" className={secondaryButton}><SettingsIcon size={17} aria-hidden="true" />Settings</Link>
            </nav>
          </div>
        </header>

        {summaryError ? <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><p>We couldn’t load your financial overview.</p><button type="button" onClick={() => void retrySummary()} className="inline-flex min-h-10 cursor-pointer items-center gap-2 font-semibold hover:underline"><RefreshCw size={16} aria-hidden="true" />Try again</button></div> : (
          <section aria-label="Financial summary" className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {cards.map(card => <div key={card.label} className={"min-w-0 rounded-2xl border p-5 shadow-sm sm:p-6 " + (card.featured ? "border-blue-600 bg-blue-600 text-white dark:border-blue-700 dark:bg-blue-700" : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900")}>
              <div className="flex items-center justify-between gap-3"><span className={"grid h-10 w-10 place-items-center rounded-xl " + card.tone}><card.icon size={20} strokeWidth={1.8} aria-hidden="true" /></span><span className={"text-xs font-medium " + (card.featured ? "text-blue-100" : "text-gray-400")}>All time</span></div>
              <p className={"mt-5 text-sm font-medium " + (card.featured ? "text-blue-100" : "text-gray-500 dark:text-gray-400")}>{card.label}</p>
              {isLoading ? <div role="status" aria-label={"Loading " + card.label} className={"mt-3 h-7 w-32 animate-pulse rounded-md motion-reduce:animate-none " + (card.featured ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800")} /> : <p className={"mt-1 break-all text-2xl font-bold tracking-tight tabular-nums " + (card.featured ? "text-white" : "text-gray-900 dark:text-white")}>{card.count ? card.value : formatCurrency(card.value)}</p>}
              <p className={"mt-2 text-xs " + (card.featured ? "text-blue-100" : "text-gray-400 dark:text-gray-500")}>{card.note}</p>
            </div>)}
          </section>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6">
              <div><h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Recent transactions</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your latest income and expenses, at a glance.</p></div>
              <Link to="/transactions" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40">View all<ArrowRight size={16} aria-hidden="true" /></Link>
            </header>
            {transactionsLoading ? <div role="status" aria-label="Loading recent transactions" className="space-y-5 p-6">{[1,2,3].map(n => <div key={n} className="flex animate-pulse items-center gap-3 motion-reduce:animate-none"><div className="h-11 w-11 rounded-xl bg-gray-100 dark:bg-gray-800" /><div className="flex-1 space-y-2"><div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" /><div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-800" /></div><div className="h-4 w-20 rounded bg-gray-100 dark:bg-gray-800" /></div>)}</div> : transactionsError ? <div role="alert" className="px-6 py-12 text-center"><p className="text-sm text-gray-600 dark:text-gray-400">We couldn’t load your recent transactions.</p><button type="button" onClick={() => void retryTransactions()} className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"><RefreshCw size={16} aria-hidden="true" />Try again</button></div> : transactions.length ? <RecentTransactions transactions={transactions} /> : <div className="flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><ReceiptText size={26} strokeWidth={1.6} aria-hidden="true" /></div><h3 className="mt-5 font-semibold text-gray-900 dark:text-white">Your story starts with one transaction</h3><p className="mt-2 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">Add your first income or expense using the quick form. Your latest activity will appear here.</p><Link to="/transactions" className={secondaryButton + " mt-5"}>Go to transactions<ArrowRight size={16} aria-hidden="true" /></Link></div>}
            <footer className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:px-6">Keep your records up to date for a clearer overview.</footer>
          </section>
          <div className="min-w-0"><Quicktransaction /></div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
