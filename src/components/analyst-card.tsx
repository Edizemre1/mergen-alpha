"use client";

import Link from "next/link";

import type { DemoAnalyst } from "@/modules/public-contracts";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { SocialAvatar } from "./social-avatar";

export function AnalystCard({ analyst }: { readonly analyst: DemoAnalyst }) {
  const { state, toggleFollow } = useDemoState();
  const { t } = useLocale();
  const followed = state.followedAnalystIds.includes(analyst.id);

  return (
    <article className="content-card analyst-card">
      <div className="analyst-card-top">
        <SocialAvatar initials={analyst.initials} large />
        <button type="button" aria-pressed={followed} onClick={() => toggleFollow(analyst.id)}>
          {t(followed ? "common.unfollow" : "common.follow")}
        </button>
      </div>
      <h2><Link href={`/analysts/${analyst.slug}`}>{analyst.name}</Link></h2>
      <p className="handle">{analyst.handle}</p>
      <p>{analyst.role}</p>
      <div className="tag-row">
        {analyst.specialties.map((specialty) => (
          <span className="tag" key={specialty}>{t(`category.${specialty}`)}</span>
        ))}
      </div>
      <Link className="text-link" href={`/analysts/${analyst.slug}`}>{t("common.viewProfile")}</Link>
    </article>
  );
}
