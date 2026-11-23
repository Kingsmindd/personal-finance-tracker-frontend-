import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary } from "../services/summary";
import React, { useContext, useEffect, useState } from "react";
import { Coins, Check, ChevronDown } from "lucide-react";
import SettingsLayout, { SettingsNotice } from "../components/SettingsLayout";
import { apiError } from "../utils/apiError";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const currencies = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "$",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "$",
  },
];

const Currency: React.FC = () => {

  const auth = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState(() => auth?.user?.currency || "NGN");
  const { data: summary, isPending: checking, isError: checkFailed, refetch: retryCheck } = useQuery({
    queryKey: ["financial-summary", auth?.user?.id], queryFn: getFinancialSummary, enabled: !!auth?.user,
  });
  const locked = (summary?.transactionCount ?? 0) > 0;
  const selectedCurrency = currencies.find((item) => item.code === currency);

  useEffect(() => {
    if (!saved && !error) return;
    const timer = window.setTimeout(() => { setSaved(false); setError(""); }, error ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [saved, error]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await api.patch("/auth/currency", {
        currency,
      });

      if (auth?.user) {
        auth.updateUser({
          ...auth.user,
          currency: response.data.currency,
        });
      }

      setSaved(true);


    } catch (error) {
      setError(apiError(error, "We couldn’t update your currency. Please try again."));
    } finally {
      setSaving(false);
    }
  };
  return (
    <SettingsLayout title="Your display currency." description="Choose your account currency before recording your first transaction." icon={Coins}>
      <SettingsNotice message={saved ? "Your currency preference has been saved." : ""} />
      <SettingsNotice message={error} error />
      {checkFailed && <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300"><p>We couldn’t check whether your currency can be changed.</p><button type="button" onClick={() => void retryCheck()} className="mt-2 cursor-pointer font-semibold text-blue-600 dark:text-blue-400">Try again</button></div>}
      <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div><label htmlFor="currency" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Default currency</label><div className="relative"><select id="currency" value={currency} disabled={saving || locked || checking || checkFailed} onChange={event => setCurrency(event.target.value)} className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pr-11 pl-4 text-base text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900">{currencies.map(item => <option key={item.code} value={item.code}>{item.code} — {item.name}</option>)}</select><ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" /></div></div>
        {selectedCurrency && <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/25"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-xl font-semibold text-blue-700 dark:bg-gray-900 dark:text-blue-300">{selectedCurrency.symbol}</span><div className="min-w-0"><p className="text-xs font-medium text-gray-500 dark:text-gray-400">Preview</p><p className="mt-1 break-all text-xl font-bold tabular-nums text-gray-900 dark:text-white">{new Intl.NumberFormat("en-NG", {style:"currency",currency}).format(12500)}</p><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{selectedCurrency.name}</p></div></div>}
        <p className="text-xs leading-6 text-gray-500 dark:text-gray-400">{checking ? "Checking your account…" : locked ? "Your currency is locked because this account has transactions. This keeps existing amounts consistent." : "You can choose a currency before adding transactions. Currency changes are locked while transactions exist."}</p>
        <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800"><button type="button" onClick={handleSave} disabled={saving || locked || checking || checkFailed || currency === auth?.user?.currency} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-default disabled:opacity-50 sm:w-auto"><Check size={16} aria-hidden="true" />{saving ? "Saving…" : "Save preference"}</button></div>
      </section>
    </SettingsLayout>
  );
};

export default Currency;
