import { useAuth } from "./AuthContext";
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }

    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        isAuthenticated && (theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches));

      root.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }
  }, [theme, isAuthenticated]);

  const setTheme = (newTheme: Theme) => {
    if (!isAuthenticated) return;
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: isAuthenticated ? theme : "light", setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
