import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResearchDetail } from "@/components/research-detail";
import { demoResearchCards, getAnalystById, getResearchBySlug } from "@/modules/demo";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoResearchCards.map((research) => ({ slug: research.slug }));
}

export async function generateMetadata({ params }: { readonly params: Promise<{ slug: string }> }): Promise<Metadata> {
  const research = getResearchBySlug((await params).slug);
  return research
    ? { title: `${research.title} | Mergen Alpha`, description: research.thesisSummary }
    : { title: "Research not found | Mergen Alpha" };
}

export default async function ResearchDetailPage({ params }: { readonly params: Promise<{ slug: string }> }) {
  const research = getResearchBySlug((await params).slug);
  if (!research) {
    notFound();
  }
  const analyst = getAnalystById(research.analystId);
  if (!analyst) {
    notFound();
  }
  return <ResearchDetail analyst={analyst} research={research} />;
}
