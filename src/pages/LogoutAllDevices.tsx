import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, ShieldAlert } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const LogoutAllDevices: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogoutAllDevices = async () => {
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/logout-all");

      await logout();

      navigate("/login");
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
    <div className="min-h-full w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/settings/security")}
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Back to Security</span>
        </button>

        {/* Page heading */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-12 sm:w-12">
              <ShieldAlert
                size={22}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>

            {/* Heading */}
            <div className="min-w-0 flex-1 lg:text-center">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                Log out of all devices
              </h1>

              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                Sign out of your account on every device
              </p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Card header */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6 sm:py-6 dark:border-gray-700">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                <LogOut
                  size={18}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 lg:text-center">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sign out everywhere
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  This will end all active sessions associated with your
                  account.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:px-6 sm:py-7">
            <div className="rounded-lg bg-gray-50 px-4 py-4 dark:bg-gray-700/50">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                What happens when you log out of all devices?
              </p>

              <ul className="mt-3 space-y-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                <li>• All active sessions will be ended.</li>
                <li>• You will need to log in again on your devices.</li>
                <li>• Your financial data will not be deleted.</li>
              </ul>
            </div>

            {/* Warning */}
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-xs leading-5 text-amber-700 dark:text-amber-400">
                Only use this option if you want to sign out everywhere.
              </p>
            </div>
          </div>
          {error && (
            <div className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/settings/security")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleLogoutAllDevices}
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              {isLoading ? "Logging out..." : "Log out of all devices"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutAllDevices;
