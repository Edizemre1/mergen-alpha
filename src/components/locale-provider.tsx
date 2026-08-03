"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AppLocale, Dictionary, TranslationKey } from "@/modules/i18n";

interface LocaleContextValue {
  readonly locale: AppLocale;
  readonly dictionary: Dictionary;
  readonly t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  readonly locale: AppLocale;
  readonly dictionary: Dictionary;
  readonly children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary, t: (key) => dictionary[key] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
