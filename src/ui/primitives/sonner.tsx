import type * as React from "react";
import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/ui/utils";

/** Sonner on the theme's surfaces. The theme is dark only, so there is no theme switch to read. */
function Toaster({ className, style, ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className={cn("toaster group", className)}
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonX className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-elevated)",
          "--normal-text": "var(--color-foreground)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "var(--radius-sm)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
