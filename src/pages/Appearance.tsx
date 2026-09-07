import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Appearance: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const options = [
    {
      value: "light" as const,
      label: "Light",
      description: "Use the light theme",
      icon: Sun,
    },
    {
      value: "dark" as const,
      label: "Dark",
      description: "Use the dark theme",
      icon: Moon,
    },
    {
      value: "system" as const,
      label: "System",
      description: "Follow your device preference",
      icon: Monitor,
    },
  ];
  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-5 dark:bg-gray-900 sm:px-6 sm:py-6 lg:px-8">
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
            Appearance{" "}
          </h1>{" "}
          <p className="mt-1 max-w-md text-sm leading-5 text-gray-500 dark:text-gray-400">
            {" "}
            Choose your preferred theme{" "}
          </p>{" "}
        </div>

        {/* Theme options */}
        <div className="overflow-hidden mt-8  rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {options.map((option, index) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;

            return (
              <React.Fragment key={option.value}>
                {index > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                )}

                <button
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className="flex min-h-19 w-full items-center gap-4 p-4 text-left transition hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600 sm:min-h-21 sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                    <Icon
                      size={19}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>

                  {isSelected && (
                    <Check
                      size={20}
                      className="shrink-0 text-green-600 dark:text-green-400"
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Appearance;
