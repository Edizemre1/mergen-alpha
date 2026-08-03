import type { Metadata } from "next";

import { NotificationsView } from "@/components/notifications-view";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), "notifications.title", "notifications.description");
}

export default function NotificationsPage() {
  return <NotificationsView />;
}
