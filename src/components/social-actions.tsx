"use client";

import { useState } from "react";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { SocialIcon } from "./social-icon";

export function SocialActions({ itemId }: { readonly itemId: string }) {
  const { state, toggleLike, toggleBookmark } = useDemoState();
  const { t } = useLocale();
  const [replied, setReplied] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [shared, setShared] = useState(false);
  const liked = state.likedPostIds.includes(itemId);
  const bookmarked = state.bookmarkedItemIds.includes(itemId);

  return (
    <div className="social-actions" aria-label={t("social.actions")}>
      <button type="button" aria-pressed={replied} aria-label={t("social.reply")} onClick={() => setReplied((value) => !value)}>
        <SocialIcon name="reply" />
        <span>{replied ? t("common.localOnly") : t("social.reply")}</span>
      </button>
      <button className={reposted ? "is-reposted" : undefined} type="button" aria-pressed={reposted} aria-label={t("social.repost")} onClick={() => setReposted((value) => !value)}>
        <SocialIcon name="repost" />
        <span>{t("social.repost")}</span>
      </button>
      <button className={liked ? "is-liked" : undefined} type="button" aria-pressed={liked} aria-label={t(liked ? "common.unlike" : "common.like")} onClick={() => toggleLike(itemId)}>
        <SocialIcon name="like" />
        <span>{t(liked ? "common.unlike" : "common.like")}</span>
      </button>
      <span className="social-views" aria-label={t("social.demoMetric")}>
        <SocialIcon name="chart" />
        <span>{t("brand.demo")}</span>
      </span>
      <button className={bookmarked ? "is-bookmarked" : undefined} type="button" aria-pressed={bookmarked} aria-label={t(bookmarked ? "common.removeBookmark" : "common.bookmark")} onClick={() => toggleBookmark(itemId)}>
        <SocialIcon name="bookmarks" />
        <span className="sr-only">{t(bookmarked ? "common.removeBookmark" : "common.bookmark")}</span>
      </button>
      <button className={shared ? "is-shared" : undefined} type="button" aria-pressed={shared} aria-label={t("social.share")} onClick={() => setShared(true)}>
        <SocialIcon name="share" />
        <span className="sr-only">{t("social.share")}</span>
      </button>
    </div>
  );
}
