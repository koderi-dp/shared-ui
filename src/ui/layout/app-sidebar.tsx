import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/ui/primitives/sidebar";
import { useSidebar } from "@/ui/primitives/sidebar-context";
import type { NavConfig } from "./nav";
import { NavMain } from "./nav-main";

export type Brand = {
  name: string;
  /** A second line under the name, such as the product area. */
  tagline?: string;
  icon: LucideIcon;
};

/**
 * The app's sidebar, after shadcn's sidebar-07 block: it collapses to icons on desktop
 * and is a sheet on a phone. The brand sits in the header, the primary and secondary
 * nav below it, and the caller's footer at the bottom.
 */
export function AppSidebar({
  nav,
  brand,
  footer,
  pathname,
  ...props
}: ComponentProps<typeof Sidebar> & {
  nav: NavConfig;
  brand: Brand;
  footer?: (collapsed: boolean) => ReactNode;
  pathname: string;
}) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const Icon = brand.icon;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 justify-center py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={brand.name} className="h-10">
              <Link
                to="/"
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground shadow-[var(--shadow-border)]">
                  <Icon className="size-4" />
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    {brand.name}
                  </span>
                  {brand.tagline ? (
                    <span className="truncate text-[11px] text-muted-foreground">
                      {brand.tagline}
                    </span>
                  ) : null}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain items={nav.primary} pathname={pathname} />
        {nav.secondary?.length ? (
          <>
            <SidebarSeparator />
            <NavMain items={nav.secondary} pathname={pathname} />
          </>
        ) : null}
      </SidebarContent>
      {footer ? (
        <SidebarFooter className={collapsed ? "items-center px-2 py-3" : "px-3 py-3"}>
          {footer(collapsed)}
        </SidebarFooter>
      ) : null}
      <SidebarRail />
    </Sidebar>
  );
}
