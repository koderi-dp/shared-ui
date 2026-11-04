import { createContext, useContext } from "react";

export const SIDEBAR_COOKIE_NAME = "sidebar_state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar(): SidebarContextProps {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

/** The cookie that remembers whether the sidebar is open, as `document.cookie` takes it. */
export function sidebarCookie(open: boolean): string {
  return `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}

/** The open state stored in a cookie string, or `fallback` when there is none. */
export function readSidebarCookie(cookies: string, fallback = true): boolean {
  const entry = cookies
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
  if (!entry) return fallback;
  const value = entry.slice(SIDEBAR_COOKIE_NAME.length + 1);
  return value === "true" ? true : value === "false" ? false : fallback;
}

/** Whether a keydown is the toggle shortcut (Ctrl+B, or ⌘B on a Mac). */
export function isSidebarShortcut(event: { key: string; metaKey: boolean; ctrlKey: boolean }) {
  return event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey);
}
