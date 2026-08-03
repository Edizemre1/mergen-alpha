import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/modules/i18n";

import { AppChrome } from "./app-chrome";
import { AppProviders } from "./app-providers";
import { ExploreDirectory } from "./explore-directory";
import { HomeFeed } from "./home-feed";
import { ProfileView } from "./profile-view";
import { ResearchDirectory } from "./research-directory";

let pathname = "/";
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ refresh }),
}));

function renderPage(child: React.ReactNode, locale: "en" | "tr" = "en") {
  return render(
    <AppProviders dictionary={getDictionary(locale)} locale={locale}>
      <AppChrome>{child}</AppChrome>
    </AppProviders>,
  );
}

describe("approved public social redesign", () => {
  beforeEach(() => {
    pathname = "/";
    refresh.mockClear();
    window.localStorage.clear();
  });

  it("renders desktop sidebar, context rail, mobile navigation, and active route states", () => {
    const { container } = renderPage(<HomeFeed />);
    expect(container.querySelector(".social-app-frame")).toBeInTheDocument();
    expect(container.querySelector(".social-sidebar")).toBeInTheDocument();
    expect(container.querySelector(".social-right-rail")).toBeInTheDocument();
    expect(container.querySelector(".social-mobile-nav")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" }).filter((item) => item.getAttribute("aria-current") === "page")).toHaveLength(2);
  });

  it("keeps composer and create controls disabled and accurately labeled", () => {
    renderPage(<HomeFeed />);
    expect(screen.getByPlaceholderText("Creator publishing is not available in the public demo.")).toBeDisabled();
    expect(screen.getAllByRole("button", { name: "Disabled in Stage 1" }).every((button) => button.hasAttribute("disabled"))).toBe(true);
  });

  it("renders insight and Research Card hierarchy with browser-local actions", () => {
    renderPage(<HomeFeed />);
    expect(screen.getByText("Illustrative thesis note: capacity commitments may be more useful than headline demand when testing the durability of an AI infrastructure cycle. The scenario remains sensitive to lead times and customer concentration.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mapping an Illustrative AI Capacity Cycle" })).toBeInTheDocument();
    const like = screen.getAllByRole("button", { name: "Like" })[0];
    fireEvent.click(like);
    expect(like).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps authored content invariant under Turkish interface localization", () => {
    renderPage(<HomeFeed />, "tr");
    expect(screen.getAllByText("Sana Özel").length).toBeGreaterThan(0);
    expect(screen.getByText("Illustrative thesis note: capacity commitments may be more useful than headline demand when testing the durability of an AI infrastructure cycle. The scenario remains sensitive to lead times and customer concentration.")).toBeInTheDocument();
  });

  it("supports local Explore search and follow state", () => {
    pathname = "/explore";
    renderPage(<ExploreDirectory />);
    const follow = screen.getByRole("button", { name: "Follow Maya North" });
    fireEvent.click(follow);
    expect(follow).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getAllByRole("searchbox").at(-1)!, { target: { value: "macro" } });
    expect(screen.getAllByText("Arin Vale").length).toBeGreaterThan(0);
  });

  it("renders bounded Research filters and static public-safe detail links", () => {
    pathname = "/research";
    renderPage(<ResearchDirectory />);
    expect(screen.getByRole("heading", { name: "Research Cards" })).toBeInTheDocument();
    const previewTab = screen.getByRole("tab", { name: "Preview only" });
    fireEvent.click(previewTab);
    const resultPanel = screen.getByRole("tabpanel");
    expect(within(resultPanel).getAllByRole("article").length).toBeGreaterThan(0);
    expect(within(resultPanel).getAllByRole("link", { name: "Read research" }).length).toBeGreaterThan(0);
  });

  it("renders the canonical fictional profile cover and browser-local counters", () => {
    pathname = "/profile";
    const { container } = renderPage(<ProfileView />);
    expect(container.querySelector(".social-profile-cover")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Maya North/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Demo biography" })).toBeInTheDocument();
  });
});
