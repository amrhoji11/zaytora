"use client";

import { createContext, useContext, useEffect, useState } from "react";

const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "zaytora-theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Reads the DOM class the inline no-flash script in layout.tsx already
// applied before hydration — but ONLY ever called from inside an effect
// (after mount), never as this state's own initial value. A `useState`
// lazy initializer runs during hydration too, on the client, where
// `document` exists — so if it read the DOM's *already-corrected* class
// there (which can differ from `<html>`'s hardcoded server-rendered "dark"
// className whenever a guest's saved theme is "light"), React would hydrate
// this component tree with a different value than the server sent, a real
// mismatch (exactly the `typeof window !== "undefined"` branch React's own
// hydration-mismatch warning calls out). Starting every render — server AND
// the client's hydration pass — at the same fixed "dark" default keeps
// hydration consistent; the effect below then corrects it a tick later,
// client-only, where a state update can't be compared against SSR output.
function readDomTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Syncs React state to whatever the no-flash script already decided, once
  // after mount — not on every dependency change, so this never fights the
  // effect below (which is theme's own source of truth once the user
  // interacts).
  useEffect(() => {
    setThemeState(readDomTheme());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (private mode, etc.) — theme still works
      // for the current page load, just won't persist across visits.
    }
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
  }

  function toggleTheme() {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
