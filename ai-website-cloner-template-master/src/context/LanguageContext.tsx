"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LANGUAGES = ["ar", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export type Direction = "rtl" | "ltr";

type LanguageContextValue = {
  language: Language;
  dir: Direction;
  // Sets the language directly — used by anything that knows which language
  // it wants (e.g. Step01Language's AR/EN cards), as opposed to toggleLanguage
  // below, which just flips to "the other one" (the Header's single button).
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");
  const dir: Direction = language === "ar" ? "rtl" : "ltr";

  // Site-wide effect: every page and component inherits this via CSS (grid/flex
  // ordering, text-align, etc. all follow the inherited `dir`), so this single
  // effect is what flips the whole layout, not just the Header itself.
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  function toggleLanguage() {
    setLanguage((current) => LANGUAGES[(LANGUAGES.indexOf(current) + 1) % LANGUAGES.length]);
  }

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
