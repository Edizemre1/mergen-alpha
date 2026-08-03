import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const ignoredDirectories = new Set([".git", ".next", "coverage", "node_modules"]);
const ignoredFileSuffixes = [".tsbuildinfo"];
const textExtensions = new Set([
  "",
  ".css",
  ".gitignore",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".mts",
  ".nvmrc",
  ".ts",
  ".tsx",
  ".txt",
]);
const allowedBinaryAssets = new Map([
  [
    "public/og.png",
    {
      bytes: 1_828_793,
      sha256: "6d10ee2f6c40861a7ed566f0cf07102d7938ffdabb058a716eb5efc2681a4083",
    },
  ],
]);
const explanatoryPrivateCoreReferences = new Set([
  "AGENTS.md",
  "README.md",
  "docs/PUBLIC_BOUNDARY.md",
  "scripts/public-boundary-core.mjs",
  "tests/boundary-validator.test.ts",
]);

function slash(value) {
  return value.split(sep).join("/");
}

function walk(root, directory = root) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }
    if (entry.isFile() && ignoredFileSuffixes.some((suffix) => entry.name.endsWith(suffix))) {
      continue;
    }
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(root, absolute));
    } else if (entry.isFile()) {
      files.push({ absolute, relative: slash(relative(root, absolute)) });
    } else {
      files.push({ absolute, relative: slash(relative(root, absolute)), special: true });
    }
  }
  return files;
}

function add(findings, file, rule, detail) {
  findings.push({ file, rule, detail });
}

function isTextFile(file, buffer) {
  const extension = extname(file).toLowerCase();
  return textExtensions.has(extension) && !buffer.includes(0);
}

function checkForbiddenPath(findings, file) {
  const lower = file.toLowerCase();
  const segments = lower.split("/");

  if (lower.startsWith("src/app/api/") || lower === "src/app/api") {
    add(findings, file, "forbidden-path", "API route directory is not allowed.");
  }
  if (/^src\/app\/.+\/route\.[cm]?[jt]sx?$/.test(lower) || /^src\/app\/route\.[cm]?[jt]sx?$/.test(lower)) {
    add(findings, file, "route-handler", "Route handlers are not allowed in Stage 1.");
  }
  if (segments.some((segment) => ["auth", "authentication", "creator", "creator-studio", "database", "db", "deploy", "deployment", "migrations", "private-runtime", "wallet"].includes(segment))) {
    add(findings, file, "private-module-path", "Private runtime or operational module path is not allowed.");
  }
  if (lower.startsWith(".github/workflows/") || lower.startsWith("deploy/") || lower.startsWith("docker/")) {
    add(findings, file, "operations-path", "CI or deployment material is not allowed.");
  }
  if (/(^|\/)(?:docker-)?compose(?:\.[^.]+)?\.ya?ml$/.test(lower) || /(^|\/)dockerfile(?:\.|$)/.test(lower)) {
    add(findings, file, "container-file", "Docker and Compose files are not allowed.");
  }
  if (/(^|\/)\.env(?:\.|$)/.test(lower)) {
    add(findings, file, "environment-file", "Environment files are not allowed.");
  }
  if (lower.includes("farcaster.json") || lower.includes("farcaster-manifest")) {
    add(findings, file, "farcaster-manifest", "Obsolete Farcaster manifests are not allowed.");
  }
}

function checkPackage(findings, root) {
  const packagePath = resolve(root, "package.json");
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(packagePath, "utf8"));
  } catch {
    add(findings, "package.json", "package-manifest", "A readable package.json is required.");
    return;
  }

  const dependencies = { ...(manifest.dependencies ?? {}), ...(manifest.devDependencies ?? {}) };
  const forbidden = [
    "@auth/core",
    "@base-org/account",
    "@coinbase/onchainkit",
    "@prisma/client",
    "better-sqlite3",
    "drizzle-orm",
    "ethers",
    "ioredis",
    "next-auth",
    "pg",
    "postgres",
    "redis",
    "siwe",
    "viem",
    "wagmi",
  ];
  for (const name of forbidden) {
    if (Object.hasOwn(dependencies, name)) {
      add(findings, "package.json", "forbidden-dependency", `${name} is outside the Stage 1 dependency boundary.`);
    }
  }
}

function checkImports(findings, root, file, text) {
  const importPattern = /(?:from\s*|import\s*\(|require\s*\()\s*["']([^"']+)["']/g;
  for (const match of text.matchAll(importPattern)) {
    const specifier = match[1];
    if (specifier.startsWith(".")) {
      const resolved = resolve(root, file, "..", specifier);
      const relativeTarget = relative(root, resolved);
      if (relativeTarget === ".." || relativeTarget.startsWith(`..${sep}`) || isAbsolute(relativeTarget)) {
        add(findings, file, "outside-import", `Relative import escapes the public repository: ${specifier}`);
      }
    }
    if (/^(?:next-auth|siwe|wagmi|viem|pg|postgres|drizzle-orm|@prisma\/client)(?:\/|$)/.test(specifier)) {
      add(findings, file, "private-import", `Private or operational import is not allowed: ${specifier}`);
    }
    const importSegments = specifier.toLowerCase().split(/[\\/]/);
    if (
      importSegments.some((segment) =>
        [
          "api",
          "auth",
          "auth-provider",
          "authentication",
          "creator",
          "creator-studio",
          "database",
          "db",
          "migrations",
          "private-runtime",
          "runtime-config",
          "wallet-auth-dialog",
        ].includes(segment),
      )
    ) {
      add(findings, file, "private-import", `Private application import is not allowed: ${specifier}`);
    }
  }
}

function checkText(findings, root, file, text) {
  checkImports(findings, root, file, text);

  const isValidator = file === "scripts/public-boundary-core.mjs";
  if (isValidator) {
    return;
  }
  if (!explanatoryPrivateCoreReferences.has(file) && /mergen-alpha-core/i.test(text)) {
    add(findings, file, "private-core-reference", "Private core references are limited to boundary documentation.");
  }

  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:ghp|github_pat|sk_live)_[A-Za-z0-9_-]{20,}\b/,
    /\bBearer\s+[A-Za-z0-9._~-]{32,}\b/i,
    /\b(?:private[_-]?key|seed[_-]?phrase|mnemonic)\s*[:=]\s*["'][^"'\r\n]{24,}["']/i,
    /\b0x[a-fA-F0-9]{64}\b/,
  ];
  if (secretPatterns.some((pattern) => pattern.test(text))) {
    add(findings, file, "secret-pattern", "High-confidence secret or wallet-key material detected.");
  }

  if (/\b(?:premiumBody|premium_body|lockedBody|decryptedBody|paidResearchBody)\b/.test(text)) {
    add(findings, file, "premium-sentinel", "Premium-content field sentinel detected.");
  }

  if (file.startsWith("src/") && /https?:\/\/|["']\/\/[a-z0-9]/i.test(text)) {
    add(findings, file, "remote-asset-or-url", "Remote URL detected in application source.");
  }
  if (file.endsWith(".css") && /@import\s+|url\(\s*["']?(?:https?:)?\/\//i.test(text)) {
    add(findings, file, "remote-style", "Remote CSS, font, or asset import detected.");
  }
  if (file.startsWith("src/") && /\b(?:fetch|WebSocket|EventSource)\s*\(/.test(text)) {
    add(findings, file, "network-runtime", "Network runtime calls are not allowed in the static demo.");
  }
  if (/\b(?:sendTransaction|writeContract|useWriteContract|eth_sendTransaction|walletClient)\b/.test(text)) {
    add(findings, file, "wallet-transaction", "Wallet transaction code is not allowed in Stage 1.");
  }
  if (/\b(?:registered on Base\.dev|Base\.dev registration complete|Builder Code (?:enabled|active|integrated))\b/i.test(text)) {
    add(findings, file, "base-registration-claim", "Unapproved Base registration or attribution claim detected.");
  }
}

export function validatePublicBoundary(rootDirectory) {
  const root = resolve(rootDirectory);
  const findings = [];
  checkPackage(findings, root);

  for (const file of walk(root)) {
    checkForbiddenPath(findings, file.relative);
    if (file.special) {
      add(findings, file.relative, "special-file", "Symlinks and special filesystem entries are not allowed.");
      continue;
    }

    const buffer = readFileSync(file.absolute);
    if (isTextFile(file.relative, buffer)) {
      checkText(findings, root, file.relative, buffer.toString("utf8"));
      continue;
    }

    const allowed = allowedBinaryAssets.get(file.relative);
    if (!allowed) {
      add(findings, file.relative, "unexpected-binary", "Binary file is not on the public asset allowlist.");
      continue;
    }
    const hash = createHash("sha256").update(buffer).digest("hex");
    if (buffer.length !== allowed.bytes || hash !== allowed.sha256) {
      add(findings, file.relative, "binary-integrity", "Allowlisted binary size or SHA-256 does not match the audit record.");
    }
  }

  return findings.sort((left, right) => left.file.localeCompare(right.file) || left.rule.localeCompare(right.rule));
}
