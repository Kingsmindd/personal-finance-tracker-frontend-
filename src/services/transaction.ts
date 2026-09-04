import api from "../api/axios";
import type { TransactionFormData } from "../validations/transaction.schema";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "income" | "expense";
  category?: string;
  sort?: "createdAt" | "amount" | "title";
  order?: "asc" | "desc";
}

export interface GetTransactionsResponse {
  success: boolean;
  transactions: Transaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const createTransaction = async (data: TransactionFormData) => {
  const response = await api.post("/transactions", data);

  return response.data;
};

export const getTransactions = async (
  params?: GetTransactionsParams,
): Promise<GetTransactionsResponse> => {
  const response = await api.get<GetTransactionsResponse>("/transactions", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      type: params?.type,
      category: params?.category,
      sort: params?.sort ?? "createdAt",
      order: params?.order ?? "desc",
    },
  });

  return response.data;
};

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<GetTransactionsResponse>("/transactions", {
    params: {
      page: 1,
      limit: 5,
      sort: "createdAt",
      order: "desc",
    },
  });

  return response.data.transactions;
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  const response = await api.get(`/transactions/${id}`);

  return response.data.transaction;
};

export const updateTransaction = async (
  id: string,
  data: TransactionFormData,
) => {
  const response = await api.patch(`/transactions/${id}`, data);

  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await api.delete(`/transactions/${id}`);

  return response.data;
};

export const downloadTransactions = async (): Promise<Blob> => {
  const response = await api.get("/transactions/export", {
    responseType: "blob",
  });

  return response.data;
};
