import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "pl" | "en";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: "pl", setLanguage: () => undefined });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pl");

  useEffect(() => {
    const stored = window.localStorage.getItem("aps-language");
    if (stored === "pl" || stored === "en") setLanguage(stored);
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem("aps-language", next);
    document.documentElement.lang = next;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useCopy<T>(pl: T, en: T) {
  const { language } = useLanguage();
  return language === "pl" ? pl : en;
}
