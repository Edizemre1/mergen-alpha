import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { validatePublicBoundary } from "../scripts/public-boundary-core.mjs";

const roots: string[] = [];

function fixture(): string {
  const root = mkdtempSync(resolve(tmpdir(), "mergen-public-boundary-"));
  roots.push(root);
  writeFileSync(resolve(root, "package.json"), JSON.stringify({ dependencies: {} }));
  return root;
}

function put(root: string, path: string, content: string): void {
  const destination = resolve(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content);
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("public boundary validator", () => {
  it("accepts a minimal static public fixture", () => {
    const root = fixture();
    put(root, "src/app/page.tsx", "export default function Page() { return null; }");
    expect(validatePublicBoundary(root)).toEqual([]);
  });

  it("rejects API route handlers", () => {
    const root = fixture();
    put(root, "src/app/api/demo/route.ts", "export function GET() { return new Response(); }");
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("forbidden-path");
  });

  it("rejects relative imports escaping the repository", () => {
    const root = fixture();
    const outsideImport = ["..", "..", "..", "outside"].join("/");
    put(root, "src/page.ts", `import value from "${outsideImport}"; export { value };`);
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("outside-import");
  });

  it("rejects high-confidence assigned wallet-key material", () => {
    const root = fixture();
    const name = ["private", "key"].join("_");
    put(root, "src/config.ts", `export const ${name} = "${"a".repeat(64)}";`);
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("secret-pattern");
  });

  it("rejects remote assets in application source", () => {
    const root = fixture();
    const remote = ["https:", "", "cdn.invalid", "image.png"].join("/");
    put(root, "src/image.ts", `export const image = "${remote}";`);
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("remote-asset-or-url");
  });

  it("allows only the approved canonical origin in the metadata helper", () => {
    const root = fixture();
    put(
      root,
      "src/modules/i18n/metadata.ts",
      'export const metadataBase = new URL("https://alpha.mergen.finance");',
    );
    expect(validatePublicBoundary(root)).toEqual([]);
  });

  it("continues rejecting other URLs beside the approved canonical origin", () => {
    const root = fixture();
    put(
      root,
      "src/modules/i18n/metadata.ts",
      [
        'export const metadataBase = new URL("https://alpha.mergen.finance");',
        'export const remoteImage = "https://cdn.invalid/image.png";',
      ].join("\n"),
    );
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("remote-asset-or-url");
  });

  it("rejects wallet transaction code", () => {
    const root = fixture();
    const operation = ["write", "Contract"].join("");
    put(root, "src/action.ts", `export const action = ${operation};`);
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("wallet-transaction");
  });

  it("rejects forbidden runtime dependencies", () => {
    const root = fixture();
    writeFileSync(resolve(root, "package.json"), JSON.stringify({ dependencies: { siwe: "1.0.0" } }));
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("forbidden-dependency");
  });

  it("rejects representative private redesign imports", () => {
    const root = fixture();
    const authImport = ["@", "components", ["auth", "provider"].join("-")].join("/");
    const databaseImport = ["@", "modules", "database", "profile"].join("/");
    put(root, "src/components/shell.tsx", `import { useAuth } from "${authImport}"; export { useAuth };`);
    put(root, "src/components/profile.tsx", `import value from "${databaseImport}"; export { value };`);
    const findings = validatePublicBoundary(root);
    expect(findings.filter((item) => item.rule === "private-import")).toHaveLength(2);
  });

  it("rejects unexpected binaries", () => {
    const root = fixture();
    put(root, "public/unreviewed.bin", "\u0000\u0001\u0002");
    expect(validatePublicBoundary(root).map((item) => item.rule)).toContain("unexpected-binary");
  });
});
