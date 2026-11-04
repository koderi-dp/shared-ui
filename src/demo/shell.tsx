import { Outlet } from "@tanstack/react-router";
import { AppShell } from "@/ui/layout/app-shell";
import { ModeToggle } from "@/ui/mode-toggle";
import { ThemeProvider } from "@/ui/theme-provider";
import { AppToaster } from "@/ui/toaster";
import { AccountFooter, HeaderStatus, UserMenu } from "./header";
import { demoBrand, demoNav } from "./nav";

/** Providers and one-off mounts, above the shell so the login-style pages could use them too. */
export function RootLayout() {
  return (
    <ThemeProvider>
      <Outlet />
      <AppToaster />
    </ThemeProvider>
  );
}

export function ShellLayout() {
  return (
    <AppShell
      nav={demoNav}
      brand={demoBrand}
      headerEnd={
        <>
          <HeaderStatus />
          <ModeToggle />
          <UserMenu />
        </>
      }
      sidebarFooter={(collapsed) => <AccountFooter collapsed={collapsed} />}
      // The detail page scrolls its own panes, so it gets a fixed-height main.
      fullHeight={(pathname) => pathname.startsWith("/detail")}
    />
  );
}
