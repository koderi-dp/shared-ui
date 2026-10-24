import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readStored } from "./use-persisted";

/** A localStorage stand-in for the Node test environment. */
function fakeStorage(entries: Record<string, string> = {}) {
  const map = new Map(Object.entries(entries));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  };
}

const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

function install(storage: unknown) {
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
}

describe("readStored", () => {
  beforeEach(() => install(fakeStorage()));
  afterEach(() => {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete (globalThis as { localStorage?: unknown }).localStorage;
  });

  it("is the initial value when nothing is stored", () => {
    expect(readStored("k", "15m")).toBe("15m");
  });

  it("is the stored value when there is one", () => {
    install(fakeStorage({ k: JSON.stringify(["a", "b"]) }));
    expect(readStored("k", [] as string[])).toEqual(["a", "b"]);
  });

  it("is the initial value when the stored text is not JSON", () => {
    install(fakeStorage({ k: "overview" }));
    expect(readStored("k", "monitor")).toBe("monitor");
  });

  it("is the initial value when there is no localStorage at all", () => {
    install(undefined);
    expect(readStored("k", "overview")).toBe("overview");
  });

  it("is the initial value when storage throws", () => {
    install({
      getItem() {
        throw new Error("blocked");
      },
    });
    expect(readStored("k", 1)).toBe(1);
  });

  // A stored value outlives the code that wrote it: a tab that was removed, a range that
  // was renamed. The validator is how a page refuses one.
  it("is the initial value when the validator rejects what is stored", () => {
    install(fakeStorage({ k: JSON.stringify("30m") }));
    const isRange = (value: unknown): value is "5m" | "15m" => value === "5m" || value === "15m";
    expect(readStored("k", "15m", isRange)).toBe("15m");
    install(fakeStorage({ k: JSON.stringify("5m") }));
    expect(readStored("k", "15m", isRange)).toBe("5m");
  });
});
