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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="p-5">
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  transaction.type === "income"
                    ? "bg-green-50 dark:bg-green-950/40"
                    : "bg-red-50 dark:bg-red-950/40"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowDownLeft
                    size={18}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <ArrowUpRight
                    size={18}
                    className="text-red-600 dark:text-red-400"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {transaction.title}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
            </div>

            <p
              className={`shrink-0 text-sm font-semibold ${
                transaction.type === "income"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
