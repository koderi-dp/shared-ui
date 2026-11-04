import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEMES: readonly Theme[] = ["light", "dark", "system"];

/** The localStorage key ThemeProvider and the no-flash script in index.html share. */
export const THEME_STORAGE_KEY = "ui-theme";

export const DARK_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** The theme actually drawn: "system" follows the OS. */
export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}

/** Puts the resolved theme on <html> as shadcn expects: a `dark` class, or none. */
export function applyTheme(root: { classList: DOMTokenList }, theme: ResolvedTheme): void {
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export type ThemeContextValue = {
  /** What the person chose. */
  theme: Theme;
  /** What is drawn, with "system" resolved. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
