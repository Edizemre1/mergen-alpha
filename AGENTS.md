# Mergen Alpha Public Demo Rules

These rules apply to every file in this repository. A narrower `AGENTS.md` may add constraints but may not weaken them.

## Public Boundary

This repository is a permanently public, presentation-only Mergen Alpha interface demo. Treat every committed byte and every browser-delivered value as public.

- Keep application data fictional, stable, and conspicuously covered by the global Demo disclosure.
- Keep authored fixture text invariant across locales. Translate only interface copy, metadata, accessibility text, and system disclosures.
- Do not add API routes, authentication, sessions, SIWE, wallet connectors, transaction submission, databases, persistence services, Creator Studio, research publishing, premium bodies, payments, contracts, admin systems, deployment files, private operations, or production credentials.
- Do not import or copy from the private core repository. There are no private-to-public merges, shared Git history, automatic synchronization, or filesystem imports outside this checkout.
- Port a public-safe change only by manual, file-level review with an explicit allowlist and fresh validation.
- Never commit secrets, wallet recovery material, private data, real premium content, real user data, live prices, fabricated performance, or proprietary logic.
- Do not claim Base.dev registration, Builder Code attribution, token rewards, an airdrop, regulatory approval, or endorsement by Base or Coinbase.

## Stage 1 Product Rules

- Use the Next.js App Router, strict TypeScript, semantic HTML, accessible React components, and dependency-free EN/TR localization.
- Resolve locale on the server in this order: valid `mergen-locale` cookie, bounded validated `Accept-Language`, then English.
- Keep demo interactions browser-local under the versioned storage key. Never imply account, server, or cross-device persistence.
- Keep wallet presentation non-interactive and label it accurately as coming soon.
- Use local assets and system fonts only. No remote fonts, CSS, images, analytics, or private service URLs.
- Preserve keyboard access, visible focus, responsive layouts, readable contrast, and reduced-motion behavior.

## Change Discipline

Before committing, inspect the complete diff, run lint, typecheck, focused and full tests, the boundary validator, production build, both npm audits, secret/remote/binary/premium scans, and `git diff --check`. Do not commit, push, deploy, or enable the disabled push URL without explicit authorization.

## CHATGPT HANDOFF

At the end of every Codex task, include a concise final-response section named exactly `CHATGPT HANDOFF`, preferably no more than 25 lines. Include:

- Objective completed.
- Important files changed.
- Architecture and security decisions.
- Commands and validation results.
- Failures, warnings, or blockers.
- Current branch, commit, and pull request.
- Exact recommended next task.
