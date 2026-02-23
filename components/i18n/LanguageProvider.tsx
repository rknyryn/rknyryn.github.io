"use client";

import React from "react";

type Locale = "en" | "tr";

type Translations = Record<string, string>;

const LocaleContext = React.createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: string) => string;
} | null>(null);

async function loadLocale(locale: Locale): Promise<Translations> {
  if (locale === "tr") {
    const mod = await import("@data/locales/tr.json");
    return ((mod as any).default ?? mod) as Translations;
  }
  const mod = await import("@data/locales/en.json");
  return ((mod as any).default ?? mod) as Translations;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start with server-friendly default to avoid SSR/client hydration mismatch.
  const [locale, setLocale] = React.useState<Locale>("en");
  const [translations, setTranslations] = React.useState<Translations>({});

  // On mount, read user's saved locale and load translations.
  React.useEffect(() => {
    let mounted = true;
    // Read stored locale after mount to keep server/client markup consistent.
    const stored = (typeof window !== "undefined" && localStorage.getItem("locale")) as Locale | null;
    const initial = (stored as Locale) || locale;
    if (initial !== locale) {
      setLocale(initial);
    }

    // Load translations for the current (possibly updated) locale.
    loadLocale(initial).then((t) => {
      if (mounted) setTranslations(t as Translations);
    });

    if (typeof window !== "undefined") localStorage.setItem("locale", initial);

    return () => {
      mounted = false;
    };
  }, []);

  // Reload translations whenever locale changes (after initial mount changes).
  React.useEffect(() => {
    let mounted = true;
    loadLocale(locale).then((t) => {
      if (mounted) setTranslations(t as Translations);
    });
    if (typeof window !== "undefined") localStorage.setItem("locale", locale);
    return () => {
      mounted = false;
    };
  }, [locale]);

  const value = React.useMemo(
    () => ({
      locale,
      setLocale: (l: Locale) => setLocale(l),
      t: (k: string) => {
        const parts = k.split(".");
        let cur: any = translations;
        for (const p of parts) {
          if (cur == null) return k;
          cur = cur[p];
        }
        return typeof cur === "string" ? cur : k;
      },
    }),
    [locale, translations]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
