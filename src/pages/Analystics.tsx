import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary } from "../services/summary";
import { getMonthlyAnalytics } from "../services/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Analystics: React.FC = () => {
  const [monthsToShow, setMonthsToShow] = useState<number | "all">(6);
  const [isChartDragging, setIsChartDragging] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: user?.currency || "NGN",
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatAxisCurrency = (value: number) => {
    const currency = user?.currency || "NGN";

    const symbol = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 4,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value;

    if (value >= 1_000_000) {
      return `${symbol}${(value / 1_000_000).toLocaleString()}M`;
    }

    if (value >= 1_000) {
      return `${symbol}${(value / 1_000).toLocaleString()}K`;
    }

    return `${symbol}${value.toLocaleString()}`;
  };
  const { isLoading, isError } = useQuery({
    queryKey: ["financial-summary", user?.id],
    queryFn: getFinancialSummary,
  });

  const {
    data: monthlyData,
    isLoading: isMonthlyLoading,
    isError: isMonthlyError,
  } = useQuery({
    queryKey: ["monthly-analytics", user?.id, monthsToShow],
    queryFn: () => getMonthlyAnalytics(monthsToShow),
  });

  const filteredMonthlyData = monthlyData ?? [];

  // 6 months fits normally.
  // 12, 24 and All Time become horizontally draggable.
  const isDraggable = monthsToShow === "all" || monthsToShow >= 12;

  const monthOptions = [6, 12, 24];

  if (isLoading) {
    return (
      <div
        role="status"
        className="min-h-dvh bg-gray-50 p-6 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        Loading analytics...
      </div>
    );
  }

  if (isError) {
    return <div>Failed to load analytics.</div>;
  }

  if (isMonthlyLoading) {
    return (
      <div
        role="status"
        className="min-h-dvh bg-gray-50 p-6 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        Loading monthly analytics...
      </div>
    );
  }

  if (isMonthlyError) {
    return <div>Failed to load monthly analytics.</div>;
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
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
        <div className="px-14 text-center sm:px-16">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Analytics
          </h1>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Track your financial performance over time
          </p>
        </div>
      </div>

      {/* Income vs Expenses */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        {/* Chart header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Income vs Expenses
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Compare your income and expenses over time.
            </p>
          </div>

          {/* Period selector */}
          <div className="w-full sm:w-auto">
            <select
              value={monthsToShow}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "all") {
                  setMonthsToShow("all");
                } else {
                  setMonthsToShow(Number(value));
                }
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-500 sm:w-auto"
            >
              {monthOptions.map((months) => (
                <option key={months} value={months}>
                  Last {months} months
                </option>
              ))}

              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6 w-full overflow-hidden">
          <div
            className={
              isDraggable
                ? "chart-scrollbar w-full overflow-x-auto"
                : "w-full overflow-hidden"
            }
          >
            <div
              className={
                isDraggable
                  ? "h-64 sm:h-72 lg:h-80"
                  : "h-64 w-full sm:h-72 lg:h-80"
              }
              style={
                isDraggable
                  ? {
                      width: `${Math.max(
                        filteredMonthlyData.length * 80,
                        700,
                      )}px`,
                    }
                  : undefined
              }
              onPointerDown={() => {
                if (isDraggable) {
                  setIsChartDragging(true);
                }
              }}
              onPointerUp={() => {
                setIsChartDragging(false);
              }}
              onPointerCancel={() => {
                setIsChartDragging(false);
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredMonthlyData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tickMargin={8}
                    tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
                    className="fill-gray-500 dark:fill-gray-400"
                  />

                  <YAxis
                    orientation="left"
                    tick={{
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatAxisCurrency(Number(value))}
                    className="fill-gray-500 dark:fill-gray-400"
                  />

                  {!isChartDragging && (
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "#1f2937"
                            : "#ffffff",
                        borderColor:
                          document.documentElement.classList.contains("dark")
                            ? "#374151"
                            : "#e5e7eb",
                        borderRadius: "12px",
                        color: document.documentElement.classList.contains(
                          "dark",
                        )
                          ? "#ffffff"
                          : "#111827",
                      }}
                      labelStyle={{
                        color: document.documentElement.classList.contains(
                          "dark",
                        )
                          ? "#d1d5db"
                          : "#374151",
                      }}
                    />
                  )}

                  <Legend
                    wrapperStyle={{
                      color: "inherit",
                    }}
                  />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Drag hint */}
        {isDraggable && filteredMonthlyData.length > 6 && (
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            Swipe left or right to explore more months
          </p>
        )}
      </div>

      {/* Monthly Summary */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
            Monthly Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A breakdown of your income, expenses, and net balance.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400 sm:text-sm">
                <th className="px-3 py-3 font-medium sm:px-4">Month</th>

                <th className="px-3 py-3 font-medium sm:px-4">Income</th>

                <th className="px-3 py-3 font-medium sm:px-4">Expense</th>

                <th className="px-3 py-3 font-medium sm:px-4">Net</th>
              </tr>
            </thead>

            <tbody>
              {filteredMonthlyData
                .slice()
                .reverse()
                .map((month) => {
                  const net = month.income - month.expense;

                  return (
                    <tr
                      key={month.month}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                    >
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white sm:px-4">
                        {month.month}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-green-600 dark:text-green-400 sm:px-4">
                        {formatCurrency(month.income)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-red-600 dark:text-red-400 sm:px-4">
                        {formatCurrency(month.expense)}
                      </td>

                      <td
                        className={`whitespace-nowrap px-3 py-4 text-sm font-bold sm:px-4 ${
                          net >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analystics;
