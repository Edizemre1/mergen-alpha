import { describe, expect, it } from "vitest";

import { formatUtcDate, interpolate } from "./format";

describe("localized formatting", () => {
  it("pins date formatting to UTC", () => {
    const value = "2026-07-28T23:30:00-07:00";
    expect(formatUtcDate(value, "en")).toBe("Jul 29, 2026");
    expect(formatUtcDate(value, "tr")).toBe("29 Tem 2026");
  });

  it("interpolates known values without deleting unknown placeholders", () => {
    expect(interpolate("{count} items for {name} and {unknown}", { count: 2, name: "Demo" }))
      .toBe("2 items for Demo and {unknown}");
  });
});
