import api from "../api/axios";

export interface MonthlyAnalytics {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyAnalyticsResponse {
  success: boolean;
  data: MonthlyAnalytics[];
}

export const getMonthlyAnalytics = async (
  months: number | "all" = "all",
): Promise<MonthlyAnalytics[]> => {
  const response = await api.get<MonthlyAnalyticsResponse>(
    "/analytics/monthly",
    {
      params: {
        months,
      },
    },
  );

  return response.data.data;
};
