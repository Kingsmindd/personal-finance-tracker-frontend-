import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SettingsLayout, { SettingsNotice } from "../components/SettingsLayout";
import { Eye, EyeOff, Lock, LoaderCircle } from "lucide-react";
import { changePassword } from "../services/auth";

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);


  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!error && !success) return;
    const timer = window.setTimeout(() => { setError(""); setSuccess(""); }, error ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [error, success]);

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

  const fields = [
    { id: "currentPassword", label: "Current password", value: currentPassword, set: setCurrentPassword, visible: showCurrentPassword, toggle: setShowCurrentPassword, autoComplete: "current-password" },
    { id: "newPassword", label: "New password", value: newPassword, set: setNewPassword, visible: showNewPassword, toggle: setShowNewPassword, autoComplete: "new-password" },
    { id: "confirmPassword", label: "Confirm new password", value: confirmPassword, set: setConfirmPassword, visible: showConfirmPassword, toggle: setShowConfirmPassword, autoComplete: "new-password" },
  ];
  return (
    <SettingsLayout title="A fresh password." description="Use a password you haven’t used elsewhere to help protect your account." icon={Lock} back="/settings/security" backLabel="Back to security">
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <fieldset disabled={isLoading} className="space-y-5 p-5 sm:p-6">
          {fields.map(field => <div key={field.id}><label htmlFor={field.id} className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">{field.label}</label><div className="relative"><input id={field.id} type={field.visible ? "text" : "password"} autoComplete={field.autoComplete} value={field.value} onChange={event => field.set(event.target.value)} placeholder={field.label} className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-14 pl-4 text-base text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900" /><button type="button" onClick={() => field.toggle(value => !value)} aria-label={(field.visible ? "Hide " : "Show ") + field.label.toLowerCase()} aria-pressed={field.visible} className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">{field.visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>)}
          <p className="rounded-xl bg-blue-50 p-4 text-xs leading-6 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">Use at least 8 characters. A longer, memorable passphrase is a good choice.</p>
          <SettingsNotice message={error} error />
          <SettingsNotice message={success} />
        </fieldset>
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:justify-end sm:p-6"><Link to="/settings/security" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back to security</Link><button type="submit" disabled={isLoading} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{isLoading && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}{isLoading ? "Updating password…" : "Update password"}</button></div>
      </form>
    </SettingsLayout>
  );
};

export default ChangePassword;
