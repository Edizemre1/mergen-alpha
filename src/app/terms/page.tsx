import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { createLocalizedMetadata, getDictionary, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), {
    canonicalPath: "/terms",
    titleKey: "terms.title",
    descriptionKey: "terms.fictionBody",
  });
}

export default async function TermsPage() {
  const d = getDictionary(await getRequestLocale());
  return (
    <LegalPage
      eyebrow={d["terms.eyebrow"]}
      title={d["terms.title"]}
      intro={d["terms.launchBody"]}
      sections={[
        { title: d["terms.fictionTitle"], body: d["terms.fictionBody"] },
        { title: d["terms.adviceTitle"], body: d["terms.adviceBody"] },
        { title: d["terms.rewardsTitle"], body: d["terms.rewardsBody"] },
        { title: d["terms.launchTitle"], body: d["terms.launchBody"] },
      ]}
    />
  );
}
