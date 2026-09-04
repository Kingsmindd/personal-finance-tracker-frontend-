import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary } from "../services/summary";
import { useAuth } from "../hooks/useAuth";
import Quicktransaction from "./Quicktransaction";
import RecentTransactions from "./RecentTransactions";
import { getRecentTransactions } from "../services/transaction";
import { Settings as SettingsIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const {
    data: summary,
    isLoading,
  } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: getFinancialSummary,
  });

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: getRecentTransactions,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: user?.currency || "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  return (
    <div className="min-h-screen bg-gray-50  dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Personal Finance
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white  sm:text-3xl">
              Welcome back, {user?.name || "there"} 👋
            </h1>

            <p className="mt-2 text-sm  text-gray-500 dark:text-gray-400">
              Here's an overview of your finances.
            </p>
          </div>
          <div className="flex flex-col md:flex-row  items-center gap-6 ">
            <button
              onClick={() => navigate("/transactions")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Plus size={18} />
              Veiw and Add Transaction
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <WalletCards size={19} className="text-blue-600" />
              View Analytics
            </button>

            <Link
              to="/settings"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <SettingsIcon size={18} />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Balance */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <WalletCards
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
              </div>

              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                Total
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Balance
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? "Loading..." : formatCurrency(summary?.balance ?? 0)}
            </h2>
          </div>

          {/* Income */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/40">
                <ArrowDownLeft size={20} className="text-green-600" />
              </div>

              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Income
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Income
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading
                ? "Loading..."
                : formatCurrency(summary?.totalIncome ?? 0)}
            </h2>
          </div>

          {/* Expenses */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40">
                <ArrowUpRight size={20} className="text-red-600" />
              </div>

              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                Expenses
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Expenses
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading
                ? "Loading..."
                : formatCurrency(summary?.totalExpense ?? 0)}
            </h2>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <ReceiptText size={20} className="text-blue-600" />
              </div>

              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Activity
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">
              Transactions
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? "..." : (summary?.transactionCount ?? 0)}
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Transactions */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your latest financial activity
              </p>

              <button
                onClick={() => navigate("/transactions")}
                className="mt-2 text-sm font-bold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                View all
              </button>
            </div>

            {transactionsLoading && (
              <div className="flex min-h-56 items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading transactions...
                </p>
              </div>
            )}

            {transactionsError && (
              <div className="flex min-h-56 items-center justify-center">
                <p className="text-sm text-red-500 dark:text-red-400">
                  Unable to load recent transactions.
                </p>
              </div>
            )}

            {!transactionsLoading &&
              !transactionsError &&
              transactions.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <ReceiptText
                      size={22}
                      className="text-gray-500 dark:text-gray-300"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    No transactions yet
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your recent transactions will appear here.
                  </p>

                  <button
                    onClick={() => navigate("/transactions")}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Plus size={16} />
                    Add your first transaction
                  </button>
                </div>
              )}

            {!transactionsLoading &&
              !transactionsError &&
              transactions.length > 0 && (
                <RecentTransactions transactions={transactions} />
              )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="lg:col-span-1">
              <Quicktransaction />
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your finances quickly.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate("/transactions")}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                  <Plus
                    size={19}
                    className="text-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Add Transaction
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Record income or expense
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/analytics")}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                  <WalletCards size={19} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    View Analytics
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Analyze your spending
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
