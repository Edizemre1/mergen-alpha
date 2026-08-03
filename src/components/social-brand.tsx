import Link from "next/link";

export function SocialBrand({ compact = false }: { readonly compact?: boolean }) {
  return (
    <Link className="social-brand" href="/" aria-label="Mergen Alpha">
      <span className="social-brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="social-brand-copy">
          <strong>Mergen</strong>
          <small>Alpha</small>
        </span>
      )}
    </Link>
  );
}
