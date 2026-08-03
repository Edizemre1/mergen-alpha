import Link from "next/link";

import { getDictionary, getRequestLocale } from "@/modules/i18n/server";

export default async function NotFound() {
  const d = getDictionary(await getRequestLocale());
  return (
    <div className="empty-state not-found">
      <h1>{d["notFound.message"]}</h1>
      <Link className="button-link primary" href="/">{d["notFound.returnHome"]}</Link>
    </div>
  );
}
