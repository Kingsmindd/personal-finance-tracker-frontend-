import React from "react";
import { createTransaction } from "../../services/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  transactionSchema,
  type TransactionFormData,
} from "../../validations/transaction.schema";

import { ArrowDownLeft, ArrowUpRight, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      type: "income",
      category: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["financial-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-transactions"],
      });

      reset();
      onClose();
    },

    onError: (error) => {
      console.error(error);
      alert("Failed to create transaction.");
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={() => {
        reset();
        onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Transaction
          </h2>

          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            aria-label="Close add transaction modal"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
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
                  inputMode="numeric"
                  placeholder="e.g. 50,000"
                  value={
                    field.value !== undefined && field.value !== null
                      ? Number(field.value).toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");

                    if (rawValue === "") {
                      field.onChange(undefined);
                      return;
                    }

                    const numericValue = Number(rawValue);

                    if (!Number.isNaN(numericValue)) {
                      field.onChange(numericValue);
                    }
                  }}
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

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="w-full rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-700 dark:hover:bg-gray-600 sm:w-auto"
            >
              {createMutation.isPending ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
