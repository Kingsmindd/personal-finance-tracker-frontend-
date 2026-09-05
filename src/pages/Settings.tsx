import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  User,
  Shield,
  LogOut,
  Coins,
  Palette,
  Download,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { downloadTransactions } from "../services/transaction";
import axios from "axios";

const Settings: React.FC = () => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [showDeletePassword, setShowDeletePassword] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDownloadTransactions = async () => {
    try {
      setIsDownloading(true);

      const blob = await downloadTransactions();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "transactions.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download transactions:", error);
      alert("Failed to download transactions.");
    } finally {
      setIsDownloading(false);
    }
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setCurrentPassword("");
    setDeleteError("");
    setShowDeletePassword(false);
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setDeleteError("");

    if (!currentPassword.trim()) {
      setDeleteError("Please enter your current password.");
      return;
    }

    try {
      setIsDeleting(true);

      await api.delete("/auth/delete-account", {
        data: { currentPassword },
      });

      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setDeleteError(
          error.response?.data?.message || "Failed to delete your account.",
        );
      } else {
        setDeleteError("Something went wrong. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 dark:bg-gray-900 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        {/* Page Header */}
        <div className="relative mb-6 flex items-center justify-center sm:mb-8">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to dashboard"
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white sm:h-11 sm:w-11"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Page title */}
          <div className="px-14 text-center sm:px-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Settings
            </h1>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Account */}
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-2 px-1 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 sm:text-sm">
            ACCOUNT
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Profile */}
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700 sm:gap-4"
            >
              <User
                size={19}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Profile
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  Manage your personal information
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Security */}
            <button
              type="button"
              onClick={() => navigate("/settings/security")}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700 sm:gap-4"
            >
              <Shield
                size={19}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Security
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  Password and account security
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700 sm:gap-4"
            >
              <LogOut
                size={19}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Log out
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  Sign out of your account
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-2 px-1 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 sm:text-sm">
            PREFERENCES
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Currency */}
            <button
              type="button"
              onClick={() => navigate("/settings/preferences/currency")}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700 sm:gap-4"
            >
              <Coins
                size={19}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Currency
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.currency}
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Appearance */}
            <button
              type="button"
              onClick={() => navigate("/settings/preferences/appearance")}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700 sm:gap-4"
            >
              <Palette
                size={19}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Appearance
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>
          </div>
        </section>

        {/* Data */}
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-2 px-1 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 sm:text-sm">
            DATA
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={handleDownloadTransactions}
              disabled={isDownloading}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-gray-700 sm:gap-4"
            >
              <Download
                size={19}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {isDownloading ? "Downloading..." : "Export transactions"}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  Download your transaction data
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pb-6 sm:pb-8">
          <h2 className="mb-2 px-1 text-xs font-medium tracking-wide text-red-500 sm:text-sm dark:text-red-400">
            DANGER ZONE
          </h2>

          <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full p-4 text-left transition hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Delete account
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                Permanently delete your account and financial data
              </p>
            </button>
          </div>
        </section>
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <form
              onSubmit={handleDeleteAccount}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
            >
              <h2
                id="delete-account-title"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Delete your account?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                This permanently deletes your account, transactions, and all
                related data. This action cannot be undone.
              </p>

              <label
                htmlFor="delete-password"
                className="mt-5 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Enter your current password to confirm
              </label>

              <div className="relative">
                <input
                  id="delete-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  type={showDeletePassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Current password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  aria-label={
                    showDeletePassword ? "Hide password" : "Show password"
                  }
                >
                  {showDeletePassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {deleteError && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {deleteError}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting
                    ? "Deleting account..."
                    : "Delete account permanently"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
