import type * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/ui/utils";

function Progress({
  className,
  indicatorClassName,
  value,
  children,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Classes for the filled part, such as a colour that follows the level. */
  indicatorClassName?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 bg-primary transition-transform", indicatorClassName)}
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value ?? 0))}%)` }}
      />
      {children}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
