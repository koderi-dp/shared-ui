import { describe, expect, it } from "vitest";
import { isMobileWidth, MOBILE_BREAKPOINT } from "./use-mobile";

describe("isMobileWidth", () => {
  it("is mobile below the breakpoint and desktop from it", () => {
    expect(isMobileWidth(MOBILE_BREAKPOINT - 1)).toBe(true);
    expect(isMobileWidth(MOBILE_BREAKPOINT)).toBe(false);
  });

  it("takes another breakpoint", () => {
    expect(isMobileWidth(1000, 1024)).toBe(true);
    expect(isMobileWidth(1024, 1024)).toBe(false);
  });
});
