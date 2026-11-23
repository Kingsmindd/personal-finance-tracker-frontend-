import SettingsLayout, { SettingsNotice } from "../components/SettingsLayout";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldAlert, LoaderCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const LogoutAllDevices: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(""), 7000);
    return () => window.clearTimeout(timer);
  }, [error]);
  const handleLogoutAllDevices = async () => {
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/logout-all");

      await logout();

      navigate("/login", { replace: true, state: { message: "Trusted-device access removed. Sign in again to continue." } });
    } catch (error: unknown) {
      setError(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          "Failed to log out of all devices. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SettingsLayout title="Manage trusted devices." description="Remove saved sign-in access across your account." icon={ShieldAlert} back="/settings/security" backLabel="Back to security">
      <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"><LogOut size={21} aria-hidden="true" /></span><div><h2 className="font-semibold text-gray-900 dark:text-white">Sign out on all devices</h2><p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">You’ll be signed out here immediately. Other devices will need to sign in again when their current access expires, within 15 minutes.</p></div></div>
        <div className="rounded-xl bg-gray-50 p-4 text-xs leading-6 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">Your account and financial records stay saved. Only sign-in access is affected.</div>
        <SettingsNotice message={error} error />
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end"><Link to="/settings/security" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back to security</Link><button type="button" disabled={isLoading} onClick={handleLogoutAllDevices} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{isLoading ? <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <LogOut size={16} aria-hidden="true" />}{isLoading ? "Signing out…" : "Sign out on all devices"}</button></div>
      </section>
    </SettingsLayout>
  );
};

export default LogoutAllDevices;
