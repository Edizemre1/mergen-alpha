import { describe, expect, it } from "vitest";

import {
  localeFromAcceptLanguage,
  resolveAppLocale,
  serializeLocaleCookie,
} from "./locales";

describe("server locale resolution", () => {
  it("gives a valid cookie precedence over Accept-Language", () => {
    expect(resolveAppLocale("en", "tr-TR,tr;q=0.9")).toBe("en");
    expect(resolveAppLocale("tr", "en-US,en;q=0.9")).toBe("tr");
  });

  it("maps tr and uppercase TR subtag ranges to Turkish", () => {
    expect(localeFromAcceptLanguage("tr")).toBe("tr");
    expect(localeFromAcceptLanguage("TR-CY")).toBe("tr");
  });

  it("rejects q=0 ranges", () => {
    expect(localeFromAcceptLanguage("tr;q=0,en;q=0.4")).toBe("en");
  });

  it("preserves source ordering for equal-quality supported ranges", () => {
    expect(localeFromAcceptLanguage("tr;q=0.8,en;q=0.8")).toBe("tr");
    expect(localeFromAcceptLanguage("en;q=0.8,tr;q=0.8")).toBe("en");
  });

  it("maps wildcard to the English fallback", () => {
    expect(localeFromAcceptLanguage("*")).toBe("en");
    expect(localeFromAcceptLanguage("de;q=0.9,*;q=0.8,tr;q=0.7")).toBe("en");
  });

  it("uses a valid header when the cookie is invalid", () => {
    expect(resolveAppLocale("TR", "tr-TR")).toBe("tr");
    expect(resolveAppLocale("unsupported", "en-GB")).toBe("en");
  });

  it("fails oversized headers and excessive range counts closed to English", () => {
    expect(localeFromAcceptLanguage(`tr,${"x".repeat(513)}`)).toBe("en");
    expect(localeFromAcceptLanguage(Array.from({ length: 21 }, () => "tr").join(","))).toBe("en");
  });

  it("falls back to English for absent, malformed, or unsupported input", () => {
    expect(localeFromAcceptLanguage(null)).toBe("en");
    expect(localeFromAcceptLanguage("tr;q=bogus")).toBe("en");
    expect(localeFromAcceptLanguage("de-DE,fr-FR;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage("tr;q=0.1234")).toBe("en");
  });

  it("serializes a constrained locale cookie", () => {
    expect(serializeLocaleCookie("tr", false)).toContain("mergen-locale=tr; Path=/;");
    expect(serializeLocaleCookie("tr", false)).toContain("SameSite=Lax");
    expect(serializeLocaleCookie("tr", false)).not.toContain("Secure");
    expect(serializeLocaleCookie("en", true)).toContain("; Secure");
  });
});
