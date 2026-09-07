import React from "react";
import { Plus, Search, Loader2 } from "lucide-react";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  type: "" | "income" | "expense";
  onTypeChange: (value: "" | "income" | "expense") => void;

  category: string;
  onCategoryChange: (value: string) => void;

  sort: "occurredAt" | "amount" | "title";
  onSortChange: (value: "occurredAt" | "amount" | "title") => void;

  onAddTransaction: () => void;
  isFetching: boolean;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  onAddTransaction,
  isFetching,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search transactions"
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          />

          {isFetching && (
            <Loader2
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400 dark:text-gray-500"
            />
          )}
        </div>

        {/* Type */}
        <select
          aria-label="Filter by transaction type"
          value={type}
          onChange={(e) =>
            onTypeChange(e.target.value as "" | "income" | "expense")
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category */}
        <input
          type="text"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
          placeholder="Category"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
        />

        {/* Sort */}
        <select
          aria-label="Sort transactions"
          value={sort}
          onChange={(e) =>
            onSortChange(e.target.value as "occurredAt" | "amount" | "title")
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500"
        >
          <option value="occurredAt">Newest</option>
          <option value="amount">Amount</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Add transaction */}
      <div className="mt-5 flex justify-stretch sm:justify-end">
        <button
          type="button"
          onClick={onAddTransaction}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] dark:bg-gray-700 dark:hover:bg-gray-600 sm:w-auto"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;
