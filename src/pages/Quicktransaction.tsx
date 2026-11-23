import { SettingsNotice as Notice } from "../components/SettingsLayout";
import VerifiedTransactionGate from "../components/Transactions/VerifiedTransactionGate";
import { useTransactionDate } from "../hooks/useTransactionDate";
import { todayDate } from "../utils/transactionDate";
import { apiError } from "../utils/apiError";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, LoaderCircle, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { createTransaction } from "../services/transaction";
import {
  transactionSchema,
  type TransactionFormData,
  type TransactionFormInput,
} from "../validations/transaction.schema";

const Quicktransaction: React.FC = () => {
  const queryClient = useQueryClient();
  const [initialDate] = React.useState(todayDate);

  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    getFieldState,
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormInput, unknown, TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: "expense",
      category: "",
      occurredAt: initialDate,
    },
  });

  useTransactionDate(true, getFieldState, setValue);

  useEffect(() => {
    if (!successMessage && !serverError) return;
    const timer = window.setTimeout(() => { setSuccessMessage(""); setServerError(""); }, serverError ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [successMessage, serverError]);

  const onSubmit = async (data: TransactionFormData) => {
    setSuccessMessage("");
    setServerError("");

    try {
      await createTransaction(data);

      setSuccessMessage("Transaction added.");


      reset({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        occurredAt: todayDate(),
      });

      queryClient.invalidateQueries({ queryKey: ["monthly-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({
        queryKey: ["financial-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-transactions"],
      });
    } catch (error) {
      setServerError(apiError(error, "Failed to create transaction."));
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
            <Plus size={20} className="text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Quick transaction
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A small update. A clearer picture.
            </p>
          </div>
        </div>
      </div>

      <VerifiedTransactionGate>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" aria-busy={isSubmitting}>
        {/* Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Type
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Income */}
            <label className="cursor-pointer">
              <input
                type="radio"
                value="income"
                {...register("type")}
                className="peer sr-only"
              />

              <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 dark:border-gray-700 dark:text-gray-300 dark:peer-checked:bg-green-950/40 dark:peer-checked:text-green-400">
                <ArrowDownLeft size={17} />
                Income
              </div>
            </label>

            {/* Expense */}
            <label className="cursor-pointer">
              <input
                type="radio"
                value="expense"
                {...register("type")}
                className="peer sr-only"
              />

              <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500 peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 dark:border-gray-700 dark:text-gray-300 dark:peer-checked:bg-red-950/40 dark:peer-checked:text-red-400">
                <ArrowUpRight size={17} />
                Expense
              </div>
            </label>
          </div>

          {errors.type && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.type.message}
            </p>
          )}
        </div>
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="e.g. Weekly groceries"
            {...register("title")}
            className="min-h-12 min-w-0 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-900/60"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>
        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Amount
          </label>

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 50,000"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/,/g, ""))
                }
                onBlur={field.onBlur}
                ref={field.ref}
                className="min-h-12 min-w-0 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-900/60"
              />
            )}
          />

          {errors.amount && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.amount.message}
            </p>
          )}
        </div>
        {/* Transaction date */}
        <div>

          <label
            htmlFor="quick-date"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >

            Transaction date
          </label>
          <input
            id="quick-date"
            type="date"
            {...register("occurredAt")}
            aria-invalid={!!errors.occurredAt}
            aria-describedby={errors.occurredAt ? "quick-date-error" : undefined}
            className="min-h-12 min-w-0 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-900/60 box-border appearance-none dark:scheme-dark"
          />
          {errors.occurredAt && (
            <p
              id="quick-date-error"
              className="mt-1 text-sm text-red-500 dark:text-red-400"
            >

              {errors.occurredAt.message}
            </p>
          )}
        </div>
        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            placeholder="e.g. Food"
            {...register("category")}
            className="min-h-12 min-w-0 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-900/60"
          />

          {errors.category && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>
        {/* Messages */}
        <Notice message={successMessage} />
        <Notice message={serverError} error />
        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}

          {isSubmitting ? "Saving transaction…" : "Save transaction"}
        </button>
      </form>
      </VerifiedTransactionGate>
    </div>
  );
};

export default Quicktransaction;
