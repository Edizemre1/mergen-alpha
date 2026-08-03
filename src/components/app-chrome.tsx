"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { TranslationKey } from "@/modules/i18n";

import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "./locale-provider";
import { SocialAvatar } from "./social-avatar";
import { SocialBrand } from "./social-brand";
import { SocialContextRail } from "./social-context-rail";
import { SocialIcon, type SocialIconName } from "./social-icon";

interface NavigationItem {
  readonly href: string;
  readonly key: TranslationKey;
  readonly icon: SocialIconName;
  readonly exact?: boolean;
  readonly mobile?: boolean;
}

const navigation: readonly NavigationItem[] = [
  { href: "/", key: "nav.home", icon: "home", exact: true },
  { href: "/explore", key: "nav.explore", icon: "explore" },
  { href: "/research", key: "nav.research", icon: "research", mobile: false },
  { href: "/notifications", key: "nav.notifications", icon: "notifications" },
  { href: "/bookmarks", key: "nav.bookmarks", icon: "bookmarks", mobile: false },
  { href: "/profile", key: "nav.profile", icon: "profile" },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (href === "/explore" && pathname.startsWith("/analysts/")) return true;
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function pageKey(pathname: string): TranslationKey {
  if (pathname.startsWith("/explore") || pathname.startsWith("/analysts/")) return "nav.explore";
  if (pathname.startsWith("/research")) return "nav.research";
  if (pathname.startsWith("/notifications")) return "nav.notifications";
  if (pathname.startsWith("/bookmarks")) return "nav.bookmarks";
  if (pathname.startsWith("/profile")) return "nav.profile";
  if (pathname.startsWith("/privacy")) return "footer.privacy";
  if (pathname.startsWith("/terms")) return "footer.terms";
  if (pathname.startsWith("/support")) return "footer.support";
  return "nav.home";
}

function NavigationLinks({ mobile = false }: { readonly mobile?: boolean }) {
  const pathname = usePathname();
  const { t } = useLocale();
  return navigation
    .filter((item) => !mobile || item.mobile !== false)
    .map((item) => {
      const active = isActive(pathname, item.href, item.exact);
      return (
        <Link
          className={mobile ? "social-mobile-nav-link" : "social-side-nav-link"}
          data-active={active}
          href={item.href}
          key={item.href}
          aria-current={active ? "page" : undefined}
        >
          <SocialIcon name={item.icon} />
          <span>{t(item.key)}</span>
          {item.href === "/notifications" && !mobile ? <strong>Demo</strong> : null}
        </Link>
      );
    });
}

export function AppChrome({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLocale();
  const currentPage = t(pageKey(pathname));

  return (
    <div className="social-route-root">
      <a className="skip-link" href="#main-content">{t("common.open")} {currentPage}</a>
      <div className="social-app-frame">
        <aside className="social-sidebar" aria-label={t("nav.primary")}>
          <div className="social-sidebar-top">
            <SocialBrand />
            <span className="social-demo-tag">{t("brand.demo")}</span>
          </div>
          <nav className="social-sidebar-nav" aria-label={t("nav.primary")}>
            <NavigationLinks />
          </nav>
          <div className="social-sidebar-bottom">
            <LanguageSwitcher />
            <div className="social-network-status">
              <span className="social-status-dot" aria-hidden="true" />
              <span>
                <strong>Base Sepolia</strong>
                <small>{t("wallet.inactive")}</small>
              </span>
              <SocialIcon name="network" />
            </div>
            <Link className="social-account" href="/profile">
              <SocialAvatar initials="MA" size="small" label={t("profile.title")} />
              <span>
                <strong>{t("wallet.soon")}</strong>
                <small>{t("common.localOnly")}</small>
              </span>
              <SocialIcon name="profile" />
            </Link>
            <nav className="social-legal-links" aria-label={t("nav.footer")}>
              <Link href="/privacy">{t("footer.privacy")}</Link>
              <Link href="/terms">{t("footer.terms")}</Link>
              <Link href="/support">{t("footer.support")}</Link>
            </nav>
          </div>
        </aside>

        <main id="main-content" className="social-feed-column" tabIndex={-1}>
          <header className="social-mobile-topbar">
            <SocialBrand />
            <div>
              <LanguageSwitcher />
              <Link href="/explore" aria-label={t("common.search")}>
                <SocialIcon name="search" />
              </Link>
              <Link href="/profile" aria-label={t("nav.profile")}>
                <SocialAvatar initials="MA" size="small" />
              </Link>
            </div>
          </header>

          <header className="social-topbar">
            <div className="social-page-title">
              <span>Mergen Alpha</span>
              <strong>{currentPage}</strong>
            </div>
            <form className="social-search-field" action="/explore" role="search">
              <SocialIcon name="search" />
              <label className="sr-only" htmlFor="social-global-search">{t("common.search")}</label>
              <input id="social-global-search" name="q" type="search" placeholder={t("common.searchPlaceholder")} />
            </form>
            <Link className="social-alert-button" href="/notifications" aria-label={t("nav.notifications")}>
              <SocialIcon name="notifications" />
              <span aria-hidden="true" />
            </Link>
            <button className="social-compose-button" type="button" disabled title={t("home.composerDisabled")}>
              <SocialIcon name="compose" />
              <span>{t("home.composerDisabled")}</span>
            </button>
          </header>

          <div className="social-prototype-notice" role="note">
            <strong>{t("brand.demo")}</strong>
            <span>{t("demo.global")}</span>
          </div>
          {children}
        </main>

        <SocialContextRail />
      </div>

      <nav className="social-mobile-nav" aria-label={t("nav.mobile")}>
        <NavigationLinks mobile />
        <button type="button" className="social-mobile-create" disabled aria-label={t("home.composerDisabled")}>
          <SocialIcon name="compose" />
          <span>{t("home.composerDisabled")}</span>
        </button>
      </nav>
    </div>
  );
}
