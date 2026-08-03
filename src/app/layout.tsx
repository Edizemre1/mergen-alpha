import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { AppChrome } from "@/components/app-chrome";
import { AppProviders } from "@/components/app-providers";
import { createLocalizedMetadata, getDictionary, getRequestLocale } from "@/modules/i18n/server";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#090c10",
};

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale());
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <AppProviders dictionary={dictionary} locale={locale}>
          <AppChrome>{children}</AppChrome>
        </AppProviders>
      </body>
    </html>
  );
}
