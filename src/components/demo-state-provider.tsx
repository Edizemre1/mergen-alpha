"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const DEMO_STATE_STORAGE_KEY = "mergen-public-demo:v1";
const MAX_STATE_ITEMS = 200;
const MAX_ID_LENGTH = 100;

export interface DemoState {
  readonly version: 1;
  readonly likedPostIds: readonly string[];
  readonly bookmarkedItemIds: readonly string[];
  readonly followedAnalystIds: readonly string[];
  readonly dismissedNotificationIds: readonly string[];
}

export const EMPTY_DEMO_STATE: DemoState = {
  version: 1,
  likedPostIds: [],
  bookmarkedItemIds: [],
  followedAnalystIds: [],
  dismissedNotificationIds: [],
};

function freshEmptyDemoState(): DemoState {
  return {
    version: 1,
    likedPostIds: [],
    bookmarkedItemIds: [],
    followedAnalystIds: [],
    dismissedNotificationIds: [],
  };
}

function validIds(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.length > MAX_STATE_ITEMS) {
    return null;
  }

  const ids = value.filter(
    (item): item is string =>
      typeof item === "string" && item.length > 0 && item.length <= MAX_ID_LENGTH,
  );
  return ids.length === value.length ? [...new Set(ids)] : null;
}

export function parseStoredDemoState(raw: string | null): DemoState {
  if (!raw) {
    return EMPTY_DEMO_STATE;
  }

  try {
    const candidate: unknown = JSON.parse(raw);
    if (!candidate || typeof candidate !== "object" || !("version" in candidate)) {
      return EMPTY_DEMO_STATE;
    }

    const record = candidate as Record<string, unknown>;
    const likedPostIds = validIds(record.likedPostIds);
    const bookmarkedItemIds = validIds(record.bookmarkedItemIds);
    const followedAnalystIds = validIds(record.followedAnalystIds);
    const dismissedNotificationIds = validIds(record.dismissedNotificationIds);

    if (
      record.version !== 1 ||
      !likedPostIds ||
      !bookmarkedItemIds ||
      !followedAnalystIds ||
      !dismissedNotificationIds
    ) {
      return EMPTY_DEMO_STATE;
    }

    return {
      version: 1,
      likedPostIds,
      bookmarkedItemIds,
      followedAnalystIds,
      dismissedNotificationIds,
    };
  } catch {
    return EMPTY_DEMO_STATE;
  }
}

function toggleId(ids: readonly string[], id: string): readonly string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

function stateForMutation(current: DemoState, hydrated: boolean): DemoState {
  if (hydrated || current !== EMPTY_DEMO_STATE) {
    return current;
  }
  return parseStoredDemoState(window.localStorage.getItem(DEMO_STATE_STORAGE_KEY));
}

interface DemoStateContextValue {
  readonly state: DemoState;
  readonly hydrated: boolean;
  readonly toggleLike: (id: string) => void;
  readonly toggleBookmark: (id: string) => void;
  readonly toggleFollow: (id: string) => void;
  readonly dismissNotification: (id: string) => void;
  readonly reset: () => void;
}

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<DemoState>(EMPTY_DEMO_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    const storedState = parseStoredDemoState(window.localStorage.getItem(DEMO_STATE_STORAGE_KEY));
    queueMicrotask(() => {
      if (active) {
        setState((current) => current === EMPTY_DEMO_STATE ? storedState : current);
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(DEMO_STATE_STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const value = useMemo<DemoStateContextValue>(
    () => ({
      state,
      hydrated,
      toggleLike: (id) =>
        setState((current) => {
          const base = stateForMutation(current, hydrated);
          return { ...base, likedPostIds: toggleId(base.likedPostIds, id) };
        }),
      toggleBookmark: (id) =>
        setState((current) => {
          const base = stateForMutation(current, hydrated);
          return { ...base, bookmarkedItemIds: toggleId(base.bookmarkedItemIds, id) };
        }),
      toggleFollow: (id) =>
        setState((current) => {
          const base = stateForMutation(current, hydrated);
          return { ...base, followedAnalystIds: toggleId(base.followedAnalystIds, id) };
        }),
      dismissNotification: (id) =>
        setState((current) => {
          const base = stateForMutation(current, hydrated);
          return {
            ...base,
            dismissedNotificationIds: base.dismissedNotificationIds.includes(id)
              ? base.dismissedNotificationIds
              : [...base.dismissedNotificationIds, id],
          };
        }),
      reset: () => setState(freshEmptyDemoState()),
    }),
    [hydrated, state],
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState(): DemoStateContextValue {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error("useDemoState must be used within DemoStateProvider");
  }
  return context;
}
