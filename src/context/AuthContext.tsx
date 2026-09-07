/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useSyncExternalStore } from "react";
import api from "../api/axios";
import { getSession, getSessionGeneration, setSession, subscribeSession, type SessionUser } from "../lib/session";
interface AuthContextType {
 user: SessionUser | null; token: string | null; isAuthenticated: boolean; loading: boolean;
 login: (token: string, user: SessionUser) => void; logout: () => Promise<void>; updateUser: (user: SessionUser) => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
 const session = useSyncExternalStore(subscribeSession, getSession);
 const login = (token: string, user: SessionUser) => setSession({token, user});
 const updateUser = (user: SessionUser) => { const current = getSession(); if (current) setSession({...current, user}); };
 const logout = async () => {
   const version = getSessionGeneration();
   try { await api.post("/auth/logout"); }
   catch (error) { console.error("Logout request failed:", error); }
   finally { if (version === getSessionGeneration()) setSession(null); }
 };
 return <AuthContext.Provider value={{user: session?.user ?? null, token: session?.token ?? null, isAuthenticated: !!session, loading: false, login, logout, updateUser}}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within an AuthProvider"); return context; };
export default AuthContext;
