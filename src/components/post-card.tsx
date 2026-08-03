"use client";

import Link from "next/link";

import { formatUtcDate } from "@/modules/i18n";
import type { DemoAnalyst, DemoInsightPost } from "@/modules/public-contracts";

import { useLocale } from "./locale-provider";
import { SocialActions } from "./social-actions";
import { SocialAvatar } from "./social-avatar";

export function PostCard({ post, analyst }: { readonly post: DemoInsightPost; readonly analyst: DemoAnalyst }) {
  const { locale, t } = useLocale();
  return (
    <article className="social-feed-card social-insight-card">
      <header className="social-post-header">
        <Link className="social-avatar-link" href={`/analysts/${analyst.slug}`} aria-label={`${t("common.viewProfile")} ${analyst.name}`}>
          <SocialAvatar initials={analyst.initials} label={analyst.name} />
        </Link>
        <Link className="social-creator-identity" href={`/analysts/${analyst.slug}`}>
          <span><strong>{analyst.name}</strong><span className="social-verified" aria-hidden="true">✓</span></span>
          <small>{analyst.handle} / {formatUtcDate(post.publishedAt, locale)}</small>
        </Link>
        <span className="social-view-badge social-view-neutral">{t("brand.demo")}</span>
      </header>
      <div className="social-post-body">
        <p>{post.body}</p>
        <div className="social-topic-pills" aria-label={t("research.assets")}>
          {post.assets.map((asset) => <span key={asset}>${asset}</span>)}
        </div>
        <details className="social-disclosure">
          <summary>{t("common.expandDisclosure")}</summary>
          <p>{analyst.disclosure}</p>
        </details>
      </div>
      <SocialActions itemId={post.id} />
    </article>
  );
}
