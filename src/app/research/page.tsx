import type { Metadata } from "next";

import { ResearchDirectory } from "@/components/research-directory";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), "research.title", "research.description");
}

export default function ResearchPage() {
  return <ResearchDirectory />;
}
