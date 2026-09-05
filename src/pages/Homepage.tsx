import React from "react";
import { ArrowRight, BarChart3, ShieldCheck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 transition-colors dark:bg-gray-950 dark:text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 dark:bg-blue-600">
              <Wallet size={18} className="text-white" />
            </div>

            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg">
              FinanceTracker
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              How it works
            </a>
          </div>

          {/* Auth buttons */}
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:px-4 sm:py-2.5"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 sm:px-4 sm:py-2.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
            Take control of your finances
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Manage your money.
            <br />
            <span className="text-gray-500 dark:text-gray-400">
              Understand your spending.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
            FinanceTracker helps you record your income and expenses, monitor
            your balance, and understand where your money goes — all from one
            simple dashboard.
          </p>

          {/* Hero Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 sm:w-auto"
            >
              Start Tracking
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="w-full rounded-xl border border-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-gray-100 bg-gray-50 px-4 py-16 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              FEATURES
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Everything you need to stay organized
            </h2>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Keep track of your finances without making money management
              complicated.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3 md:gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <Wallet
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                Track Transactions
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Quickly record your income and expenses and keep all your
                financial activity in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <BarChart3
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                Understand Your Finances
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                View your income, expenses, balance, and financial activity
                through a simple dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <ShieldCheck
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                Keep Things Organized
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Categorize your transactions and maintain a clear picture of
                where your money is going.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white px-4 py-16 dark:bg-gray-950 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Start managing your finances in three steps
            </h2>
          </div>

          {/* Steps */}
          <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-3">
            <div>
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                01
              </span>

              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                Create an account
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Sign up and create your personal finance account.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                02
              </span>

              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                Record transactions
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Add your income and expenses as they happen.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                03
              </span>

              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                Understand your money
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Use your dashboard and analytics to understand your financial
                habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 dark:bg-gray-950 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gray-900 px-5 py-12 text-center text-white dark:bg-gray-800 sm:px-8 sm:py-16 md:px-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Take control of your finances today.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
            Start tracking your money and build a clearer picture of your
            financial life.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 sm:w-auto"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8 dark:border-gray-800 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-sm text-gray-500 dark:text-gray-400 md:flex-row md:text-left">
          <p>© 2026 FinanceTracker. All rights reserved.</p>

          <p>Built to make money management simpler.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
