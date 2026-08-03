"use client";

import Link from "next/link";
import { useState } from "react";

import { demoAnalysts, demoInsightPosts, demoResearchCards } from "@/modules/demo";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { PostCard } from "./post-card";
import { ResearchCardView } from "./research-card";
import { SocialAvatar } from "./social-avatar";
import { SocialFilterTabs } from "./social-filter-tabs";

type ProfileTab = "posts" | "research" | "about";
const tabs = ["posts", "research", "about"] as const satisfies readonly ProfileTab[];

export function ProfileView() {
  const analyst = demoAnalysts[0];
  const { state, reset, toggleFollow } = useDemoState();
  const { t } = useLocale();
  const [tab, setTab] = useState<ProfileTab>("posts");
  const [announcement, setAnnouncement] = useState("");
  const followed = state.followedAnalystIds.includes(analyst.id);
  const posts = demoInsightPosts.filter((item) => item.analystId === analyst.id);
  const research = demoResearchCards.filter((item) => item.analystId === analyst.id);
  const label = (item: ProfileTab) => ({ posts: t("common.posts"), research: t("common.research"), about: t("analyst.biography") })[item];

  function resetState() {
    reset();
    setAnnouncement(t("common.resetDone"));
  }

  return (
    <div className="social-profile-page">
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      <div className="social-profile-cover" aria-hidden="true" />
      <section className="social-profile-hero" aria-labelledby="social-profile-title">
        <div className="social-profile-avatar"><SocialAvatar initials={analyst.initials} size="large" label={analyst.name} /></div>
        <div className="social-profile-identity-header">
          <div><h1 id="social-profile-title">{analyst.name} <span aria-hidden="true">✓</span></h1><p>{analyst.handle} / {t("analyst.profileEyebrow")}</p></div>
          <button type="button" aria-pressed={followed} onClick={() => toggleFollow(analyst.id)}>{followed ? t("common.unfollow") : t("common.follow")}</button>
        </div>
        <p className="social-profile-bio">{analyst.biography}</p>
        <div className="social-profile-meta"><span>◇ Base Sepolia / {t("wallet.inactive")}</span><span>◷ {t("brand.demo")}</span><span>▤ {t("common.localOnly")}</span></div>
        <div className="social-tag-list">{analyst.specialties.map((item) => <span key={item}>{t(`category.${item}`)}</span>)}</div>
        <div className="social-profile-stats" aria-label={t("profile.state")}>
          <div><strong>{state.likedPostIds.length}</strong><span>{t("common.like")}</span></div>
          <div><strong>{state.bookmarkedItemIds.length}</strong><span>{t("nav.bookmarks")}</span></div>
          <div><strong>{state.followedAnalystIds.length}</strong><span>{t("common.follow")}</span></div>
          <div><strong>{research.length}</strong><span>{t("common.research")}</span></div>
        </div>
      </section>
      <SocialFilterTabs ariaLabel={t("profile.state")} controlsId="profile-content" idPrefix="profile-tab" items={tabs} label={label} onChange={setTab} value={tab} variant="pills" />
      <section id="profile-content" role="tabpanel" aria-labelledby={`profile-tab-${tabs.indexOf(tab)}`} className="social-profile-stream">
        {tab === "posts" && <>{posts.map((post) => <PostCard analyst={analyst} key={post.id} post={post} />)}{posts.length === 0 && <div className="social-empty-state"><p>{t("common.noResults")}</p></div>}</>}
        {tab === "research" && research.map((item) => <ResearchCardView analyst={analyst} key={item.id} research={item} />)}
        {tab === "about" && <article className="social-pinned-thesis"><span>{t("analyst.biography")}</span><h2>{analyst.role}</h2><p>{analyst.disclosure}</p><div className="social-profile-actions"><Link href={`/analysts/${analyst.slug}`}>{t("common.viewProfile")}</Link><button type="button" onClick={resetState}>{t("common.reset")}</button></div></article>}
      </section>
    </div>
  );
}
