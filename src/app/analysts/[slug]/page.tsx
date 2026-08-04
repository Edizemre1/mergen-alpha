import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnalystProfile } from "@/components/analyst-profile";
import { demoAnalysts, getAnalystBySlug } from "@/modules/demo";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoAnalysts.map((analyst) => ({ slug: analyst.slug }));
}

export async function generateMetadata({ params }: { readonly params: Promise<{ slug: string }> }): Promise<Metadata> {
  const analyst = getAnalystBySlug((await params).slug);
  return analyst
    ? createLocalizedMetadata(await getRequestLocale(), {
        canonicalPath: `/analysts/${analyst.slug}`,
        authoredTitle: analyst.name,
        authoredDescription: analyst.role,
      })
    : { title: "Analyst not found | Mergen Alpha" };
}

export default async function AnalystDetailPage({ params }: { readonly params: Promise<{ slug: string }> }) {
  const analyst = getAnalystBySlug((await params).slug);
  if (!analyst) {
    notFound();
  }
  return <AnalystProfile analyst={analyst} />;
}
