import { describe, expect, it } from "vitest";
import { isSidebarShortcut, readSidebarCookie, sidebarCookie } from "./sidebar-context";

describe("sidebar cookie", () => {
  it("round-trips the open state", () => {
    const [pair] = sidebarCookie(false).split(";");
    expect(readSidebarCookie(`theme=dark; ${pair}`)).toBe(false);
    expect(readSidebarCookie(sidebarCookie(true).split(";")[0])).toBe(true);
  });

  it("falls back when the cookie is missing or garbled", () => {
    expect(readSidebarCookie("")).toBe(true);
    expect(readSidebarCookie("sidebar_state=maybe", false)).toBe(false);
  });

  it("keeps a week", () => {
    expect(sidebarCookie(true)).toContain("max-age=604800");
  });
});

describe("isSidebarShortcut", () => {
  it("takes Ctrl+B and ⌘B only", () => {
    expect(isSidebarShortcut({ key: "b", ctrlKey: true, metaKey: false })).toBe(true);
    expect(isSidebarShortcut({ key: "B", ctrlKey: false, metaKey: true })).toBe(true);
    expect(isSidebarShortcut({ key: "b", ctrlKey: false, metaKey: false })).toBe(false);
    expect(isSidebarShortcut({ key: "k", ctrlKey: true, metaKey: false })).toBe(false);
  });
});
