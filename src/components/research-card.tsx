"use client";

import Link from "next/link";

import { formatUtcDate } from "@/modules/i18n";
import type { DemoAnalyst, DemoResearchCard } from "@/modules/public-contracts";

import { useLocale } from "./locale-provider";
import { MarketSparkline } from "./market-sparkline";
import { SocialActions } from "./social-actions";
import { SocialAvatar } from "./social-avatar";

const chartPoints: Readonly<Record<DemoResearchCard["category"], readonly number[]>> = {
  semiconductors: [24, 29, 35, 42, 48, 57, 63, 71, 78, 86, 94, 103],
  macro: [62, 58, 55, 50, 47, 45, 39, 42, 35, 31, 34, 29],
  energy: [26, 28, 33, 38, 46, 55, 65, 73, 82, 88, 93, 97],
  infrastructure: [30, 34, 31, 39, 43, 41, 49, 55, 52, 61, 66, 72],
};

export function ResearchCardView({
  research,
  analyst,
  compact = false,
}: {
  readonly research: DemoResearchCard;
  readonly analyst: DemoAnalyst;
  readonly compact?: boolean;
}) {
  const { locale, t } = useLocale();
  return (
    <article className="social-feed-card social-research-card" data-compact={compact}>
      <header className="social-post-header">
        <Link className="social-avatar-link" href={`/analysts/${analyst.slug}`} aria-label={`${t("common.viewProfile")} ${analyst.name}`}>
          <SocialAvatar initials={analyst.initials} label={analyst.name} />
        </Link>
        <Link className="social-creator-identity" href={`/analysts/${analyst.slug}`}>
          <span><strong>{analyst.name}</strong><span className="social-verified" aria-hidden="true">✓</span></span>
          <small>{analyst.handle} / {formatUtcDate(research.publishedAt, locale)}</small>
        </Link>
        <span className="social-access-badge">{t(research.previewOnly ? "common.previewOnly" : "common.public")}</span>
      </header>
      <div className="social-research-content">
        <span className="social-view-badge social-view-neutral">{t(`category.${research.category}`)}</span>
        <h2><Link href={`/research/${research.slug}`}>{research.title}</Link></h2>
        <p>{research.thesisSummary}</p>
        {!compact && (
          <div className="social-research-visual">
            <div className="social-research-visual-header">
              <span>{t("social.illustrativeScenario")}</span>
              <small>{t("demo.market")}</small>
            </div>
            <MarketSparkline
              bars={research.category === "semiconductors" || research.category === "energy"}
              label={`${research.title}: ${t("demo.market")}`}
              points={chartPoints[research.category]}
              positive={research.category !== "macro"}
            />
            <div className="social-visual-axis" aria-hidden="true"><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></div>
          </div>
        )}
        <div className="social-topic-pills">
          {research.assets.map((asset) => <span key={asset}>{asset}</span>)}
        </div>
        {!compact && (
          <dl className="social-research-meta">
            <div><dt>{t("common.sources")}</dt><dd>{research.sourceTitles.length}</dd></div>
            <div><dt>{t("research.disclosures")}</dt><dd>{t("brand.demo")}</dd></div>
            <div><dt>{t("research.timeHorizon")}</dt><dd>{research.timeHorizon}</dd></div>
            <div><dt>{t("research.version",).replace("{version}", String(research.version))}</dt><dd>v{research.version}</dd></div>
          </dl>
        )}
        <div className="social-research-cta">
          <span>{t("research.previewBoundary")}</span>
          <Link href={`/research/${research.slug}`}>{t("common.read")}</Link>
        </div>
      </div>
      <SocialActions itemId={research.id} />
    </article>
  );
}
