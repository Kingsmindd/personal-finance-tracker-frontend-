import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce";

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);
  // Filter state
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | "income" | "expense">("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"createdAt" | "amount" | "title">(
    "createdAt",
  );

  const debouncedSearch = useDebounce(search, 500);
  const debouncedCategory = useDebounce(category, 500);

  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      "transactions",
      page,
      debouncedSearch,
      type,
      debouncedCategory,
      sort,
    ],
    queryFn: () =>
      getTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        type: type || undefined,
        category: debouncedCategory || undefined,
        sort,
        order: "desc",
      }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["financial-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-transactions"],
      });

      setIsDeleteModalOpen(false);
      setSelectedTransactionId(null);
    },

    onError: (error) => {
      console.error(error);
      alert("Failed to delete transaction.");
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
      alert("Failed to download transactions.");
    } finally {
      setIsDownloading(false);
    }
  };
  if (isLoading && !data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-900 dark:bg-red-950/40">
        <p className="text-red-600 dark:text-red-400">
          Failed to load transactions.
        </p>
      </div>
    );
  }

  const transactions = data?.transactions ?? [];

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
      {/* Page Header */}
      {/* Page Header */}
      <div className="relative flex items-center justify-center">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white sm:h-11 sm:w-11"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Page title */}
        <div className="px-14 text-center sm:px-20">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Transactions
          </h1>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Manage your income and expenses
          </p>
        </div>

        {/* Download button */}
        <button
          type="button"
          onClick={handleDownloadTransactions}
          disabled={isDownloading}
          className="absolute right-0 inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white sm:h-11 sm:px-4"
        >
          <Download size={18} />

          <span className="hidden sm:inline">
            {isDownloading ? "Downloading..." : "Download"}
          </span>
        </button>
      </div>

      {/* Filters */}
      <TransactionFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        type={type}
        onTypeChange={(value) => {
          setType(value);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        sort={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onAddTransaction={() => setIsAddModalOpen(true)}
        isFetching={isFetching}
      />

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No transactions found
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or add a new transaction.
          </p>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        <TransactionTable
          transactions={transactions}
          onEdit={(transaction) => setEditingTransaction(transaction)}
          onDelete={(id) => {
            setSelectedTransactionId(id);
            setIsDeleteModalOpen(true);
          }}
        />
      )}

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

      {/* Pagination */}
      <Pagination
        page={page}
        limit={data?.limit ?? 10}
        total={data?.total ?? 0}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Transactions;
