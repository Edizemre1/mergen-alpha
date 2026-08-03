"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { demoAnalysts, demoInsightPosts, demoResearchCards, demoTopics } from "@/modules/demo";
import type { DemoCategory } from "@/modules/public-contracts";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { SocialAvatar } from "./social-avatar";
import { SocialIcon } from "./social-icon";

const categories = ["all", "semiconductors", "macro", "energy", "infrastructure"] as const satisfies readonly (DemoCategory | "all")[];

export function ExploreDirectory() {
  const { state, toggleFollow } = useDemoState();
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DemoCategory | "all">("all");
  const normalized = query.trim().toLocaleLowerCase("en-US");

  const analysts = useMemo(() => demoAnalysts.filter((analyst) => {
    const categoryMatch = category === "all" || analyst.specialties.some((specialty) => specialty === category);
    const searchMatch = !normalized || [analyst.name, analyst.handle, analyst.role, ...analyst.specialties].join(" ").toLocaleLowerCase("en-US").includes(normalized);
    return categoryMatch && searchMatch;
  }), [category, normalized]);

  return (
    <div className="social-page-section">
      <header className="social-page-header">
        <div className="social-page-heading">
          <span className="social-page-eyebrow">{t("explore.eyebrow")}</span>
          <h1>{t("explore.title")}</h1>
          <p>{t("explore.description")}</p>
        </div>
        <span className="social-boundary-pill">{t("common.localOnly")}</span>
      </header>

      <div className="social-control-bar">
        <label className="social-search-control">
          <SocialIcon name="search" />
          <span className="sr-only">{t("common.search")}</span>
          <input type="search" value={query} placeholder={t("common.searchPlaceholder")} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <span className="social-status-pill">{analysts.length} {t("common.analysts")}</span>
      </div>

      <section aria-labelledby="social-trending-now">
        <div className="social-section-header">
          <h2 id="social-trending-now">{t("explore.trending")}</h2>
          <span>{t("demo.market")}</span>
        </div>
        <div className="social-trend-strip">
          {demoTopics.map((topic) => (
            <button type="button" key={topic.id} onClick={() => setQuery(topic.label)}>
              <span>#{topic.label.replaceAll(" ", "")}</span>
              <small>{topic.context}</small>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="social-market-topics">
        <div className="social-section-header">
          <h2 id="social-market-topics">{t("common.categories")}</h2>
          <span>{t("explore.description")}</span>
        </div>
        <div className="social-category-grid">
          {categories.slice(1).map((item) => {
            const selected = category === item;
            return (
              <button type="button" className="social-category-card" aria-pressed={selected} key={item} onClick={() => setCategory(selected ? "all" : item)}>
                <SocialIcon name={item === "macro" ? "chart" : item === "energy" ? "network" : item === "infrastructure" ? "research" : "filter"} />
                <span><strong>{t(`category.${item}`)}</strong><small>{t("demo.market")}</small></span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="social-analyst-directory">
        <div className="social-section-header">
          <h2 id="social-analyst-directory">{t("explore.analysts")}</h2>
          <span>{t("common.localOnly")}</span>
        </div>
        <div className="social-creator-directory">
          {analysts.map((analyst) => {
            const followed = state.followedAnalystIds.includes(analyst.id);
            return (
              <article className="social-creator-row" key={analyst.id}>
                <SocialAvatar initials={analyst.initials} label={analyst.name} />
                <div className="social-creator-row-identity">
                  <Link href={`/analysts/${analyst.slug}`}>{analyst.name}<span aria-hidden="true">✓</span></Link>
                  <small>{analyst.handle} / {t(`category.${analyst.specialties[0]}`)}</small>
                </div>
                <p>{analyst.role}</p>
                <button type="button" aria-pressed={followed} onClick={() => toggleFollow(analyst.id)}>
                  {!followed && <SocialIcon name="follow" />}{followed ? t("common.unfollow") : t("common.follow")}
                </button>
              </article>
            );
          })}
          {analysts.length === 0 && <div className="social-empty-state"><SocialIcon name="search" /><h2>{t("common.noResults")}</h2><button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>{t("common.reset")}</button></div>}
        </div>
      </section>

      <section aria-labelledby="social-research-attention">
        <div className="social-section-header">
          <h2 id="social-research-attention">{t("explore.research")}</h2>
          <Link href="/research">{t("common.open")} <SocialIcon name="open" /></Link>
        </div>
        <div className="social-content-grid">
          {demoResearchCards.map((research) => (
            <article className="social-mini-research-card" key={research.id}>
              <header><span>{t(`category.${research.category}`)}</span><span className="social-type-pill">{t(research.previewOnly ? "common.previewOnly" : "common.public")}</span></header>
              <div><h3>{research.title}</h3><p>{research.thesisSummary}</p></div>
              <footer><span>v{research.version} / {t("brand.demo")}</span><Link href={`/research/${research.slug}`}>{t("common.read")}</Link></footer>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="social-discussions">
        <div className="social-section-header"><h2 id="social-discussions">{t("common.posts")}</h2><span>{t("common.localOnly")}</span></div>
        <div className="social-discussion-list">
          {demoInsightPosts.slice(0, 3).map((post) => {
            const analyst = demoAnalysts.find((item) => item.id === post.analystId);
            return analyst ? (
              <article className="social-discussion-card" key={post.id}>
                <SocialAvatar initials={analyst.initials} size="small" label={analyst.name} />
                <div><h3>{post.body}</h3><p>{analyst.name} / {t("brand.demo")}</p></div>
                <span><SocialIcon name="reply" /> {t("common.localOnly")}</span>
              </article>
            ) : null;
          })}
        </div>
      </section>
    </div>
  );
}
