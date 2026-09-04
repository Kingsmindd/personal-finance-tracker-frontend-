import React from "react";
import { ArrowRight, BarChart3, ShieldCheck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
              <Wallet size={18} className="text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              FinanceTracker
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition hover:text-gray-900"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-gray-600 transition hover:text-gray-900"
            >
              How it works
            </a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 "
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Take control of your finances
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Manage your money.
            <br />
            <span className="text-gray-500">Understand your spending.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            FinanceTracker helps you record your income and expenses, monitor
            your balance, and understand where your money goes — all from one
            simple dashboard.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              Start Tracking
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="w-full rounded-xl border border-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-gray-100 bg-gray-50 px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-gray-500">FEATURES</p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Everything you need to stay organized
            </h2>

            <p className="mt-4 text-gray-500">
              Keep track of your finances without making money management
              complicated.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <Wallet size={20} className="text-gray-700" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">Track Transactions</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Quickly record your income and expenses and keep all your
                financial activity in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <BarChart3 size={20} className="text-gray-700" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Understand Your Finances
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                View your income, expenses, balance, and financial activity
                through a simple dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <ShieldCheck size={20} className="text-gray-700" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Keep Things Organized
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Categorize your transactions and maintain a clear picture of
                where your money is going.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-gray-500">HOW IT WORKS</p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Start managing your finances in three steps
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <span className="text-sm font-bold text-gray-400">01</span>

              <h3 className="mt-3 text-lg font-semibold">Create an account</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Sign up and create your personal finance account.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-gray-400">02</span>

              <h3 className="mt-3 text-lg font-semibold">
                Record transactions
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add your income and expenses as they happen.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-gray-400">03</span>

              <h3 className="mt-3 text-lg font-semibold">
                Understand your money
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Use your dashboard and analytics to understand your financial
                habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gray-900 px-6 py-16 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Take control of your finances today.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300">
            Start tracking your money and build a clearer picture of your
            financial life.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>© 2026 FinanceTracker. All rights reserved.</p>

          <p>Built to make money management simpler.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
