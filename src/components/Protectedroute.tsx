import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProctectedRouteProps { children: React.ReactNode; }

export function AccountPlaceholder() {
return (
      <main aria-busy="true" className="min-h-dvh bg-gray-50 px-5 py-8 dark:bg-gray-950">
        <p role="status" className="sr-only">Loading account</p>
        <div aria-hidden="true" className="mx-auto max-w-7xl space-y-7">
          <div className="h-11 w-48 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map(item => <div key={item} className="h-32 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />)}</div>
          <div className="h-72 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />
        </div>
      </main>
    );
}

export default function ProtectedRoute({ children }: ProctectedRouteProps) {
  const { isAuthenticated, loading, sessionError, retrySession } = useAuth();
  if (loading) {
    return <AccountPlaceholder />;
  }
  if (sessionError) {
    return (
      <main className="grid min-h-dvh place-items-center bg-gray-50 px-5 dark:bg-gray-950">
        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Let’s reconnect</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{sessionError}</p>
          {sessionError && <div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={retrySession} className="min-h-11 cursor-pointer rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">Try again</button><Link to="/login" className="inline-flex min-h-11 items-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">Sign in</Link></div>}
          <Link to="/" className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">Back to home</Link>
        </section>
      </main>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
