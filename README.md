# Mergen Alpha Public Demo

Mergen Alpha is a public interface demo for a future Base-native financial research network. This repository contains only the bilingual presentation layer, static fictional fixtures, and browser-local interactions needed to inspect the Stage 1 product direction.

The production backend and core product are private and are not synchronized into this repository. There are no private-to-public merges or shared Git history. Any future backport must be manually recreated from an explicit, file-level public-safe allowlist.

## Stage 1 Boundaries

- Every analyst, handle, post, Research Card, notification, profile, interaction, and activity item is fictional.
- No live prices, real wallet addresses, verified credentials, performance claims, paid research body, or user data are included.
- There is no API, account, authentication, database, Creator Studio, payment, wallet connection, signature request, or transaction submission.
- Likes, bookmarks, follows, and dismissed notifications remain only in versioned browser storage and can be reset from Profile.
- English and Turkish interface localization is server-owned. Authored fictional research and posts do not change language.

## Local Validation

Use Node.js `22.21.1` with Unicode `16.0` and ICU `77.1`.

```powershell
npm ci
npm run lint
npm run typecheck
npm run test:focused
npm test
npm run validate:boundary
npm run build
npm audit
npm audit --omit=dev
```

No environment file, external service, Docker runtime, or PostgreSQL instance is required.

## Production Runtime

The canonical public URL is `https://alpha.mergen.finance`. A production build emits
Next.js standalone output, but the release artifact must be assembled from all three
required payloads:

- `.next/standalone/`
- `public/`
- `.next/static/`

The deployable artifact must be built and validated in an approved Linux x86_64
environment. Windows builds are validation-only and must not be deployed to Linux.
The production VPS receives the prebuilt immutable artifact; it does not require Git,
build tooling, a database, an application environment file, or application secrets.

See [Public Boundary](docs/PUBLIC_BOUNDARY.md), [Localization](docs/LOCALIZATION.md), [Demo Data](docs/DEMO_DATA.md), and [Ported Assets](docs/PORTED_ASSETS.md).
