import api from "../api/axios";

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

interface SummaryResponse {
  success: boolean;
  summary: FinancialSummary;
}

export const getFinancialSummary = async () => {
  const response = await api.get<SummaryResponse>("/analytics/summary");

  return response.data.summary;
};
