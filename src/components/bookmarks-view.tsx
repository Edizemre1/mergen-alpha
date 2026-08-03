"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { demoInsightPosts, demoResearchCards, getAnalystById } from "@/modules/demo";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { SocialAvatar } from "./social-avatar";
import { SocialFilterTabs } from "./social-filter-tabs";
import { SocialIcon } from "./social-icon";

type BookmarkFilter = "all" | "posts" | "research";
const filters = ["all", "posts", "research"] as const satisfies readonly BookmarkFilter[];

export function BookmarksView() {
  const { state, toggleBookmark } = useDemoState();
  const { t } = useLocale();
  const [filter, setFilter] = useState<BookmarkFilter>("all");
  const catalog = useMemo(() => [
    ...demoResearchCards.map((value) => ({ id: value.id, type: "research" as const, analystId: value.analystId, title: value.title, summary: value.thesisSummary, href: `/research/${value.slug}`, topics: value.assets })),
    ...demoInsightPosts.map((value) => ({ id: value.id, type: "posts" as const, analystId: value.analystId, title: value.body, summary: value.assets.join(" / "), href: "/", topics: value.assets })),
  ].filter((item) => filter === "all" || item.type === filter), [filter]);
  const savedCount = catalog.filter((item) => state.bookmarkedItemIds.includes(item.id)).length;
  const label = (item: BookmarkFilter) => ({ all: t("common.all"), posts: t("common.posts"), research: t("common.research") })[item];

  return (
    <div className="social-page-section">
      <header className="social-page-header">
        <div className="social-page-heading"><span className="social-page-eyebrow">{t("bookmarks.eyebrow")}</span><h1>{t("bookmarks.title")}</h1><p>{t("bookmarks.description")}</p></div>
        <span className="social-boundary-pill">{t("common.localOnly")}</span>
      </header>
      <div className="social-activity-summary">
        <SocialFilterTabs ariaLabel={t("bookmarks.title")} controlsId="bookmark-results" idPrefix="bookmark-filter" items={filters} label={label} onChange={setFilter} value={filter} variant="pills" />
        <span className="social-status-pill">{savedCount} / {catalog.length} {t("brand.demo")}</span>
      </div>
      <div className="social-collection-bar"><h2>{t("bookmarks.title")}</h2><p>{t("bookmarks.openProfile")}</p></div>
      <section id="bookmark-results" role="tabpanel" aria-labelledby={`bookmark-filter-${filters.indexOf(filter)}`} className="social-bookmark-list">
        {catalog.map((item) => {
          const analyst = getAnalystById(item.analystId);
          if (!analyst) return null;
          const saved = state.bookmarkedItemIds.includes(item.id);
          return (
            <article className="social-bookmark-row" key={item.id} data-saved={saved}>
              <div>
                <div className="social-bookmark-identity"><SocialAvatar initials={analyst.initials} size="small" label={analyst.name} /><span><strong>{analyst.name}</strong><small>{analyst.handle} / {t("brand.demo")}</small></span><span className="social-type-pill">{t(item.type === "research" ? "common.research" : "common.posts")}</span></div>
                <h2>{item.title}</h2><p>{item.summary}</p>
                <div className="social-tag-list">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
              </div>
              <div className="social-bookmark-actions">
                <Link href={item.href} aria-label={`${t("common.open")} ${item.title}`}><SocialIcon name="open" /></Link>
                <button type="button" aria-pressed={saved} aria-label={t(saved ? "common.removeBookmark" : "common.bookmark")} onClick={() => toggleBookmark(item.id)}><SocialIcon name={saved ? "close" : "bookmarks"} /></button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
