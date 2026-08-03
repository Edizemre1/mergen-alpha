import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { getDictionary } from "@/modules/i18n";

import { DemoStateProvider } from "./demo-state-provider";
import { LocaleProvider } from "./locale-provider";
import { NotificationsView } from "./notifications-view";

describe("NotificationsView", () => {
  beforeEach(() => window.localStorage.clear());

  it("announces a dismissed notification without translating authored content", () => {
    render(
      <LocaleProvider dictionary={getDictionary("en")} locale="en">
        <DemoStateProvider>
          <NotificationsView />
        </DemoStateProvider>
      </LocaleProvider>,
    );

    const heading = screen.getByRole("heading", {
      name: "A fictional Research Card revision is available",
    });
    const notification = heading.closest("article");
    expect(notification).not.toBeNull();

    fireEvent.click(within(notification!).getByRole("button", {
      name: "Dismiss: A fictional Research Card revision is available",
    }));

    expect(screen.queryByRole("heading", {
      name: "A fictional Research Card revision is available",
    })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Notification dismissed.");
  });
});
