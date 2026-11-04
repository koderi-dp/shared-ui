import { Outlet, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "@/ui/primitives/button";
import { Kbd, KbdGroup } from "@/ui/primitives/kbd";
import { Separator } from "@/ui/primitives/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/primitives/sidebar";
import { usePersisted } from "@/ui/use-persisted";
import { cn } from "@/ui/utils";
import { AppSidebar, type Brand } from "./app-sidebar";
import { CommandPalette } from "./command-palette";
import {
  CommandRegistryContext,
  type Command,
  type CommandRegistry,
} from "./command-palette-state";
import type { NavConfig } from "./nav";

export type { Brand };

/**
 * The frame of every page, on shadcn's Sidebar: the sidebar (collapses to icons on
 * desktop with Ctrl+B or the rail, a sheet on a phone), the header with the command
 * palette (Ctrl+K or ⌘K), and the page in the sidebar inset.
 */
export function AppShell({
  nav,
  brand,
  headerEnd,
  sidebarFooter,
  fullHeight,
  storageKey = "app.navCollapsed",
  children,
}: {
  nav: NavConfig;
  brand: Brand;
  /** Chips and buttons at the right of the header: status, the user menu. */
  headerEnd?: ReactNode;
  sidebarFooter?: (collapsed: boolean) => ReactNode;
  /** Pages that scroll their own panes get a fixed-height `<main>` instead of a scrolling one. */
  fullHeight?: (pathname: string) => boolean;
  /** The localStorage key that remembers whether the sidebar is collapsed. */
  storageKey?: string;
  /** The page. Defaults to the router's `<Outlet />`. */
  children?: ReactNode;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [palette, setPalette] = useState(false);
  const [collapsed, setCollapsed] = usePersisted(storageKey, false);
  const [owners, setOwners] = useState<Record<string, Command[]>>({});

  const register = useCallback(
    (owner: string, commands: Command[]) => setOwners((all) => ({ ...all, [owner]: commands })),
    [],
  );
  const unregister = useCallback(
    (owner: string) =>
      setOwners((all) => {
        const next = { ...all };
        delete next[owner];
        return next;
      }),
    [],
  );
  const registry = useMemo<CommandRegistry>(
    () => ({ register, unregister }),
    [register, unregister],
  );
  const commands = useMemo(() => Object.values(owners).flat(), [owners]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setPalette((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandRegistryContext.Provider value={registry}>
      <SidebarProvider
        open={!collapsed}
        onOpenChange={(open) => setCollapsed(!open)}
        className="h-dvh min-h-0 overflow-hidden bg-background text-foreground"
        style={{ "--sidebar-width": "13rem" } as CSSProperties}
      >
        <AppSidebar nav={nav} brand={brand} footer={sidebarFooter} pathname={pathname} />
        <SidebarInset className="min-w-0 overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPalette(true)}
              className="mr-auto h-10 min-w-0 flex-1 justify-start gap-2 bg-inset px-3 font-normal shadow-[var(--shadow-border)] hover:bg-inset hover:shadow-[var(--shadow-border-hover)] lg:max-w-md"
            >
              <Search />
              <span className="min-w-0 flex-1 truncate text-left">Search…</span>
              <KbdGroup className="hidden sm:inline-flex">
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
            {headerEnd}
          </header>
          <div
            className={cn(
              "min-h-0 min-w-0 flex-1",
              fullHeight?.(pathname) ? "flex flex-col overflow-hidden" : "overflow-y-auto",
            )}
          >
            {children ?? <Outlet />}
          </div>
        </SidebarInset>
        <CommandPalette open={palette} onOpenChange={setPalette} nav={nav} commands={commands} />
      </SidebarProvider>
    </CommandRegistryContext.Provider>
  );
}
