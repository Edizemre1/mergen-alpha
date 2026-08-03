"use client";

import Link from "next/link";

import { formatUtcDate, interpolate } from "@/modules/i18n";
import type { DemoAnalyst, DemoResearchCard } from "@/modules/public-contracts";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { MarketSparkline } from "./market-sparkline";
import { SocialAvatar } from "./social-avatar";
import { SocialIcon } from "./social-icon";

export function ResearchDetail({ research, analyst }: { readonly research: DemoResearchCard; readonly analyst: DemoAnalyst }) {
  const { state, toggleBookmark } = useDemoState();
  const { locale, t } = useLocale();
  const bookmarked = state.bookmarkedItemIds.includes(research.id);

  return (
    <article className="social-research-detail">
      <Link className="social-back-link" href="/research">← {t("research.back")}</Link>
      <header className="social-research-hero">
        <div className="social-research-hero-meta"><span className="social-page-eyebrow">{t("research.detailEyebrow")}</span><span className="social-access-badge">{t(research.previewOnly ? "common.previewOnly" : "common.public")}</span></div>
        <h1>{research.title}</h1>
        <p>{research.thesisSummary}</p>
        <div className="social-detail-author"><SocialAvatar initials={analyst.initials} label={analyst.name} /><div><Link href={`/analysts/${analyst.slug}`}>{analyst.name}</Link><span>{analyst.handle} / {formatUtcDate(research.publishedAt, locale)}</span></div></div>
        <div className="social-detail-actions"><button type="button" aria-pressed={bookmarked} onClick={() => toggleBookmark(research.id)}><SocialIcon name="bookmarks" />{t(bookmarked ? "common.removeBookmark" : "common.bookmark")}</button><span>{interpolate(t("research.version"), { version: research.version })}</span></div>
      </header>

      <div className="social-research-detail-grid">
        <div className="social-research-article-body">
          <section><h2>{t("research.thesis")}</h2><p>{research.thesisSummary}</p></section>
          <section><h2>{t("social.illustrativeScenario")}</h2><div className="social-research-visual"><MarketSparkline label={`${research.title}: ${t("demo.market")}`} points={[24, 29, 31, 38, 36, 45, 49, 54, 58, 65]} /><small>{t("demo.market")}</small></div></section>
          <section><h2>{t("research.scenario")}</h2>{research.previewOnly ? <div className="social-preview-boundary"><p>{t("research.previewUnavailable")}</p></div> : research.publicSections.map((section) => <p key={section}>{section}</p>)}</section>
          <section><h2>{t("research.invalidation")}</h2><ul>{research.invalidationConditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></section>
          <section><h2>{t("common.sources")}</h2><ol>{research.sourceTitles.map((source) => <li key={source}>{source}</li>)}</ol></section>
          <section><h2>{t("research.disclosures")}</h2><p>{research.disclosure}</p></section>
          <div className="social-boundary-note" role="note"><strong>{t("brand.demo")}</strong><p>{t("research.previewBoundary")}</p><p>{t("demo.market")}</p></div>
        </div>
        <aside className="social-research-facts" aria-label={t("common.research")}>
          <dl><div><dt>{t("common.categories")}</dt><dd>{t(`category.${research.category}`)}</dd></div><div><dt>{t("research.timeHorizon")}</dt><dd>{research.timeHorizon}</dd></div><div><dt>{t("research.risk")}</dt><dd>{t(`risk.${research.risk}`)}</dd></div><div><dt>{t("research.assets")}</dt><dd>{research.assets.join(", ")}</dd></div></dl>
        </aside>
      </div>
    </article>
  );
}
