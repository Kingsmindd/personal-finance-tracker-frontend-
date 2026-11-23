import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyAnalytics } from "../services/analytics";
import { Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, ChartNoAxesCombined, ChevronDown, RefreshCw, WalletCards } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ChartTooltipProps {
  active?: boolean;
  label?: unknown;
  payload?: ReadonlyArray<{ name?: string | number; value?: unknown; color?: string }>;
  format: (value: number) => string;
}

function ChartTooltip({ active, payload, label, format }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="max-w-72 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-3 font-semibold text-gray-900 dark:text-white">{String(label)}</p>
      <div className="space-y-2">{payload.map(item => <div key={String(item.name)} className="flex items-center justify-between gap-5"><span className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="break-all text-right font-semibold tabular-nums text-gray-900 dark:text-white">{format(Number(item.value))}</span></div>)}</div>
    </div>
  );
}

const Analystics: React.FC = () => {
  const [monthsToShow, setMonthsToShow] = useState<number | "all">(6);
  const { user } = useAuth();
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["monthly-analytics", user?.id, monthsToShow],
    queryFn: () => getMonthlyAnalytics(monthsToShow),
  });
  const currency = user?.currency || "NGN";
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 4 }).format(amount);
  const formatAxisCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(amount);
  // Prisma Decimal amounts arrive as JSON strings. Normalize before charting or adding.
  const monthlyData = (data ?? []).map(month => ({ ...month, income: Number(month.income), expense: Number(month.expense), net: Number(month.income) - Number(month.expense) }));
  const income = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const expense = monthlyData.reduce((sum, month) => sum + month.expense, 0);
  const net = income - expense;
  const hasActivity = monthlyData.some(month => month.income > 0 || month.expense > 0);
  const period = monthsToShow === "all" ? "All time" : `Last ${monthsToShow} months`;
  const tickMonth = (value: string) => { const [month, year] = value.split(" "); return `${month.slice(0, 3)} ’${year?.slice(-2) || ""}`; };
  const cards = [
    { label: "Income", value: income, note: "Money coming in", icon: ArrowDownLeft, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
    { label: "Expenses", value: expense, note: "Money going out", icon: ArrowUpRight, tone: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
    { label: "Net balance", value: net, note: "Income minus expenses", icon: WalletCards, tone: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  ];
  const cell = "px-5 py-4 text-right text-sm tabular-nums whitespace-nowrap sm:px-6";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <Link to="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-blue-400"><ArrowLeft size={17} aria-hidden="true" />Back to dashboard</Link>
        <header className="flex flex-col gap-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/25 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Your money in perspective</p><h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Understand your financial habits.</h1><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">Compare your income and expenses, month by month.</p></div>
          <div className="w-full shrink-0 sm:w-56"><label htmlFor="analytics-period" className="mb-2 block text-xs font-semibold text-gray-600 dark:text-gray-400">Reporting period</label><div className="relative"><select id="analytics-period" value={monthsToShow} onChange={event => setMonthsToShow(event.target.value === "all" ? "all" : Number(event.target.value))} className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-blue-200 bg-white py-3 pr-10 pl-4 text-base font-semibold text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:ring-blue-900">{[6,12,24].map(months => <option key={months} value={months}>Last {months} months</option>)}<option value="all">All time</option></select><ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" /></div></div>
        </header>

        {isError ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><p>We couldn’t load analytics for this period.</p><button type="button" disabled={isFetching} onClick={() => void refetch()} className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 font-semibold disabled:opacity-60"><RefreshCw size={16} aria-hidden="true" className={isFetching ? "animate-spin" : ""} />{isFetching ? "Retrying…" : "Try again"}</button></div> : isPending ? <div role="status" aria-label="Loading analytics" className="space-y-6"><div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map(n => <div key={n} className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-white motion-reduce:animate-none dark:border-gray-800 dark:bg-gray-900" />)}</div><div className="h-96 animate-pulse rounded-2xl border border-gray-200 bg-white motion-reduce:animate-none dark:border-gray-800 dark:bg-gray-900" /></div> : (
          <>
            <section aria-label={`${period} totals`} className="grid gap-4 sm:grid-cols-3">{cards.map(card => <div key={card.label} className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"><div className="flex items-center justify-between gap-3"><span className={"grid h-10 w-10 place-items-center rounded-xl " + card.tone}><card.icon size={20} aria-hidden="true" /></span><span className="text-xs text-gray-400">{period}</span></div><p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p><p className="mt-1 break-all text-2xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-white">{formatCurrency(card.value)}</p><p className="mt-2 text-xs text-gray-400">{card.note}</p></div>)}</section>

            {!hasActivity ? <section className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><ChartNoAxesCombined size={26} aria-hidden="true" /></div><h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">A clearer picture starts with your records.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">There’s no income or expense activity in this period. Choose another period or add a transaction to see your charts.</p><Link to="/transactions" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Go to transactions</Link></section> : (
              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Income vs. expenses</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">See how money in compares with money out.</p>
                  <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-gray-600 dark:text-gray-400"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-emerald-600" />Income</span><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-rose-500" />Expenses</span></div>
                  <div tabIndex={0} role="region" aria-label="Monthly income and expenses chart. Scroll horizontally to view more months." className="mt-5 overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-blue-500">
                    <div style={{ minWidth: Math.max(monthlyData.length * 72, 480), height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyData} barGap={4} margin={{ top: 12, right: 16, left: 0, bottom: 8 }} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 5" className="stroke-gray-100 dark:stroke-gray-800" />
                        <XAxis dataKey="month" tickFormatter={tickMonth} tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} tickMargin={12} minTickGap={20} />
                        <YAxis width={72} tickFormatter={formatAxisCurrency} tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip content={props => <ChartTooltip {...props} format={formatCurrency} />} cursor={{ fill: "#9ca3af", fillOpacity: 0.08 }} />
                        <Bar dataKey="income" name="Income" fill="#059669" radius={[5,5,0,0]} maxBarSize={24} isAnimationActive={false} />
                        <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[5,5,0,0]} maxBarSize={24} isAnimationActive={false} />
                      </BarChart></ResponsiveContainer>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-gray-400">Scroll to explore months. Select a bar to see the full amount.</p>
                </section>
                <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Monthly net balance</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Income minus expenses for each month.</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400"><span className="h-2.5 w-2.5 rounded bg-blue-600" />Monthly net · not a running balance</div>
                  <div tabIndex={0} role="region" aria-label="Monthly net balance chart. Scroll horizontally to view more months." className="mt-5 overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-blue-500">
                    <div style={{ minWidth: Math.max(monthlyData.length * 60, 400), height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyData} margin={{ top: 12, right: 16, left: 0, bottom: 8 }} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 5" className="stroke-gray-100 dark:stroke-gray-800" />
                        <XAxis dataKey="month" tickFormatter={tickMonth} tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} tickMargin={12} minTickGap={20} />
                        <YAxis width={72} tickFormatter={formatAxisCurrency} tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip content={props => <ChartTooltip {...props} format={formatCurrency} />} />
                        <Area type="linear" dataKey="net" name="Net balance" stroke="#2563eb" strokeWidth={2.5} fill="#2563eb" fillOpacity={0.08} activeDot={{ r: 5, strokeWidth: 3 }} isAnimationActive={false} />
                      </AreaChart></ResponsiveContainer>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-gray-400">Positive means income exceeded expenses in that month.</p>
                </section>
              </div>
            )}

            {hasActivity && <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6"><div><h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Monthly summary</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your numbers, with the latest month first.</p></div><span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">{period} · {currency}</span></header>
              <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800 md:hidden">{monthlyData.slice().reverse().map(month => <article key={month.month} className="py-5"><h3 className="text-sm font-semibold text-gray-900 dark:text-white">{month.month}</h3><dl className="mt-4 grid grid-cols-2 gap-4"><div className="min-w-0"><dt className="text-xs text-gray-500 dark:text-gray-400">Income</dt><dd className="mt-1 break-all text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{formatCurrency(month.income)}</dd></div><div className="min-w-0"><dt className="text-xs text-gray-500 dark:text-gray-400">Expenses</dt><dd className="mt-1 break-all text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-200">{formatCurrency(month.expense)}</dd></div><div className="col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50"><dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Net balance</dt><dd className={"max-w-full break-all text-sm font-semibold tabular-nums " + (month.net < 0 ? "text-rose-600 dark:text-rose-400" : "text-blue-700 dark:text-blue-400")}>{formatCurrency(month.net)}</dd></div></dl></article>)}</div>
              <div className="hidden overflow-x-auto md:block"><table className="w-full text-left"><caption className="sr-only">Monthly income, expenses, and net balance for {period.toLowerCase()} in {currency}</caption><thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800/40 dark:text-gray-400"><tr><th scope="col" className="px-6 py-4 font-semibold">Month</th>{["Income","Expenses","Net balance"].map(label => <th key={label} scope="col" className="px-6 py-4 text-right font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-gray-100 dark:divide-gray-800">{monthlyData.slice().reverse().map(month => <tr key={month.month} className="transition hover:bg-blue-50/40 dark:hover:bg-gray-800/40"><th scope="row" className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-800 dark:text-gray-200">{month.month}</th><td className={cell + " text-emerald-700 dark:text-emerald-400"}>{formatCurrency(month.income)}</td><td className={cell + " text-gray-700 dark:text-gray-300"}>{formatCurrency(month.expense)}</td><td className={cell + " font-semibold " + (month.net < 0 ? "text-rose-600 dark:text-rose-400" : "text-blue-700 dark:text-blue-400")}>{formatCurrency(month.net)}</td></tr>)}</tbody><tfoot className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40"><tr><th scope="row" className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Period total</th><td className={cell + " font-semibold text-emerald-700 dark:text-emerald-400"}>{formatCurrency(income)}</td><td className={cell + " font-semibold text-gray-800 dark:text-gray-200"}>{formatCurrency(expense)}</td><td className={cell + " font-semibold text-blue-700 dark:text-blue-400"}>{formatCurrency(net)}</td></tr></tfoot></table></div>
            </section>}
          </>
        )}
      </div>
    </main>
  );
};

export default Analystics;
