import axios from "axios";
export function apiError(error: unknown, fallback: string) {
 if (!axios.isAxiosError(error)) return fallback;
 const data = error.response?.data;
 if (typeof data?.message === "string") return data.message;
 if (!error.response) return "Unable to connect. Please check your connection and try again.";
 return fallback;
}
