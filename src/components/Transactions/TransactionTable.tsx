import React from "react";
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../../services/transaction";
import { useAuth } from "../../hooks/useAuth";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: user?.currency || "NGN",
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatDate = (date: string) => new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
  const badge = (income: boolean) => "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold " + (income ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400");
  const actions = (transaction: Transaction) => <div className="flex items-center justify-end gap-2"><button type="button" disabled={disabled} onClick={() => onEdit(transaction)} aria-label={"Edit " + transaction.title} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-wait disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"><Pencil size={15} aria-hidden="true" />Edit</button><button type="button" disabled={disabled} onClick={() => onDelete(transaction.id)} aria-label={"Delete " + transaction.title} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-100 px-3 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-wait disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"><Trash2 size={15} aria-hidden="true" />Delete</button></div>;

  return (
    <>
      <div className="space-y-3 lg:hidden">{transactions.map(transaction => {
        const income = transaction.type === "income";
        return <article key={transaction.id} className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start gap-3"><div className={"grid h-10 w-10 shrink-0 place-items-center rounded-xl " + (income ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400")}>{income ? <ArrowDownLeft size={19} aria-hidden="true" /> : <ArrowUpRight size={19} aria-hidden="true" />}</div><div className="min-w-0 flex-1"><h3 className="break-words text-sm font-semibold text-gray-900 dark:text-white">{transaction.title}</h3><p className="mt-1 break-words text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p></div></div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className={"max-w-full break-all text-xl font-bold tabular-nums " + (income ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white")}>{income ? "+" : "−"}{formatCurrency(transaction.amount)}</p><span className={badge(income)}>{income ? "Income" : "Expense"}</span></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800"><time dateTime={transaction.occurredAt} className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.occurredAt)}</time>{actions(transaction)}</div>
        </article>;
      })}</div>
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:block"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><caption className="sr-only">Transactions in {user?.currency || "NGN"}</caption><thead className="bg-gray-100/60 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800/40 dark:text-gray-400"><tr>{["Transaction", "Date", "Type", "Amount", "Actions"].map(label => <th key={label} scope="col" className={"px-6 py-4 font-semibold " + (["Amount","Actions"].includes(label) ? "text-right" : "")}>{label}</th>)}</tr></thead><tbody className="divide-y divide-gray-100 dark:divide-gray-800">{transactions.map(transaction => { const income = transaction.type === "income"; return <tr key={transaction.id} className="transition hover:bg-blue-50/40 dark:hover:bg-gray-800/40"><th scope="row" className="max-w-xs px-6 py-5 font-normal"><p className="break-words text-sm font-semibold text-gray-900 dark:text-white">{transaction.title}</p><p className="mt-1 break-words text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p></th><td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500 dark:text-gray-400"><time dateTime={transaction.occurredAt}>{formatDate(transaction.occurredAt)}</time></td><td className="px-6 py-5"><span className={badge(income)}>{income ? "Income" : "Expense"}</span></td><td className={"whitespace-nowrap px-6 py-5 text-right text-sm font-semibold tabular-nums " + (income ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}>{income ? "+" : "−"}{formatCurrency(transaction.amount)}</td><td className="px-6 py-5">{actions(transaction)}</td></tr>; })}</tbody></table></div></div>
    </>
  );
};

export default TransactionTable;
