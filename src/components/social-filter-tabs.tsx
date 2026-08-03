"use client";

import type { KeyboardEvent } from "react";
import { useRef } from "react";

export function SocialFilterTabs<T extends string>({
  ariaLabel,
  controlsId,
  idPrefix,
  items,
  label,
  onChange,
  value,
  variant = "tabs",
}: {
  readonly ariaLabel: string;
  readonly controlsId: string;
  readonly idPrefix: string;
  readonly items: readonly T[];
  readonly label: (item: T) => string;
  readonly onChange: (value: T) => void;
  readonly value: T;
  readonly variant?: "tabs" | "pills";
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next === null) return;
    event.preventDefault();
    onChange(items[next]);
    refs.current[next]?.focus();
  }

  return (
    <div className={`social-filter-tabs social-filter-tabs-${variant}`} role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const active = item === value;
        return (
          <button
            data-active={active}
            id={`${idPrefix}-${index}`}
            type="button"
            role="tab"
            aria-controls={controlsId}
            aria-selected={active}
            key={item}
            ref={(node) => {
              refs.current[index] = node;
            }}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item)}
            onKeyDown={(event) => moveFocus(event, index)}
          >
            {label(item)}
          </button>
        );
      })}
    </div>
  );
}
