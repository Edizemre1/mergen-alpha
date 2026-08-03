"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { demoAnalysts, demoResearchCards, demoTopics } from "@/modules/demo";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { MarketSparkline } from "./market-sparkline";
import { SocialAvatar } from "./social-avatar";
import { SocialIcon } from "./social-icon";

const pulse = [
  { symbol: "BASE", points: [31, 35, 33, 41, 39, 48, 52, 50, 58] },
  { symbol: "AI", points: [28, 30, 35, 33, 42, 45, 43, 51, 56] },
  { symbol: "GRID", points: [38, 36, 40, 42, 41, 45, 48, 47, 51] },
] as const;

export function SocialContextRail() {
  const pathname = usePathname();
  const { state, toggleFollow } = useDemoState();
  const { t } = useLocale();
  const legal = pathname === "/privacy" || pathname === "/terms" || pathname === "/support";

  return (
    <aside className="social-right-rail" aria-label={t("common.topics")}>
      <section className="social-rail-section" aria-labelledby="social-market-pulse">
        <div className="social-rail-heading">
          <h2 id="social-market-pulse">{t("home.pulse")}</h2>
          <span>{t("brand.demo")}</span>
        </div>
        <div className="social-market-list">
          {pulse.map((item) => (
            <div className="social-market-row" key={item.symbol}>
              <strong>{item.symbol}</strong>
              <span>{t("common.previewOnly")}</span>
              <MarketSparkline
                compact
                label={`${item.symbol}: ${t("demo.market")}`}
                points={item.points}
              />
            </div>
          ))}
        </div>
        <p className="social-rail-note">{t("demo.market")}</p>
      </section>

      {!legal && (
        <section className="social-rail-section" aria-labelledby="social-analysts-title">
          <div className="social-rail-heading">
            <h2 id="social-analysts-title">{t("common.analysts")}</h2>
            <span>{t("common.localOnly")}</span>
          </div>
          <div className="social-follow-list">
            {demoAnalysts.map((analyst) => {
              const selected = state.followedAnalystIds.includes(analyst.id);
              return (
                <div className="social-follow-row" key={analyst.id}>
                  <SocialAvatar initials={analyst.initials} size="small" label={analyst.name} />
                  <span>
                    <Link href={`/analysts/${analyst.slug}`}>{analyst.name}</Link>
                    <small>{analyst.handle}</small>
                  </span>
                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${selected ? t("common.unfollow") : t("common.follow")} ${analyst.name}`}
                    onClick={() => toggleFollow(analyst.id)}
                  >
                    {!selected && <SocialIcon name="follow" />}
                    <span className="social-follow-label">
                      {selected ? t("common.unfollow") : t("common.follow")}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="social-rail-section" aria-labelledby="social-trending-title">
        <div className="social-rail-heading">
          <h2 id="social-trending-title">{t("explore.trending")}</h2>
          <span>{t("brand.demo")}</span>
        </div>
        <ol className="social-trending-list">
          {demoTopics.map((topic, index) => (
            <li key={topic.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>#{topic.label.replaceAll(" ", "")}</strong>
                <small>{topic.context}</small>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {!legal && (
        <section className="social-rail-section" aria-labelledby="social-hot-research">
          <div className="social-rail-heading">
            <h2 id="social-hot-research">{t("home.featured")}</h2>
            <span>{t("common.previewOnly")}</span>
          </div>
          <ol className="social-hot-research">
            {demoResearchCards.slice(0, 3).map((research, index) => (
              <li key={research.id}>
                <span>{index + 1}</span>
                <div>
                  <Link href={`/research/${research.slug}`}>{research.title}</Link>
                  <small>{t(`category.${research.category}`)}</small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="social-rail-disclaimer">{t("demo.global")}</p>
    </aside>
  );
}
