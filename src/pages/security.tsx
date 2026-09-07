import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, LogOut, ChevronRight } from "lucide-react";

const Security: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-4 dark:bg-gray-900 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6  sm:mb-8">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>Back to Settings</span>
          </button>
        </div>

        <div className="text-start">
          {" "}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            {" "}
            Security{" "}
          </h1>{" "}
          <p className="mt-1 max-w-md text-sm leading-5 text-gray-500 dark:text-gray-400">
            {" "}
            Manage your password and account security{" "}
          </p>{" "}
        </div>

        {/* Security */}
        <section>
          <div className="overflow-hidden rounded-2xl border mt-8 border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Change Password */}
            <button
              type="button"
              onClick={() => navigate("/settings/security/change-password")}
              className="flex min-h-19 w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600 sm:min-h-21 sm:gap-4 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <Lock size={18} className="text-gray-500 dark:text-gray-300" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Change password
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Update your account password
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Logout All Devices */}
            <button
              type="button"
              onClick={() => navigate("/settings/security/logout-all")}
              className="flex min-h-19 w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600 sm:min-h-21 sm:gap-4 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <LogOut
                  size={18}
                  className="text-gray-500 dark:text-gray-300"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Log out of all devices
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Sign out everywhere your account is logged in
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Security;
