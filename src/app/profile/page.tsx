import type { Metadata } from "next";

import { ProfileView } from "@/components/profile-view";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), {
    canonicalPath: "/profile",
    titleKey: "profile.title",
    descriptionKey: "profile.description",
  });
}

export default function ProfilePage() {
  return <ProfileView />;
}
