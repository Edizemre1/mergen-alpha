import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { getDictionary } from "../src/modules/i18n/dictionaries";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(resolve(root, path), "utf8");
}

describe("Stage 1 public application contract", () => {
  it("implements every required public and legal route", () => {
    const routes = [
      "src/app/page.tsx",
      "src/app/explore/page.tsx",
      "src/app/research/page.tsx",
      "src/app/research/[slug]/page.tsx",
      "src/app/analysts/[slug]/page.tsx",
      "src/app/bookmarks/page.tsx",
      "src/app/notifications/page.tsx",
      "src/app/profile/page.tsx",
      "src/app/privacy/page.tsx",
      "src/app/terms/page.tsx",
      "src/app/support/page.tsx",
    ];
    expect(routes.every((route) => existsSync(resolve(root, route)))).toBe(true);
  });

  it("has no API, Creator, auth, database, or health route", () => {
    for (const path of ["src/app/api", "src/app/creator", "src/app/auth", "src/app/health", "src/modules/database"] ) {
      expect(existsSync(resolve(root, path))).toBe(false);
    }
  });

  it("owns the first-response html language on the server", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("const locale = await getRequestLocale()");
    expect(layout).toContain("<html lang={locale}>");
    expect(layout).toContain("<AppProviders dictionary={dictionary} locale={locale}>");
  });

  it("does not read browser language or mutate html lang", () => {
    const switcher = read("src/components/language-switcher.tsx");
    const provider = read("src/components/locale-provider.tsx");
    expect(`${switcher}\n${provider}`).not.toContain("navigator.language");
    expect(`${switcher}\n${provider}`).not.toContain("document.documentElement.lang");
    expect(switcher).toContain("router.refresh()");
  });

  it("renders one localized semantic not-found heading and keeps its recovery link", () => {
    const notFound = read("src/app/not-found.tsx");

    expect(notFound.match(/<h1\b/g)).toHaveLength(1);
    expect(notFound).toContain('<h1>{d["notFound.message"]}</h1>');
    expect(notFound).toContain(
      '<Link className="button-link primary" href="/">{d["notFound.returnHome"]}</Link>',
    );
    expect(getDictionary("en")["notFound.message"]).toBe("This demo page could not be found.");
    expect(getDictionary("tr")["notFound.message"]).toBe("Bu demo sayfası bulunamadı.");
  });

  it("enforces the canonical three-column and mobile-shell contracts", () => {
    const css = read("src/app/globals.css");
    expect(css).toContain("grid-template-columns: 240px minmax(0, 1fr) 308px");
    expect(css).toContain("width: min(calc(100% - 24px), 1344px)");
    expect(css).toContain("@media (max-width: 780px)");
    expect(css).toContain(".social-mobile-nav");
    expect(css).toContain("grid-template-columns: repeat(5, 1fr)");
    expect(css).not.toMatch(/(?:html|body)\s*\{[^}]*min-width:\s*320px/s);
    expect(css).not.toMatch(/body\s*\{[^}]*overflow-x:\s*hidden/s);
  });

  it("keeps every compact mobile control at least 44px", () => {
    const css = read("src/app/globals.css");
    for (const selector of [
      ".language-option",
      ".social-filter-tabs button",
      ".social-topic-filters button",
      ".social-actions button",
      ".social-mobile-nav-link",
      ".social-bookmark-actions button",
      ".social-notification-row > button",
      ".social-back-link",
      ".social-mobile-topbar > .social-brand",
      ".social-avatar-link",
      ".social-feed-search",
      ".social-section-header > a",
      ".social-mini-research-card footer a",
    ]) {
      expect(css).toContain(selector);
    }
    expect(css).toMatch(/\.social-mobile-topbar > \.social-brand,[\s\S]*?min-width:\s*44px;[\s\S]*?min-height:\s*44px;/);
    expect(css).toMatch(/\.social-feed-search\s*\{\s*min-height:\s*44px;\s*\}/);
    expect(css).toMatch(/@media \(max-width: 360px\)[\s\S]*?\.social-actions\s*\{\s*margin-inline:\s*7px;\s*\}/);
  });

  it("uses the approved social shell instead of the obsolete generic page header", () => {
    const chrome = read("src/components/app-chrome.tsx");
    const routes = [
      "src/app/page.tsx",
      "src/app/explore/page.tsx",
      "src/app/research/page.tsx",
      "src/app/bookmarks/page.tsx",
      "src/app/notifications/page.tsx",
      "src/app/profile/page.tsx",
    ].map(read).join("\n");
    expect(chrome).toContain('className="social-app-frame"');
    expect(chrome).toContain("<SocialContextRail />");
    expect(chrome).toContain('className="social-mobile-nav"');
    expect(routes).not.toContain("PageHeader");
  });

  it("keeps the composer and wallet presentation accurately non-operational", () => {
    const chrome = read("src/components/app-chrome.tsx");
    const home = read("src/components/home-feed.tsx");
    expect(chrome).toContain("social-compose-button");
    expect(chrome).toContain("disabled title={t(\"home.composerDisabled\")}");
    expect(home).toContain("social-disabled-composer");
    expect(home).toContain("textarea");
    expect(home).toContain("disabled");
    expect(chrome).toContain('t("wallet.soon")');
    const forbiddenCalls = [
      "connect(",
      ["send", "Transaction"].join(""),
      ["write", "Contract"].join(""),
      "fetch(",
    ];
    expect(forbiddenCalls.every((call) => !`${chrome}\n${home}`.includes(call))).toBe(true);
  });

  it("keeps local state keys locale-independent", () => {
    const state = read("src/components/demo-state-provider.tsx");
    expect(state).toContain('"mergen-public-demo:v1"');
    expect(state).not.toContain("TranslationKey");
    expect(state).not.toContain("dictionary");
  });

  it("does not claim completed Base registration or attribution", () => {
    const metadata = `${read("src/modules/i18n/dictionaries.ts")}\n${read("src/modules/i18n/metadata.ts")}`;
    expect(metadata).not.toMatch(/registered on Base\.dev|registration complete|Builder Code (?:enabled|active|integrated)/i);
  });

  it("keeps the runtime dependency surface static and minimal", () => {
    const manifest = JSON.parse(read("package.json")) as { dependencies: Record<string, string> };
    expect(Object.keys(manifest.dependencies).sort()).toEqual(["next", "react", "react-dom"]);
  });

  it("uses only local social-preview metadata", () => {
    const metadata = read("src/modules/i18n/metadata.ts");
    expect(metadata).toContain('url: "/og.png"');
    expect(metadata).not.toMatch(/https?:\/\//);
  });
});
