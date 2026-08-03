"use client";

import { useMemo, useState } from "react";

import { demoInsightPosts, demoResearchCards, getAnalystById } from "@/modules/demo";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { PostCard } from "./post-card";
import { ResearchCardView } from "./research-card";
import { SocialAvatar } from "./social-avatar";
import { SocialFilterTabs } from "./social-filter-tabs";
import { SocialIcon } from "./social-icon";

type FeedTab = "for-you" | "following" | "research" | "latest";
const tabs = ["for-you", "following", "research", "latest"] as const satisfies readonly FeedTab[];

type FeedEntry =
  | { readonly type: "post"; readonly id: string; readonly publishedAt: string; readonly analystId: string; readonly value: (typeof demoInsightPosts)[number] }
  | { readonly type: "research"; readonly id: string; readonly publishedAt: string; readonly analystId: string; readonly value: (typeof demoResearchCards)[number] };

const feedEntries: readonly FeedEntry[] = [
  ...demoInsightPosts.map((value) => ({ type: "post" as const, id: value.id, publishedAt: value.publishedAt, analystId: value.analystId, value })),
  ...demoResearchCards.map((value) => ({ type: "research" as const, id: value.id, publishedAt: value.publishedAt, analystId: value.analystId, value })),
].sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));

export function HomeFeed() {
  const { state } = useDemoState();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("en-US");
    let entries = [...feedEntries];
    if (activeTab === "following") entries = entries.filter((entry) => state.followedAnalystIds.includes(entry.analystId));
    if (activeTab === "research") entries = entries.filter((entry) => entry.type === "research");
    if (activeTab === "latest") entries.reverse();
    if (needle) {
      entries = entries.filter((entry) => {
        const analyst = getAnalystById(entry.analystId);
        const value = entry.type === "post" ? entry.value.body : `${entry.value.title} ${entry.value.thesisSummary}`;
        return `${analyst?.name ?? ""} ${value}`.toLocaleLowerCase("en-US").includes(needle);
      });
    }
    return entries;
  }, [activeTab, query, state.followedAnalystIds]);

  const tabLabel = (tab: FeedTab) => ({
    "for-you": t("social.forYou"),
    following: t("social.following"),
    research: t("nav.research"),
    latest: t("social.latest"),
  })[tab];

  return (
    <>
      <h1 className="sr-only">{t("home.title")}</h1>
      <section className="social-composer" aria-labelledby="social-composer-title">
        <SocialAvatar initials="MA" size="small" />
        <div className="social-composer-main">
          <label id="social-composer-title" htmlFor="social-disabled-composer">{t("home.composerTitle")}</label>
          <textarea id="social-disabled-composer" rows={2} disabled placeholder={t("home.composerPlaceholder")} />
          <div className="social-composer-toolbar">
            <div className="social-composer-types" aria-hidden="true">
              <span>◇</span><span>▤</span><span>◳</span><span>⌁</span>
            </div>
            <button type="button" disabled><SocialIcon name="compose" />{t("home.composerDisabled")}</button>
          </div>
        </div>
      </section>

      <div className="social-feed-tabs">
        <SocialFilterTabs
          ariaLabel={t("home.feed")}
          controlsId="home-feed-results"
          idPrefix="home-feed-tab"
          items={tabs}
          label={tabLabel}
          onChange={setActiveTab}
          value={activeTab}
        />
        <button type="button" data-active={filtersOpen} aria-pressed={filtersOpen} aria-label={t("social.filterFeed")} onClick={() => setFiltersOpen((value) => !value)}>
          <SocialIcon name="filter" />
        </button>
      </div>

      <label className={`social-feed-search${filtersOpen ? " is-visible" : ""}`}>
        <SocialIcon name="search" />
        <span className="sr-only">{t("common.search")}</span>
        <input type="search" value={query} placeholder={t("common.searchPlaceholder")} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <section id="home-feed-results" role="tabpanel" aria-labelledby={`home-feed-tab-${tabs.indexOf(activeTab)}`} className="social-feed-stream">
        {visible.map((entry) => {
          const analyst = getAnalystById(entry.analystId);
          if (!analyst) return null;
          return entry.type === "post"
            ? <PostCard analyst={analyst} key={entry.id} post={entry.value} />
            : <ResearchCardView analyst={analyst} key={entry.id} research={entry.value} />;
        })}
        {visible.length === 0 && (
          <div className="social-empty-state">
            <SocialIcon name="search" />
            <h2>{t("common.noResults")}</h2>
            <p>{t("common.localOnly")}</p>
            <button type="button" onClick={() => { setActiveTab("for-you"); setQuery(""); }}>{t("common.reset")}</button>
          </div>
        )}
      </section>
    </>
  );
}
