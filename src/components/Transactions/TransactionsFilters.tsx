import React from "react";
import { ArrowDownLeft, ArrowUpRight, ArrowDownWideNarrow, ChevronDown, Search, Loader2, SlidersHorizontal, RotateCcw, X } from "lucide-react";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  type: "" | "income" | "expense";
  onTypeChange: (value: "" | "income" | "expense") => void;

  sort: "occurredAt" | "amount" | "title";
  onSortChange: (value: "occurredAt" | "amount" | "title") => void;

  onReset: () => void;
  isFetching: boolean;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
  onReset,
  isFetching,
}) => {
  const active = !!search || !!type || sort !== "occurredAt";
  const input = "min-h-12 min-w-0 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/60";
  const label = "mb-2 block text-xs font-semibold text-gray-600 dark:text-gray-400";
  return (
    <section aria-label="Transaction filters" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200"><SlidersHorizontal size={17} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />Find a transaction</h2><button type="button" onClick={onReset} disabled={!active} className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-default disabled:text-gray-400 disabled:hover:bg-transparent dark:text-blue-400 dark:hover:bg-blue-950/30"><RotateCcw size={14} aria-hidden="true" />Reset</button></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <div className="sm:col-span-2 xl:col-span-4"><label htmlFor="transaction-search" className={label}>Search records</label><div className="relative"><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="transaction-search" type="search" value={search} onChange={event => onSearchChange(event.target.value)} placeholder="Search your transactions…" className={input + " pr-11 pl-11 [&::-webkit-search-cancel-button]:appearance-none"} />{search && <button type="button" aria-label="Clear search" onClick={() => onSearchChange("")} className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X size={16} aria-hidden="true" /></button>}</div></div>
        <div className="sm:col-span-2 xl:col-span-4"><span id="transaction-type-label" className={label}>Transaction type</span><div role="group" aria-labelledby="transaction-type-label" className="grid min-h-12 grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">{([{ value: "", text: "All" }, { value: "income", text: "Income" }, { value: "expense", text: "Expenses" }] as const).map(option => <button key={option.text} type="button" aria-pressed={type === option.value} onClick={() => onTypeChange(option.value)} className={"inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none " + (type === option.value ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white")}>{option.value === "income" && <ArrowDownLeft size={14} aria-hidden="true" />}{option.value === "expense" && <ArrowUpRight size={14} aria-hidden="true" />}{option.text}</button>)}</div></div>
        <div className="sm:col-span-2 xl:col-span-4">
          <label htmlFor="transaction-sort" className={label}>Sort by</label>
          <div className="relative">
            <ArrowDownWideNarrow size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400" />
            <select id="transaction-sort" value={sort} onChange={event => onSortChange(event.target.value as "occurredAt" | "amount" | "title")} className="min-h-13 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pr-11 pl-11 text-base font-medium text-gray-800 shadow-sm outline-none transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-700 dark:focus:ring-blue-900/60">
              <option value="occurredAt">Newest first</option>
              <option value="amount">Highest amount</option>
              <option value="title">Title · Z to A</option>
            </select>
            <ChevronDown size={17} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="mt-3 min-h-5"><p role="status" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">{isFetching ? <><Loader2 size={13} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />Updating your results…</> : "Filters update automatically as you type."}</p></div>
    </section>
  );
};

export default TransactionFilters;
