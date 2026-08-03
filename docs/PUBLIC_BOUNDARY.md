# Public Boundary

## Purpose

This repository is a permanently public, non-operational interface demo. It demonstrates product hierarchy, responsive navigation, disclosure-forward financial research presentation, EN/TR interface localization, and browser-local interactions.

The Stage 1 presentation uses the approved Mergen social-network composition: a persistent desktop sidebar, dense central feed, contextual discovery rail, responsive mobile top bar, and five-slot bottom navigation. Only visual structure and public-safe styling tokens were manually recreated. The public implementation is backed exclusively by this repository's fictional DTOs, fixtures, locale dictionary, and versioned browser-local state.

The private core is a separate repository with separate history and access control. Its source, configuration, tests, fixtures, operations, and Git metadata must never be copied or merged here.

## Allowed

- Static App Router pages and presentation components.
- Fictional, public-safe, invariant demo fixtures.
- Generic UI types and locale utilities implemented specifically for this repository.
- Browser-local demo state with no account or server claim.
- Individually audited local brand assets listed in `PORTED_ASSETS.md`.
- Public documentation describing this boundary.
- Public-safe charts derived from fixed fictional arrays and labeled as illustrative, never live market data.

## Forbidden

- `src/app/api`, route handlers, private runtime modules, server actions, live service URLs, or imports outside this checkout.
- Auth, session, cookie-security, SIWE, wallet connection, signing, or transaction code.
- Database drivers, queries, migrations, schemas, grants, roles, persistence, or private identifiers.
- Creator Studio, publication writes, premium delivery, payments, subscriptions, contracts, moderation, ranking, anti-abuse, or analytics.
- Environment files, deploy directories, Docker/Compose, VPS/Nginx/systemd material, private CI, secrets, or credentials.
- Real user data, unpublished research, premium bodies, wallet recovery material, private keys, or token-like credentials.
- Numeric performance, subscriber, revenue, activity, or ranking claims presented as product truth.

## Backport Policy

There is no automatic synchronization and no private-to-public Git merge. A future public change requires:

1. A narrow written public-demo objective.
2. An explicit file-level allowlist.
3. Manual recreation or audited asset copy into a clean public branch.
4. Review for private imports, operational assumptions, user data, premium content, and dependency expansion.
5. Full public boundary, secret, remote-asset, binary, premium, test, build, and audit validation.

References to the private core name are allowed only in boundary documentation and validator policy. Application source must not reference it.
