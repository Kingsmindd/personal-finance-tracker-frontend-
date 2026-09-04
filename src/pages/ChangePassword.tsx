import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { changePassword } from "../services/auth";

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);

      await changePassword(currentPassword, newPassword);

      setSuccess("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      setError(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          "Failed to change password. Please try again.",
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
        {/* Page heading */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}

            {/* Heading content */}
            <div className="min-w-0 flex-1 lg:text-center">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                Change password
              </h1>

              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                Update your password to help keep your account secure.
              </p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Card header */}
          {/* Card header */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6 sm:py-6 dark:border-gray-700">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                <Lock size={18} className="text-gray-600 dark:text-gray-300" />
              </div>

              {/* Heading content */}
              <div className="min-w-0 flex-1 lg:text-center">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Password details
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Enter your current password and choose a new one.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:px-6 sm:py-7">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                {/* Current password */}
                <div className="relative lg:col-span-2">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* New password */}
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Password requirements
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Use at least 8 characters. Choose a password that is difficult
                  for others to guess.
                </p>
              </div>

              {/* Messages */}
              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                  {success}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/settings/security")}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                {isLoading ? "Changing password..." : "Change password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
