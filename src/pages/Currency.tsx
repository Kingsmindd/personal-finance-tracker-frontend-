import React, { useContext, useState } from "react";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState(() => auth?.user?.currency || "NGN");
  const selectedCurrency = currencies.find((item) => item.code === currency);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

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

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Currency update failed:", error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Go Back */}
        <div className="mb-6  sm:mb-8">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>Back to Settings</span>
          </button>
        </div>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Currency
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose the currency used throughout your account.
          </p>
        </div>

        {/* Currency Card */}
        <div className="rounded-xl border border-gray-200 mt-8 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Default currency
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This currency will be used when displaying your transactions and
              financial summaries.
            </p>
          </div>

          <div className="space-y-6 px-6 py-6">
            {/* Currency Select */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Currency
              </label>

              <div className="relative mt-2">
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.symbol} — {item.code} — {item.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Selected Currency Preview */}
            {selectedCurrency && (
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Selected currency
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-semibold text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                    {selectedCurrency.symbol}
                  </span>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedCurrency.code}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedCurrency.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <Check size={16} />

                {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
