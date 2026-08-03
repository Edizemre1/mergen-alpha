const tones = ["blue", "mint", "amber", "rose", "violet"] as const;

function toneFor(initials: string): (typeof tones)[number] {
  const value = [...initials].reduce((total, character) => total + character.charCodeAt(0), 0);
  return tones[value % tones.length];
}

export function SocialAvatar({
  initials,
  large = false,
  size,
  label,
}: {
  readonly initials: string;
  readonly large?: boolean;
  readonly size?: "small" | "medium" | "large";
  readonly label?: string;
}) {
  const resolvedSize = size ?? (large ? "large" : "medium");
  return (
    <span
      className="social-avatar"
      data-size={resolvedSize}
      data-tone={toneFor(initials)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span aria-hidden="true">{initials}</span>
    </span>
  );
}
