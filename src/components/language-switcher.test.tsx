import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/modules/i18n";

import { LanguageSwitcher } from "./language-switcher";
import { LocaleProvider } from "./locale-provider";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    refresh.mockClear();
    document.cookie = "mergen-locale=; Max-Age=0; Path=/";
    document.documentElement.lang = "en";
  });

  it("writes only the validated locale cookie and requests a framework refresh", () => {
    render(
      <LocaleProvider dictionary={getDictionary("en")} locale="en">
        <LanguageSwitcher />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch to Turkish" }));
    expect(document.cookie).toContain("mergen-locale=tr");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the document language directly", () => {
    render(
      <LocaleProvider dictionary={getDictionary("en")} locale="en">
        <LanguageSwitcher />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Switch to Turkish" }));
    expect(document.documentElement.lang).toBe("en");
  });

  it("announces the accurate target language accessibly", () => {
    render(
      <LocaleProvider dictionary={getDictionary("en")} locale="en">
        <LanguageSwitcher />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Switch to Turkish" }));
    expect(screen.getByRole("status")).toHaveTextContent("Interface language changed to Turkish.");
  });

  it("does not refresh when the already active locale is selected", () => {
    render(
      <LocaleProvider dictionary={getDictionary("en")} locale="en">
        <LanguageSwitcher />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(refresh).not.toHaveBeenCalled();
  });
});
