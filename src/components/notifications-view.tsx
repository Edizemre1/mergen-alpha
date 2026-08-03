"use client";

import { useState } from "react";

import { demoNotifications } from "@/modules/demo";
import { formatUtcDate } from "@/modules/i18n";

import { useDemoState } from "./demo-state-provider";
import { useLocale } from "./locale-provider";
import { SocialAvatar } from "./social-avatar";
import { SocialFilterTabs } from "./social-filter-tabs";
import { SocialIcon } from "./social-icon";

type NotificationFilter = "all" | "research" | "activity";
const filters = ["all", "research", "activity"] as const satisfies readonly NotificationFilter[];

export function NotificationsView() {
  const { state, dismissNotification } = useDemoState();
  const { locale, t } = useLocale();
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [announcement, setAnnouncement] = useState("");
  const visible = demoNotifications.filter((item, index) => !state.dismissedNotificationIds.includes(item.id) && (filter === "all" || (filter === "research" ? index < 2 : index >= 2)));
  const label = (item: NotificationFilter) => ({ all: t("common.all"), research: t("common.research"), activity: t("notifications.eyebrow") })[item];

  function dismiss(id: string) {
    dismissNotification(id);
    setAnnouncement(t("common.dismissed"));
  }

  return (
    <div className="social-page-section">
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      <header className="social-page-header">
        <div className="social-page-heading"><span className="social-page-eyebrow">{t("notifications.eyebrow")}</span><h1>{t("notifications.title")}</h1><p>{t("notifications.description")}</p></div>
        <span className="social-boundary-pill">{visible.length} {t("brand.demo")}</span>
      </header>
      <div className="social-activity-summary"><SocialFilterTabs ariaLabel={t("notifications.title")} controlsId="notification-results" idPrefix="notification-filter" items={filters} label={label} onChange={setFilter} value={filter} variant="pills" /><span>{t("common.localOnly")}</span></div>
      <section id="notification-results" role="tabpanel" aria-labelledby={`notification-filter-${filters.indexOf(filter)}`} className="social-notification-list">
        {visible.map((notification, index) => (
          <article className={`social-notification-row${index < 2 ? " is-unread" : ""}`} key={notification.id}>
            <SocialAvatar initials={index % 2 ? "AV" : "MN"} size="small" />
            <div className="social-notification-body"><h2>{notification.title}</h2><p>{notification.detail}</p><time dateTime={notification.createdAt}>{formatUtcDate(notification.createdAt, locale)}</time></div>
            <button type="button" aria-label={`${t("common.dismiss")}: ${notification.title}`} onClick={() => dismiss(notification.id)}><SocialIcon name="close" /><span>{t("common.dismiss")}</span></button>
          </article>
        ))}
        {visible.length === 0 && <div className="social-empty-state"><SocialIcon name="notifications" /><h2>{t("notifications.empty")}</h2><button type="button" onClick={() => setFilter("all")}>{t("common.all")}</button></div>}
      </section>
    </div>
  );
}
