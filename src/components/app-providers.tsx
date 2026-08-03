"use client";

import type { ReactNode } from "react";

import type { AppLocale, Dictionary } from "@/modules/i18n";

import { DemoStateProvider } from "./demo-state-provider";
import { LocaleProvider } from "./locale-provider";

export function AppProviders({
  locale,
  dictionary,
  children,
}: {
  readonly locale: AppLocale;
  readonly dictionary: Dictionary;
  readonly children: ReactNode;
}) {
  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <DemoStateProvider>{children}</DemoStateProvider>
    </LocaleProvider>
  );
}
