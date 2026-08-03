# Localization

Stage 1 supports `en` and `tr` without locale-prefixed routes or an i18n dependency.

## Initial Locale

The server resolves every request in this order:

1. A valid `mergen-locale` cookie containing exactly `en` or `tr`.
2. A bounded and validated `Accept-Language` header. `tr` and every valid `tr-*` range map to Turkish; supported English ranges and wildcard map to English.
3. English fallback.

The cookie has explicit precedence. The server writes the resolved locale into the first response's `<html lang>` and passes that same locale to the client provider, avoiding browser-language competition, first-paint language changes, and hydration mismatch.

The language switcher validates the selected locale, writes only the locale cookie, announces the target language accessibly, and requests a framework refresh. It does not mutate `document.documentElement.lang`.

## Translation Boundary

Translated:

- Navigation, headings, buttons, filters, states, accessibility labels, metadata, legal notices, wallet-coming-soon presentation, and demo disclosures.

Invariant:

- Fictional authored posts, Research Card titles and content, biographies, names, handles, ticker symbols, source titles, dates, URLs, IDs, and local-storage keys.

Dates are formatted centrally in UTC. React keys, storage keys, route slugs, and DOM identities never depend on translated text.
