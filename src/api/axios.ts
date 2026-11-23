import axios, { type InternalAxiosRequestConfig } from "axios";

import { getSession, getSessionGeneration, setSession, getTokenExpiry, isAccessTokenFresh } from "../lib/session";

interface SessionRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _generation?: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 20000,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config: SessionRequest) => {
  if (
    config._generation !== undefined &&
    config._generation !== getSessionGeneration()
  ) {
    throw new axios.CanceledError("Session changed");
  }

  config._generation = getSessionGeneration();

  let session = getSession();
  const path = (config.url || "").split("?")[0];
  if (session && !path.startsWith("/auth/") && getTokenExpiry(session.token) !== null && !isAccessTokenFresh(session.token)) {
    await refreshSession(config._generation);
    if (config._generation !== getSessionGeneration()) throw new axios.CanceledError("Session changed");
    session = getSession();
    config._retry = true;
  }

  if (session) {
    config.headers.Authorization = "Bearer " + session.token;
  } else {
    config.headers.delete("Authorization");
  }

  return config;
});

let pendingRefresh: {
  generation: number;
  promise: Promise<string>;
} | null = null;

export function refreshSession(generation: number): Promise<string> {
  if (pendingRefresh?.generation === generation) {
    return pendingRefresh.promise;
  }

  const startingToken = getSession()?.token;
  const promise = api
    .post("/auth/refresh", undefined, { timeout: 12000 })
    .then((response) => {
      const current = getSession();

      if (generation !== getSessionGeneration() || !current || current.token !== startingToken) {
        throw new axios.CanceledError("Session changed");
      }

      if (typeof response.data.token !== "string" || !isAccessTokenFresh(response.data.token)) {
        throw new Error("Invalid refresh response");
      }

      if (response.data.user && response.data.user.id !== current.user.id) {
        setSession(null);
        throw new axios.CanceledError("Refresh account changed");
      }
      setSession({
        ...current,
        token: response.data.token,
      });

      return response.data.token as string;
    })
    .catch((error) => {
      if (
        generation === getSessionGeneration() &&
        getSession()?.token === startingToken &&
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        setSession(null);
      }

      throw error;
    })
    .finally(() => {
      if (pendingRefresh?.promise === promise) {
        pendingRefresh = null;
      }
    });

  pendingRefresh = {
    generation,
    promise,
  };

  return promise;
}

api.interceptors.response.use(
  (response) => {
    const config = response.config as SessionRequest;

    if (config._generation !== getSessionGeneration()) {
      throw new axios.CanceledError("Session changed");
    }

    return response;
  },

  async (error) => {
    const original = error.config as SessionRequest | undefined;

    if (original?._retry && error.response?.status === 401 &&
        original._generation === getSessionGeneration() &&
        original.headers.Authorization === "Bearer " + getSession()?.token) {
      setSession(null);
    }
    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      [
        "/auth/refresh",
        "/auth/login",
        "/auth/register",
        "/auth/logout",
        "/auth/forgot-password",
        "/auth/reset-password",
      ].includes((original.url || "").split("?")[0])
    ) {
      throw error;
    }

    const generation = original._generation;
    const current = getSession();

    if (!current || generation !== getSessionGeneration()) {
      throw error;
    }

    original._retry = true;

    if (original.headers.Authorization === "Bearer " + current.token) {
      await refreshSession(generation);
    }

    return api(original);
  },
);

export default api;
