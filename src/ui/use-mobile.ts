import { useEffect, useState } from "react";

/** Below this width the sidebar is a sheet and the layout is the phone one (Tailwind's `md`). */
export const MOBILE_BREAKPOINT = 768;

export function isMobileWidth(width: number, breakpoint = MOBILE_BREAKPOINT): boolean {
  return width < breakpoint;
}

/** Whether the viewport is narrower than `MOBILE_BREAKPOINT`. False until mounted. */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(isMobileWidth(window.innerWidth, breakpoint));
    query.addEventListener("change", onChange);
    onChange();
    return () => query.removeEventListener("change", onChange);
  }, [breakpoint]);
  return isMobile;
}
