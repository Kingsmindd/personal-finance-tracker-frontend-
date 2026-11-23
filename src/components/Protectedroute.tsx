import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProctectedRouteProps { children: React.ReactNode; }

export default function ProtectedRoute({ children }: ProctectedRouteProps) {
  const { isAuthenticated, loading, sessionError, retrySession } = useAuth();
  if (loading || sessionError) {
    return (
      <main className="grid min-h-dvh place-items-center bg-gray-50 px-5 dark:bg-gray-950">
        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{sessionError ? "Let’s reconnect" : "Checking your session"}</h1>
          <p role={sessionError ? "alert" : "status"} className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{sessionError || "Confirming your sign-in before opening your account."}</p>
          {sessionError && <div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={retrySession} className="min-h-11 cursor-pointer rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">Try again</button><Link to="/login" className="inline-flex min-h-11 items-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">Sign in</Link></div>}
          <Link to="/" className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">Back to home</Link>
        </section>
      </main>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
