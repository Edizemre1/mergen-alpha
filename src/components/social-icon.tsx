export type SocialIconName =
  | "home"
  | "explore"
  | "research"
  | "notifications"
  | "bookmarks"
  | "profile"
  | "compose"
  | "search"
  | "filter"
  | "reply"
  | "repost"
  | "like"
  | "chart"
  | "share"
  | "follow"
  | "close"
  | "open"
  | "check"
  | "network";

const glyphs: Readonly<Record<SocialIconName, string>> = {
  home: "\u2302",
  explore: "\u2315",
  research: "\u25a4",
  notifications: "\u25c9",
  bookmarks: "\u25a3",
  profile: "\u25cb",
  compose: "\u270e",
  search: "\u2315",
  filter: "\u2261",
  reply: "\u21a9",
  repost: "\u21bb",
  like: "\u2661",
  chart: "\u25f3",
  share: "\u2197",
  follow: "+",
  close: "\u00d7",
  open: "\u2197",
  check: "\u2713",
  network: "\u25c7",
};

export function SocialIcon({ name }: { readonly name: SocialIconName }) {
  return (
    <span className="social-icon" data-icon={name} aria-hidden="true">
      {glyphs[name]}
    </span>
  );
}
