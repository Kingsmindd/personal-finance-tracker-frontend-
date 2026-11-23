import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // Show every page if there are few pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Near the beginning
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }

      pages.push("...");
      pages.push(totalPages);

      return pages;
    }

    // Near the end
    if (page >= totalPages - 3) {
      pages.push(1);
      pages.push("...");

      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Middle
    pages.push(1);
    pages.push("...");

    for (let i = page - 1; i <= page + 1; i++) {
      pages.push(i);
    }

    pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  if (total === 0) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const button = "inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-blue-950/30";
  return (
    <nav aria-label="Transaction pagination" className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:flex-row">
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{start}–{end}</span> of <span className="font-semibold text-gray-700 dark:text-gray-200">{total}</span> transactions</p>
      {totalPages > 1 && <div className="flex max-w-full items-center justify-center gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1} aria-label="Go to previous page" className={button}><ChevronLeft size={16} aria-hidden="true" /><span className="hidden sm:inline">Previous</span></button>
        <span className="px-1 text-xs font-medium text-gray-600 dark:text-gray-300 md:hidden">Page {page} of {totalPages}</span>
        <div className="hidden items-center gap-1 md:flex">{pages.map((item,index) => typeof item === "number" ? <button key={item} type="button" disabled={disabled} onClick={() => onPageChange(item)} aria-label={"Go to page " + item} aria-current={page === item ? "page" : undefined} className={"grid h-10 min-w-10 cursor-pointer place-items-center rounded-xl px-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-50 " + (page === item ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-950/30")}>{item}</button> : <span key={"ellipsis-"+index} aria-hidden="true" className="px-1 text-gray-400">…</span>)}</div>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={disabled || page >= totalPages} aria-label="Go to next page" className={button}><span className="hidden sm:inline">Next</span><ChevronRight size={16} aria-hidden="true" /></button>
      </div>}
    </nav>
  );
};

export default Pagination;
