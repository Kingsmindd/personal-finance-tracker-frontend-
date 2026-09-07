import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../../services/transaction";
import { useAuth } from "../../hooks/useAuth";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: user?.currency || "NGN",
      maximumFractionDigits: 4,
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions found.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="space-y-4 md:hidden">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                  {transaction.title}
                </h3>

                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  {transaction.category}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  transaction.type === "income"
                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                }`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Amount
                </p>

                <p
                  className={`break-all font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(transaction.occurredAt).toLocaleDateString(undefined, { timeZone: "UTC" })}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
              <button
                type="button"
                onClick={() => onEdit(transaction)}
                aria-label={`Edit ${transaction.title}`}
                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
              >
                <Pencil size={18} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(transaction.id)}
                aria-label={`Delete ${transaction.title}`}
                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left">
                <th className="w-[24%] px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Title
                </th>

                <th className="w-[18%] px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Category
                </th>

                <th className="w-[18%] px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Date
                </th>

                <th className="w-[16%] px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Amount
                </th>

                <th className="w-[12%] px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Type
                </th>

                <th className="w-[12%] py-4 pr-10 pl-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 text-left font-medium text-gray-900 dark:text-white">
                    {transaction.title}
                  </td>

                  <td className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                    {transaction.category}
                  </td>

                  <td className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                    {new Date(transaction.occurredAt).toLocaleDateString(undefined, { timeZone: "UTC" })}
                  </td>

                  <td
                    className={`px-6 py-4 text-left font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td className="px-6 py-4 text-left">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(transaction)}
                        aria-label={`Edit ${transaction.title}`}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(transaction.id)}
                        aria-label={`Delete ${transaction.title}`}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
