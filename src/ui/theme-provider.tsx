import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePersisted } from "@/ui/use-persisted";
import {
  applyTheme,
  DARK_QUERY,
  isTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
} from "@/ui/theme";

/**
 * shadcn's Vite theme provider: light, dark or system, remembered in localStorage and
 * applied as a class on <html>. Pair it with the script in index.html so the first
 * paint is already in the right theme.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = usePersisted<Theme>(storageKey, defaultTheme, isTheme);
  const [prefersDark, setPrefersDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DARK_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => setPrefersDark(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme = resolveTheme(theme, prefersDark);

  useEffect(() => {
    applyTheme(document.documentElement, resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
