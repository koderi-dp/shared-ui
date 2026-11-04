import { Link } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/primitives/sidebar";
import { useSidebar } from "@/ui/primitives/sidebar-context";
import { isNavActive, type NavItem } from "./nav";

/**
 * One group of nav links, as in shadcn's sidebar-07 block: a SidebarMenuButton per
 * item, with its label as the tooltip when the sidebar is collapsed to icons.
 */
export function NavMain({
  items,
  pathname,
  label,
}: {
  items: readonly NavItem[];
  pathname: string;
  /** A heading over the group; it hides when the sidebar is collapsed. */
  label?: string;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const active = isNavActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className="h-9 text-muted-foreground data-[active=true]:font-medium data-[active=true]:text-foreground"
                >
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
