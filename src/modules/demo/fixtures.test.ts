import { describe, expect, it } from "vitest";

import {
  demoAnalysts,
  demoInsightPosts,
  demoResearchCards,
  getAnalystBySlug,
  getDemoContent,
  getResearchBySlug,
} from "./fixtures";

describe("public fictional fixtures", () => {
  it("keeps authored content identical across interface locales", () => {
    expect(getDemoContent("en")).toEqual(getDemoContent("tr"));
  });

  it("uses stable unique invariant IDs", () => {
    const ids = [
      ...demoAnalysts.map((item) => item.id),
      ...demoInsightPosts.map((item) => item.id),
      ...demoResearchCards.map((item) => item.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z][a-z0-9_]+$/.test(id))).toBe(true);
  });

  it("contains no real-looking wallet address", () => {
    expect(JSON.stringify(getDemoContent("en"))).not.toMatch(/0x[a-fA-F0-9]{40}/);
  });

  it("contains no live-price or percentage-return notation", () => {
    const authored = JSON.stringify(getDemoContent("en"));
    expect(authored).not.toMatch(/\$\s?\d/);
    expect(authored).not.toMatch(/[+-]?\d+(?:\.\d+)?%/);
  });

  it("marks every fixture as fictional and demo handles as non-production", () => {
    expect(demoAnalysts.every((item) => item.fictional && item.handle.endsWith(".demo"))).toBe(true);
    expect(demoInsightPosts.every((item) => item.fictional)).toBe(true);
    expect(demoResearchCards.every((item) => item.fictional)).toBe(true);
  });

  it("stores no hidden body in the preview-only card", () => {
    const preview = demoResearchCards.find((item) => item.previewOnly);
    const forbiddenField = ["premium", "Body"].join("");
    expect(preview?.publicSections).toEqual([]);
    expect(preview && Object.keys(preview)).not.toContain(forbiddenField);
  });

  it("resolves only approved analyst and research slugs", () => {
    expect(getResearchBySlug("ai-capacity-cycle-map")?.id).toBe("research_ai_capacity");
    expect(getAnalystBySlug("maya-north")?.id).toBe("analyst_maya_north");
    expect(getResearchBySlug("unknown-card")).toBeUndefined();
    expect(getAnalystBySlug("unknown-analyst")).toBeUndefined();
  });
});
