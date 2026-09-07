import { useTransactionDate } from "../hooks/useTransactionDate";
import { todayDate } from "../utils/transactionDate";
import { apiError } from "../utils/apiError";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
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

  const onSubmit = async (data: TransactionFormData) => {
    setSuccessMessage("");
    setServerError("");

    try {
      await createTransaction(data);

      setSuccessMessage("Transaction added.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      reset({ title: "", amount: "", type: "expense", category: "", occurredAt: todayDate() });

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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
            <Plus size={20} className="text-gray-700 dark:text-gray-200" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Quick Transaction
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quickly record your income or expense.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="e.g. Salary"
            {...register("title")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
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
                onChange={(e) => field.onChange(e.target.value.replace(/,/g, ""))}
                  onBlur={field.onBlur}
                ref={field.ref}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              />
            )}
          />

          {errors.amount && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.amount.message}
            </p>
          )}
        </div>

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

              <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 dark:border-gray-700 dark:text-gray-300 dark:peer-checked:bg-green-950/40 dark:peer-checked:text-green-400">
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

              <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 dark:border-gray-700 dark:text-gray-300 dark:peer-checked:bg-red-950/40 dark:peer-checked:text-red-400">
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

        {/* Transaction date */}
          <div>
            <label htmlFor="quick-date" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">Transaction date</label>
            <input id="quick-date" type="date" {...register("occurredAt")} aria-invalid={!!errors.occurredAt} aria-describedby={errors.occurredAt ? "quick-date-error" : undefined} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:[color-scheme:dark]" />
            {errors.occurredAt && <p id="quick-date-error" className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.occurredAt.message}</p>}
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          />

          {errors.category && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Messages */}
        {successMessage && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
            {successMessage}
          </p>
        )}

        {serverError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
            {serverError}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Plus size={18} />

          {isSubmitting ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default Quicktransaction;
