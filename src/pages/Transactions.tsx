import { SettingsNotice as Notice } from "../components/SettingsLayout";
import { useAuth } from "../hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditTransactionModal from "../components/Transactions/EditTransactionModal";
import TransactionFilters from "../components/Transactions/TransactionsFilters";
import TransactionTable from "../components/Transactions/TransactionTable";
import {
  deleteTransaction,
  downloadTransactions,
  getTransactions,
  type Transaction,
} from "../services/transaction";
import DeleteTransactionModal from "../components/Transactions/DeleteTransactionModal";
import AddTransactionModal from "../components/Transactions/AddTransactionModal";
import Pagination from "../components/Transactions/Pagination";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, LoaderCircle, Plus, ReceiptText, RefreshCw } from "lucide-react";
import { keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce";

const Transactions: React.FC = () => {

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; error?: boolean } | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), notice.error ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  // Filter state
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | "income" | "expense">("");
  const [sort, setSort] = useState<"occurredAt" | "amount" | "title">(
    "occurredAt",
  );

  const debouncedSearch = useDebounce(search, 300);

  const isTyping = search !== debouncedSearch;

  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [
      "transactions",
      user?.id,
      page,
      debouncedSearch,
      type,
      sort,
    ],
    queryFn: ({ signal }) =>
      getTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        type: type || undefined,
        sort,
        order: "desc",
      }, signal),
    placeholderData: keepPreviousData,
    enabled: !isTyping,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,

    onSuccess: () => {
      if (data?.transactions.length === 1 && page > 1) setPage(page - 1);
      queryClient.invalidateQueries({ queryKey: ["monthly-analytics"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["financial-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-transactions"],
      });

      setNotice({ message: "Transaction deleted." });
      setIsDeleteModalOpen(false);
      setSelectedTransactionId(null);
    },

    onError: (error) => {
      console.error(error);
      setNotice({ message: "We couldn’t delete that transaction. Please try again.", error: true });
    },
  });
  const handleDownloadTransactions = async () => {
    try {
      setIsDownloading(true);

      const blob = await downloadTransactions();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "transactions.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setNotice({ message: "We couldn’t export your transactions. Please try again.", error: true });
    } finally {
      setIsDownloading(false);
    }
  };
  const transactions = data?.transactions ?? [];
  const updating = isTyping || isFetching;
  const filtered = !!search || !!type;
  function resetFilters() { setSearch(""); setType(""); setSort("occurredAt"); setPage(1); }
  const primary = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <Link to="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-blue-400"><ArrowLeft size={17} aria-hidden="true" />Back to dashboard</Link>
        <header className="flex flex-col gap-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/25 sm:p-8 xl:flex-row xl:items-center xl:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Your financial records</p><h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Every transaction, in one place.</h1><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">Find, organise, and keep track of your income and expenses.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0">
            <button type="button" onClick={() => setIsAddModalOpen(true)} className={primary}><Plus size={18} aria-hidden="true" />Add transaction</button>
            <button type="button" onClick={handleDownloadTransactions} disabled={isDownloading} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">{isDownloading ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Download size={17} aria-hidden="true" />}{isDownloading ? "Exporting…" : "Export all CSV"}</button>
          </div>
        </header>
        <Notice message={notice?.message || ""} error={notice?.error} />
        <TransactionFilters search={search} onSearchChange={value => { setSearch(value); setPage(1); }} type={type} onTypeChange={value => { setType(value); setPage(1); }} sort={sort} onSortChange={value => { setSort(value); setPage(1); }} onReset={resetFilters} isFetching={updating} />
        <section aria-label="Transaction records" aria-busy={updating} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{filtered ? "Matching records" : "All transactions"}{data && !isError && <span className="ml-2 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">{data.total}</span>}</h2><span role="status" className="flex min-h-6 items-center gap-2 text-xs text-gray-500 dark:text-gray-400">{updating ? <><LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />Updating records…</> : "Amounts shown in " + (user?.currency || "NGN")}</span></div>
          <div className={"transition-opacity duration-150 motion-reduce:transition-none " + (updating && data ? "opacity-60" : "opacity-100")}>
          {isLoading && !data ? <div role="status" aria-label="Loading transactions" className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">{[1,2,3,4].map(n => <div key={n} className="h-14 animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none dark:bg-gray-800" />)}</div> : isError ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><p>We couldn’t load your transactions.</p><button type="button" disabled={isFetching} onClick={() => void refetch()} className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 font-semibold disabled:opacity-50"><RefreshCw size={16} aria-hidden="true" />Try again</button></div> : transactions.length === 0 ? <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><ReceiptText size={26} aria-hidden="true" /></div><h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{filtered ? "No records match your filters" : "Start with your first transaction"}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">{filtered ? "Try another search or clear the filters to see all your records." : "Record an income or expense to start building your financial overview."}</p><button type="button" onClick={filtered ? resetFilters : () => setIsAddModalOpen(true)} className={primary + " mt-6"}>{filtered ? "Clear filters" : "Add transaction"}</button></div> : <TransactionTable transactions={transactions} disabled={updating} onEdit={transaction => setEditingTransaction(transaction)} onDelete={id => { setSelectedTransactionId(id); setIsDeleteModalOpen(true); }} />}
          </div>
          {!isError && data && <Pagination page={page} limit={data.limit} total={data.total} totalPages={data.totalPages} disabled={updating} onPageChange={setPage} />}
        </section>
      {/* Edit Transaction */}
      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />

      {/* Delete Transaction */}
      <DeleteTransactionModal
        open={isDeleteModalOpen}
        loading={deleteMutation.isPending}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedTransactionId(null);
        }}
        onConfirm={() => {
          if (!selectedTransactionId) return;

          deleteMutation.mutate(selectedTransactionId);
        }}
      />

      {/* Add Transaction */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />


      </div>
    </main>
  );
};

export default Transactions;
