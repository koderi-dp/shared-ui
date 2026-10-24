import { useCallback, useMemo, useSyncExternalStore } from "react";

const CHANGED = "persisted-change";

/** Holds a value for this page's lifetime when localStorage is full or blocked. */
const memory = new Map<string, string>();

/**
 * Reads a stored value. The initial value is returned when storage is missing or throws,
 * when nothing is stored, when the stored text is not JSON (an older format), or when
 * `isValid` rejects the parsed value: a stored value outlives the code that wrote it, and
 * the validator is how a page refuses a tab that no longer exists or a renamed option.
 */
export function readStored<T>(
  key: string,
  initial: T,
  isValid?: (value: unknown) => value is T,
): T {
  try {
    const stored = memory.get(key) ?? localStorage.getItem(key);
    if (stored === null) return initial;
    const parsed: unknown = JSON.parse(stored);
    if (isValid && !isValid(parsed)) return initial;
    return parsed as T;
  } catch {
    return initial;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGED, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGED, onChange);
  };
}

/**
 * State kept in localStorage, so a reload keeps it. A value that cannot be read is the
 * initial one. The server render and the first client render use the initial value, so a
 * server-rendered page hydrates without a mismatch and then shows the stored value.
 * Values are compared by their JSON, so objects and arrays work too. `isValid` rejects a
 * stored value the current code cannot use, which then reads as the initial one.
 */
export function usePersisted<T>(
  key: string,
  initial: T,
  isValid?: (value: unknown) => value is T,
): [T, (next: T) => void] {
  const initialJson = JSON.stringify(initial);
  const json = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(readStored(key, initial, isValid)),
    () => initialJson,
  );
  const set = useCallback(
    (next: T) => {
      const json = JSON.stringify(next);
      try {
        localStorage.setItem(key, json);
        memory.delete(key);
      } catch {
        memory.set(key, json);
      }
      window.dispatchEvent(new Event(CHANGED));
    },
    [key],
  );
  // The same reference while the stored JSON is the same, so an object or array from here
  // can sit in a dependency list or a controlled tree's state without reading as a change.
  const value = useMemo(() => JSON.parse(json) as T, [json]);
  return [value, set];
}
