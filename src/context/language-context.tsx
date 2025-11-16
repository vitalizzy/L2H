"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations } from "@/config/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations[Language];
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLanguage = localStorage.getItem("language") as Language | null;
    const supportedLanguages: Language[] = ["es", "en", "de", "it", "fr", "pt", "hu", "sv", "da", "ru", "ro"];

    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Language;
      if (supportedLanguages.includes(browserLang)) {
        setLanguageState(browserLang);
      } else {
        setLanguageState("en"); // Default to English
      }
    }

    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default English during SSR/build time
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: translations["en"],
    };
  }
  return context;
}
