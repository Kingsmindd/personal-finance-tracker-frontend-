import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
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

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Mobile */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {start}
          </span>
          –
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {end}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {total}
          </span>{" "}
          transactions
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Go to previous page"
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-gray-900 px-3 text-sm font-semibold text-white dark:bg-gray-700">
            {page}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Go to next page"
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden items-center justify-between gap-4 md:flex">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {start}
          </span>
          –
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {end}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {total}
          </span>{" "}
          transactions
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Go to previous page"
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {pages.map((item, index) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-500 dark:text-gray-400"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item as number)}
                aria-current={page === item ? "page" : undefined}
                className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
                  page === item
                    ? "bg-gray-900 text-white dark:bg-gray-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Go to next page"
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
