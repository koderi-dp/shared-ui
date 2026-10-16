import { Activity, Boxes, FileText, LayoutPanelLeft, Settings } from "lucide-react";
import type { Brand } from "@/ui/layout/app-shell";
import type { NavConfig } from "@/ui/layout/nav";

/** The showcase is an app like any other: it gets its nav and brand the same way. */
export const demoNav: NavConfig = {
  primary: [
    { to: "/", label: "Overview", icon: Activity, keywords: ["home", "dashboard"] },
    { to: "/primitives", label: "Primitives", icon: Boxes, keywords: ["components", "atoms"] },
    { to: "/blocks", label: "Page blocks", icon: FileText, keywords: ["furniture", "list"] },
    { to: "/charts", label: "Charts", icon: LayoutPanelLeft, keywords: ["metrics", "timeline"] },
    { to: "/detail/atlas", label: "Detail", icon: FileText, keywords: ["record", "item"] },
  ],
  secondary: [{ to: "/settings", label: "Settings", icon: Settings, keywords: ["preferences"] }],
};

export const demoBrand: Brand = { name: "Shared UI", tagline: "Showcase", icon: Boxes };
