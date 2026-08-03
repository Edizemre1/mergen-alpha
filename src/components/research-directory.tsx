"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { demoResearchCards, getAnalystById } from "@/modules/demo";
import type { DemoCategory } from "@/modules/public-contracts";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { MarketSparkline } from "./market-sparkline";
import { SocialAvatar } from "./social-avatar";
import { SocialFilterTabs } from "./social-filter-tabs";
import { SocialIcon } from "./social-icon";

type ResearchFilter = "all" | "latest" | "public" | "preview";
const filters = ["all", "latest", "public", "preview"] as const satisfies readonly ResearchFilter[];
const categories = ["all", "semiconductors", "macro", "energy", "infrastructure"] as const satisfies readonly (DemoCategory | "all")[];
const signals = [
  [18, 24, 22, 31, 29, 41, 44, 52, 49, 61],
  [62, 58, 55, 50, 47, 45, 39, 42, 35, 31],
  [30, 33, 31, 38, 36, 42, 41, 46, 48, 51],
] as const;

export function ResearchDirectory() {
  const { state, toggleBookmark } = useDemoState();
  const { t } = useLocale();
  const [filter, setFilter] = useState<ResearchFilter>("all");
  const [category, setCategory] = useState<DemoCategory | "all">("all");
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("en-US");

  const visible = useMemo(() => {
    const result = demoResearchCards.filter((research) => {
      const filterMatch = filter === "all" || filter === "latest" || (filter === "preview" ? research.previewOnly : !research.previewOnly);
      const categoryMatch = category === "all" || research.category === category;
      const searchMatch = !normalized || [research.title, research.thesisSummary, ...research.assets].join(" ").toLocaleLowerCase("en-US").includes(normalized);
      return filterMatch && categoryMatch && searchMatch;
    });
    return filter === "latest" ? [...result].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)) : result;
  }, [category, filter, normalized]);

  const filterLabel = (item: ResearchFilter) => ({ all: t("common.all"), latest: t("social.latest"), public: t("common.public"), preview: t("common.previewOnly") })[item];

  return (
    <div className="social-page-section">
      <header className="social-page-header">
        <div className="social-page-heading">
          <span className="social-page-eyebrow">{t("research.eyebrow")}</span>
          <h1>{t("research.title")}</h1>
          <p>{t("research.description")}</p>
        </div>
        <span className="social-boundary-pill">{t("research.previewBoundary")}</span>
      </header>

      <div className="social-research-toolbar">
        <div className="social-research-toolbar-top">
          <label className="social-search-control"><SocialIcon name="search" /><span className="sr-only">{t("common.search")}</span><input type="search" value={query} placeholder={t("research.searchPlaceholder")} onChange={(event) => setQuery(event.target.value)} /></label>
          <SocialFilterTabs ariaLabel={t("common.categories")} controlsId="research-directory-results" idPrefix="research-filter" items={filters} label={filterLabel} onChange={setFilter} value={filter} variant="pills" />
        </div>
        <div className="social-topic-filters" aria-label={t("common.categories")}>
          {categories.map((item) => <button type="button" data-active={category === item} aria-pressed={category === item} key={item} onClick={() => setCategory(item)}>{t(`category.${item}`)}</button>)}
        </div>
      </div>

      <div className="social-activity-summary"><p role="status">{t("research.count").replace("{count}", String(visible.length))}</p><span className="social-status-pill">{filterLabel(filter)} / {t(`category.${category}`)}</span></div>

      <section id="research-directory-results" role="tabpanel" aria-labelledby={`research-filter-${filters.indexOf(filter)}`} className="social-directory-list">
        {visible.map((research, index) => {
          const analyst = getAnalystById(research.analystId);
          if (!analyst) return null;
          const bookmarked = state.bookmarkedItemIds.includes(research.id);
          return (
            <article className="social-directory-card" key={research.id}>
              <header><span>{t(`category.${research.category}`)}</span><span className="social-type-pill">{t(research.previewOnly ? "common.previewOnly" : "common.public")}</span></header>
              <h2>{research.title}</h2>
              <p>{research.thesisSummary}</p>
              <div className="social-directory-identity"><SocialAvatar initials={analyst.initials} size="small" label={analyst.name} /><span><strong>{analyst.name} <span aria-hidden="true">✓</span></strong><small>{analyst.handle}</small></span></div>
              <div className="social-directory-signal"><span>{t("social.illustrativeScenario")}</span><MarketSparkline label={`${research.title}: ${t("demo.market")}`} points={signals[index % signals.length]} positive={research.category !== "macro"} /><small>{t("demo.market")}</small></div>
              <dl className="social-directory-meta">
                <div><dt>{t("research.timeHorizon")}</dt><dd>{research.timeHorizon}</dd></div>
                <div><dt>{t("research.risk")}</dt><dd>{t(`risk.${research.risk}`)}</dd></div>
                <div><dt>{t("common.sources")}</dt><dd>{research.sourceTitles.length}</dd></div>
                <div><dt>{t("research.version").replace("{version}", String(research.version))}</dt><dd>v{research.version}</dd></div>
              </dl>
              <div className="social-directory-footer">
                <span>{research.assets.join(", ")}</span>
                <span><button type="button" aria-pressed={bookmarked} onClick={() => toggleBookmark(research.id)}>{t(bookmarked ? "common.removeBookmark" : "common.bookmark")}</button><Link href={`/research/${research.slug}`}>{t("common.read")}</Link></span>
              </div>
            </article>
          );
        })}
        {visible.length === 0 && <div className="social-empty-state"><SocialIcon name="search" /><h2>{t("common.noResults")}</h2><button type="button" onClick={() => { setQuery(""); setFilter("all"); setCategory("all"); }}>{t("common.reset")}</button></div>}
      </section>
    </div>
  );
}
