import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import type { Transaction } from "../services/transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: user?.currency || "NGN",
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));
  };

  return (
    <ul aria-label="Recent transactions" className="divide-y divide-gray-100 px-5 dark:divide-gray-800 sm:px-6">
      {transactions.map(transaction => {
        const income = transaction.type === "income";
        return (
          <li key={transaction.id} className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-2 py-5 sm:grid-cols-[2.75rem_minmax(0,1fr)_minmax(0,0.7fr)] sm:items-center sm:gap-x-4">
            <div className={"row-span-2 grid h-11 w-11 place-items-center rounded-xl sm:row-span-1 " + (income ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400")}>{income ? <ArrowDownLeft size={20} aria-hidden="true" /> : <ArrowUpRight size={20} aria-hidden="true" />}</div>
            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-gray-900 dark:text-white">{transaction.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400"><span className="max-w-full break-words rounded-md bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{transaction.category}</span><time dateTime={transaction.occurredAt}>{formatDate(transaction.occurredAt)}</time></div>
            </div>
            <div className="col-start-2 min-w-0 sm:col-start-auto sm:text-right">
              <p className={"break-all text-sm font-semibold tabular-nums " + (income ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}><span className="sr-only">{income ? "Income: " : "Expense: "}</span>{income ? "+" : "−"}{formatCurrency(transaction.amount)}</p>
              <p className="mt-1 hidden text-xs text-gray-400 sm:block">{income ? "Income" : "Expense"}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecentTransactions;
