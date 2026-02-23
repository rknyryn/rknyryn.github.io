"use client";

import { useTranslation } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLocale("en")}
        className={`text-xs px-2 py-1 rounded cursor-pointer ${locale === "en" ? "bg-foreground text-background" : "hover:underline"}`}>
        EN
      </button>
      <button
        onClick={() => setLocale("tr")}
        className={`text-xs px-2 py-1 rounded cursor-pointer ${locale === "tr" ? "bg-foreground text-background" : "hover:underline"}`}>
        TR
      </button>
    </div>
  );
}
