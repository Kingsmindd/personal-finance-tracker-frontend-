import React from "react";
import SettingsLayout, { SettingsLink, SettingsNotice } from "../components/SettingsLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  User,
  MailCheck,
  Shield,
  LogOut,
  Coins,
  Palette,
  Download,
  Settings as SettingsIcon,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { downloadTransactions } from "../services/transaction";
import axios from "axios";

const Settings: React.FC = () => {
  const [notice, setNotice] = React.useState<{message: string; error?: boolean} | null>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [showDeletePassword, setShowDeletePassword] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  React.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), notice.error ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  React.useEffect(() => {
    if (!deleteError) return;
    const timer = window.setTimeout(() => setDeleteError(""), 7000);
    return () => window.clearTimeout(timer);
  }, [deleteError]);
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
      setNotice({ message: "Your CSV export is ready. Check your downloads." });
    } catch (error) {
      console.error("Failed to download transactions:", error);
      setNotice({ message: "We couldn’t export your transactions. Please try again.", error: true });
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
    <SettingsLayout title="Make it yours." description="Manage your account, preferences, and financial records in one place." icon={SettingsIcon} back="/dashboard" backLabel="Back to dashboard">
      <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{(user?.name || user?.email || "U").slice(0,1).toUpperCase()}</span><div className="min-w-0"><p className="break-words font-semibold text-gray-900 dark:text-white">{user?.name || "Your account"}</p><p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">{user?.email}</p></div></div>
      <SettingsNotice message={notice?.message || ""} error={notice?.error} />
      <div className="grid items-start gap-6 md:grid-cols-2">
        {[{ label: "Account", links: [{to:"/profile",title:"Profile",description:"Update your name and view account details.",icon:User},{to:"/settings/verification",title:"Email verification",description:"Confirm your email and manage verification links.",icon:MailCheck},{to:"/settings/security",title:"Security",description:"Manage your password and signed-in devices.",icon:Shield}] },{label:"Preferences",links:[{to:"/settings/preferences/currency",title:"Currency",description:"Display currency · " + (user?.currency || "NGN"),icon:Coins},{to:"/settings/preferences/appearance",title:"Appearance",description:"Choose light, dark, or your device theme.",icon:Palette}]}].map(group => <section key={group.label}><h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{group.label}</h2><div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">{group.links.map(link => <SettingsLink key={link.to} {...link} />)}</div></section>)}
      </div>
      <section><h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-gray-400">Your data & account access</h2><div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"><button type="button" disabled={isDownloading} onClick={handleDownloadTransactions} className="flex w-full cursor-pointer items-center gap-4 p-5 text-left transition hover:bg-blue-50/50 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-blue-950/20 sm:p-6"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">{isDownloading ? <LoaderCircle size={20} className="animate-spin motion-reduce:animate-none" /> : <Download size={20} />}</span><span><span className="block text-sm font-semibold text-gray-900 dark:text-white">{isDownloading ? "Preparing your export…" : "Export all transactions"}</span><span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">Download all your records as a CSV file.</span></span></button><button type="button" onClick={handleLogout} className="flex w-full cursor-pointer items-center gap-4 p-5 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/40 sm:p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"><LogOut size={20} /></span><span><span className="block text-sm font-semibold text-gray-900 dark:text-white">Sign out</span><span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">Sign out on this device.</span></span></button></div></section>
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-red-100 bg-white p-5 dark:border-red-900/40 dark:bg-gray-900 sm:flex-row sm:items-center sm:p-6"><div><h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Delete account</h2><p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">Permanently remove your account and financial records.</p></div><button type="button" onClick={() => setIsDeleteModalOpen(true)} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"><Trash2 size={16} aria-hidden="true" />Delete account</button></section>
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <form
              onSubmit={handleDeleteAccount}
              className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:p-8"
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
                  disabled={isDeleting}
                  required
                  placeholder="Current password"
                  className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
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

              <SettingsNotice message={deleteError} error />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="min-h-12 cursor-pointer rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
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
    </SettingsLayout>
  );
};

export default Settings;
