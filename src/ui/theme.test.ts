import { describe, expect, it } from "vitest";
import { applyTheme, isTheme, resolveTheme } from "./theme";

function fakeRoot(initial: string[] = []) {
  const set = new Set(initial);
  return {
    classList: {
      add: (...names: string[]) => names.forEach((n) => set.add(n)),
      remove: (...names: string[]) => names.forEach((n) => set.delete(n)),
    } as unknown as DOMTokenList,
    set,
  };
}

describe("resolveTheme", () => {
  it("keeps an explicit choice", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the OS for system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("isTheme", () => {
  it("accepts the three names only", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("system")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("applyTheme", () => {
  it("swaps the class on the root", () => {
    const root = fakeRoot(["dark", "keep"]);
    applyTheme(root, "light");
    expect([...root.set].sort()).toEqual(["keep", "light"]);
  });
});
