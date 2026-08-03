import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { createLocalizedMetadata, getDictionary, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), "support.title", "support.description");
}

export default async function SupportPage() {
  const d = getDictionary(await getRequestLocale());
  return (
    <LegalPage
      eyebrow={d["support.eyebrow"]}
      title={d["support.title"]}
      intro={d["support.description"]}
      sections={[
        { title: d["support.contactTitle"], body: d["support.contactBody"] },
        { title: d["support.securityTitle"], body: d["support.securityBody"] },
      ]}
    />
  );
}
