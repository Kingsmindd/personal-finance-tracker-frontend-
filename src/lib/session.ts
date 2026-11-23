import { queryClient } from "./queryClient";
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  currency: string;
}
export interface Session {
  token: string;
  user: SessionUser;
}
// Expiry is a UI hint; the API still verifies token signatures and account access.
export function getTokenExpiry(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || token.length > 10000) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return Number.isSafeInteger(payload.exp) && payload.exp > 0 ? payload.exp * 1000 : null;
  } catch { return null; }
}
export function isAccessTokenFresh(token: string, now = Date.now()): boolean {
  const expiresAt = getTokenExpiry(token);
  return expiresAt !== null && expiresAt > now + 15000;
}

function readSession(): Session | null {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return token &&
      user &&
      typeof user.id === "string" &&
      typeof user.email === "string"
      ? { token, user: { ...user, currency: user.currency || "NGN" } }
      : null;
  } catch {
    return null;
  }
}

let session = readSession();
let generation = 0;
const listeners = new Set<() => void>();
export const getSession = () => session;
export const getSessionGeneration = () => generation;
export const subscribeSession = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function setSession(next: Session | null) {
  if (session?.user.id !== next?.user.id || !next) {
    generation++;
    void queryClient.cancelQueries();
    queryClient.clear();
  }

  session = next;
  if (next) {
    localStorage.setItem("token", next.token);
    localStorage.setItem("user", JSON.stringify(next.user));
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  listeners.forEach((listener) => listener());
}
window.addEventListener("storage", (event) => {
  if (event.key === "token" || event.key === "user" || event.key === null) {
    generation++;
    void queryClient.cancelQueries();
    queryClient.clear();
    session = readSession();
    listeners.forEach((listener) => listener());
  }
});
