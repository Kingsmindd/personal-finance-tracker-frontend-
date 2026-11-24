/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import api, { refreshSession } from "../api/axios";
import {
  getSession,
  getSessionGeneration,
  setSession,
  subscribeSession,
  getTokenExpiry,
  isAccessTokenFresh,
  isAccessTokenValid,
  type SessionUser,
} from "../lib/session";
interface AuthContextType {
  user: SessionUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  sessionError: string | null;
  retrySession: () => void;
  login: (token: string, user: SessionUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: SessionUser) => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSyncExternalStore(subscribeSession, getSession);
  const [checkVersion, setCheckVersion] = useState(0);
  const [failure, setFailure] = useState<{ token: string; message: string } | null>(null);
  const token = session?.token;
  const validAccess = Boolean(token && isAccessTokenValid(token));
  const sessionError = !validAccess && token && failure?.token === token ? failure.message : null;
  const loading = Boolean(session && !validAccess && !sessionError);
  const retrySession = () => { setFailure(null); setCheckVersion(value => value + 1); };

  useEffect(() => {
    if (!token) return;
    if (isAccessTokenFresh(token)) {
      const expiresAt = getTokenExpiry(token)!;
      const timer = window.setTimeout(() => setCheckVersion(value => value + 1), Math.min(2147483647, Math.max(1, expiresAt - Date.now() - 15000)));
      const checkOnReturn = () => {
        if (document.visibilityState === "visible" && !isAccessTokenFresh(token)) setCheckVersion(value => value + 1);
      };
      window.addEventListener("focus", checkOnReturn);
      document.addEventListener("visibilitychange", checkOnReturn);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("focus", checkOnReturn);
        document.removeEventListener("visibilitychange", checkOnReturn);
      };
    }
    let active = true;
    const expiration = getTokenExpiry(token);
    const expirationTimer = expiration && expiration > Date.now()
      ? window.setTimeout(() => setCheckVersion(value => value + 1), expiration - Date.now() + 1)
      : null;
    const version = getSessionGeneration();
    void refreshSession(version).catch(() => {
      if (active && version === getSessionGeneration() && getSession()?.token === token) {
        setFailure({ token, message: "We couldn’t reconnect to your account. Please try again." });
      }
    });
    return () => { active = false; if (expirationTimer !== null) window.clearTimeout(expirationTimer); };
  }, [token, checkVersion]);

  const login = (token: string, user: SessionUser) =>
    setSession({ token, user });

  const updateUser = (user: SessionUser) => {
    const current = getSession();
    if (current) setSession({ ...current, user });
  };
  const logout = async () => {
    const version = getSessionGeneration();
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      if (version === getSessionGeneration()) setSession(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user: validAccess ? session?.user ?? null : null,
        token: session?.token ?? null,
        isAuthenticated: validAccess,
        loading,
        sessionError,
        retrySession,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
export default AuthContext;
