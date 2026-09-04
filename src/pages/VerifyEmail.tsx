import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/verifyEmail";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const verificationStarted = React.useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Verification token is missing.",
  );

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    if (!token) return;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        setStatus("success");
        setMessage(response.message);
      } catch (error: unknown) {
        setStatus("error");

        setMessage(
          (axios.isAxiosError(error) && error.response?.data?.message) ||
            "We couldn't verify your email. The link may be invalid or expired.",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Verifying your email
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              ✓
            </div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Email verified!
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              !
            </div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Verification failed
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
