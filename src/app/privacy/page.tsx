import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { createLocalizedMetadata, getDictionary, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), {
    canonicalPath: "/privacy",
    titleKey: "privacy.title",
    descriptionKey: "privacy.intro",
  });
}

export default async function PrivacyPage() {
  const d = getDictionary(await getRequestLocale());
  return (
    <LegalPage
      eyebrow={d["privacy.eyebrow"]}
      title={d["privacy.title"]}
      intro={d["privacy.intro"]}
      sections={[
        { title: d["privacy.localeTitle"], body: d["privacy.localeBody"] },
        { title: d["privacy.localTitle"], body: d["privacy.localBody"] },
        { title: d["privacy.walletTitle"], body: d["privacy.walletBody"] },
        { title: d["privacy.launchTitle"], body: d["privacy.launchBody"] },
      ]}
    />
  );
}
