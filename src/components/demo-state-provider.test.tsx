import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { getDictionary } from "@/modules/i18n";

import {
  DEMO_STATE_STORAGE_KEY,
  DemoStateProvider,
  parseStoredDemoState,
  useDemoState,
} from "./demo-state-provider";
import { LocaleProvider } from "./locale-provider";

function StateHarness() {
  const { state, toggleLike } = useDemoState();
  const active = state.likedPostIds.includes("post_capacity_signals");
  return <button type="button" aria-pressed={active} onClick={() => toggleLike("post_capacity_signals")}>{String(active)}</button>;
}

describe("browser-local demo state", () => {
  beforeEach(() => window.localStorage.clear());

  it("fails malformed storage safely to an empty versioned state", () => {
    expect(parseStoredDemoState("not-json").likedPostIds).toEqual([]);
    expect(parseStoredDemoState(JSON.stringify({ version: 99 })).version).toBe(1);
    expect(parseStoredDemoState(JSON.stringify({
      version: 1,
      likedPostIds: [42],
      bookmarkedItemIds: [],
      followedAnalystIds: [],
      dismissedNotificationIds: [],
    })).likedPostIds).toEqual([]);
  });

  it("restores valid state from the versioned localStorage key", async () => {
    window.localStorage.setItem(DEMO_STATE_STORAGE_KEY, JSON.stringify({
      version: 1,
      likedPostIds: ["post_capacity_signals"],
      bookmarkedItemIds: [],
      followedAnalystIds: [],
      dismissedNotificationIds: [],
    }));
    render(<DemoStateProvider><StateHarness /></DemoStateProvider>);
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("true"));
  });

  it("survives an interface-locale rerender using invariant state IDs", async () => {
    const view = render(
      <LocaleProvider dictionary={getDictionary("en")} locale="en">
        <DemoStateProvider><StateHarness /></DemoStateProvider>
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("true"));

    view.rerender(
      <LocaleProvider dictionary={getDictionary("tr")} locale="tr">
        <DemoStateProvider><StateHarness /></DemoStateProvider>
      </LocaleProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("true");
    expect(window.localStorage.getItem(DEMO_STATE_STORAGE_KEY)).toContain("post_capacity_signals");
  });
});
