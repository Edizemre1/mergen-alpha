"use client";

import Link from "next/link";

import { demoResearchCards } from "@/modules/demo";
import type { DemoAnalyst } from "@/modules/public-contracts";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { ResearchCardView } from "./research-card";
import { SocialAvatar } from "./social-avatar";

export function AnalystProfile({ analyst }: { readonly analyst: DemoAnalyst }) {
  const { state, toggleFollow } = useDemoState();
  const { t } = useLocale();
  const followed = state.followedAnalystIds.includes(analyst.id);
  const research = demoResearchCards.filter((item) => item.analystId === analyst.id);

  return (
    <div className="social-profile-page social-analyst-page">
      <div className="social-profile-cover" aria-hidden="true" />
      <section className="social-profile-hero" aria-labelledby="analyst-profile-title">
        <Link className="social-back-link" href="/explore">← {t("nav.explore")}</Link>
        <div className="social-profile-avatar"><SocialAvatar initials={analyst.initials} size="large" label={analyst.name} /></div>
        <div className="social-profile-identity-header">
          <div><span className="social-page-eyebrow">{t("analyst.profileEyebrow")}</span><h1 id="analyst-profile-title">{analyst.name} <span aria-hidden="true">✓</span></h1><p>{analyst.handle} / {analyst.role}</p></div>
          <button type="button" aria-pressed={followed} onClick={() => toggleFollow(analyst.id)}>{followed ? t("common.unfollow") : t("common.follow")}</button>
        </div>
        <p className="social-profile-bio">{analyst.biography}</p>
        <div className="social-tag-list">{analyst.specialties.map((specialty) => <span key={specialty}>{t(`category.${specialty}`)}</span>)}</div>
        <div className="social-profile-stats">
          <div><strong>{research.length}</strong><span>{t("common.research")}</span></div>
          <div><strong>{t("brand.demo")}</strong><span>{t("common.posts")}</span></div>
          <div><strong>{t("common.localOnly")}</strong><span>{t("common.follow")}</span></div>
          <div><strong>0</strong><span>{t("social.performanceClaims")}</span></div>
        </div>
      </section>

      <div className="social-profile-stream">
        <article className="social-pinned-thesis">
          <span>{t("analyst.disclosure")}</span>
          <h2>{t("analyst.biography")}</h2>
          <p>{analyst.disclosure}</p>
        </article>
        <div className="social-section-header"><h2>{t("analyst.research")}</h2><span>{t("research.previewBoundary")}</span></div>
        {research.map((item) => <ResearchCardView analyst={analyst} key={item.id} research={item} />)}
        {research.length === 0 && <div className="social-empty-state"><p>{t("common.noResults")}</p></div>}
      </div>
    </div>
  );
}
