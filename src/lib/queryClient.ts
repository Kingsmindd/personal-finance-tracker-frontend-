import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failures, error) => {
        if (axios.isCancel(error)) return false;
        if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) return false;
        return failures < 1;
      },
    },
  },
});
